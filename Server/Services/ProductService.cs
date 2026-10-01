using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Server.Data;
using Server.Models;
namespace Server.Services;


public class ProductService(ApplicationDbContext context, CategoryService categoryService, IConfiguration configuration)
{

    public readonly ApplicationDbContext _context = context;

    public readonly CategoryService _categoryService = categoryService;
    private readonly IConfiguration _configuration = configuration;



    public async Task<dynamic> GetProducts(string? sortBy, string? brand)
        {
            IQueryable<Product> query = _context.Products.Where(p => p.IsDiscount == false);

            switch(sortBy)
            {
                case "name_asc":
                    query = query.OrderBy(p => p.Name);
                    break;
                case "name_desc":
                    query = query.OrderByDescending(p => p.Name);
                    break;
                case "price_asc":
                    query = query.OrderBy(p => p.Price);
                    break;
                case "price_desc":
                    query = query.OrderByDescending(p => p.Price);
                    break;            
            }


            if(brand != null)
            {
                query = query.Where(p => EF.Functions.Like(p.Brand, $"{brand}"));
            }

            
            return await query.ToListAsync();
        }


    public async Task<object?> GetProductById(int productId)
    {
        var product = await _context.Products
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.ProductId == productId);

        if (product == null)
            return null;

        List<Product> similarProducts;    

        if (product.IsDiscount){
            similarProducts = await _context.Products
                .Where(p => p.ProductId != product.ProductId)
                .Where(p => p.IsDiscount == true)
                .Where(p => p.OfferCategory == product.OfferCategory)
                .Where(p => p.OfferSectionTitle == product.OfferSectionTitle)
                .Include(p => p.Categories)
                .Take(10)
                .ToListAsync();
        }else{
            var categoryIds = product.Categories
                .Select(c => c.CategoryId)
                .ToList();

                similarProducts = await _context.Products
                .Where(p => p.ProductId != product.ProductId)
                .Where(p => p.Categories.Any(c => categoryIds.Contains(c.CategoryId)))
                .Include(p => p.Categories)
                .Select(p => new
                {
                    Product = p,
                    MatchCount = p.Categories.Count(c =>
                        categoryIds.Contains(c.CategoryId))
                })
                .OrderByDescending(x => x.MatchCount)
                .Take(10)
                .Select(x => x.Product)
                .ToListAsync();
        }


        return new 
        {
            Product = product,
            SimilarProducts = similarProducts
        };
    }


    public async Task<(bool ConfigurationMissing, bool CategoriesMissing, bool Imported)> ImportProducts()
    {
        const int limit = 220;
        var categories = await _categoryService.GetCategories();

        if (categories.Count <= 0)
            return (false, true, false);

        var apiKey = _configuration["ApiSettings:ApiKey"];
        var baseUrl = _configuration["ApiSettings:BaseUrl"];

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(baseUrl))
            return (true, false, false);

        int fetchedCount = 0;
        int savedCount = 0;

        using var client = new HttpClient();

        await _context.Database.ExecuteSqlRawAsync("DELETE FROM CategoryProduct;");
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM sqlite_sequence WHERE name='CategoryProduct';");

        var nonDiscountedProducts = _context.Products.Where(p => p.IsDiscount == false);
        _context.Products.RemoveRange(nonDiscountedProducts);
        await _context.SaveChangesAsync();

        foreach (var category in categories)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}get_products_by_category?limit={limit}&category_name={category.Name}");
            request.Headers.Add("X-API-Key", apiKey);

            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode) continue;

            var jsonDoc = await response.Content.ReadFromJsonAsync<JsonNode>();
            var productsArray = jsonDoc?["data"]?["products"]?.AsArray();
            if (productsArray == null) continue;

            fetchedCount++;

            if (fetchedCount > 0 && productsArray.Count != 0)
            {
                bool isImported = await ImportProduct(productsArray, category.CategoryId);
                if (isImported) savedCount++;
            }
        }

        return (false, false, fetchedCount > 0 && savedCount > 0);
    }



    public async Task<bool> ImportProduct( JsonArray productsArray , int categoryId)
    {

        if(productsArray == null || productsArray.Count == 0) return false;

        int savedCount = 0;
        foreach (var item in productsArray)
        {
            if (item == null) continue;

            var name =  item?["name"]?.ToString() ?? string.Empty;
            var brand =  item?["brand"]?.ToString() ?? string.Empty;
            var imageUrl = item?["image_url"]?.ToString() ?? string.Empty;
            var salesUnit = item?["sales_unit"]?.ToString() ?? string.Empty;
            decimal? price = item?["price"]?.GetValue<decimal>();
            var categories = item?["categories"]?["lvl0"]?.AsArray();

            var productCategories = new List<Category>();

            if( categories != null)
            {
                foreach(var cat in categories)
                {
                    string catName = cat!.GetValue<string>();
                    var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == catName); 

                    if (category != null)
                    {
                        productCategories.Add(category);
                    }
                }
            }

            
            if (string.IsNullOrEmpty(name) || 
                string.IsNullOrEmpty(brand) || 
                string.IsNullOrEmpty(imageUrl) ||
                productCategories.Count == 0 ||
                price == null ||
                price <= 0m) continue;
                

            var product = new Product
            {
                Name =  name,
                Brand =  brand,
                Slug = item?["slug"]?.ToString() ?? string.Empty,
                Price = price,
                SalesUnit = salesUnit,
                ImageUrl = imageUrl,
                IsDiscount = false,
                Categories = productCategories
            };

            _context.Products.Add(product);
            savedCount++;
        }


        if (savedCount > 0)
        {
            await _context.SaveChangesAsync();
            return true; 
        }

        return false;
    }
   


}