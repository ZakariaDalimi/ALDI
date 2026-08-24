using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
namespace Server.Services;


public class ProductService(ApplicationDbContext context, CategoryService categoryService)
{

    public readonly ApplicationDbContext _context = context;

    public readonly CategoryService _categoryService = categoryService;



    public async Task<dynamic> GetProducts(string? sortBy, string? brand, DateTime? validOnDate = null)
        {
            IQueryable<Product> query = _context.Products.Where(p => p.IsDiscount == false);

            if (validOnDate.HasValue)
            {
                var date = validOnDate.Value.Date;
                query = query.Where(p =>
                    (!p.ValidityStart.HasValue || p.ValidityStart.Value.Date <= date) &&
                    (!p.ValidityEnd.HasValue || p.ValidityEnd.Value.Date >= date));
            }

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


    public async Task<Product?> GetProductById( int productId)
    {
        return await _context.Products.FindAsync(productId);
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