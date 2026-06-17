using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;
using ReactWithASP.Server.Services;
using System.Text.Json;
using ReactwithASP.Server.Models;
namespace ReactwithASP.Server.Services;


public class ProductService(ApplicationDbContext context, CategoryService categoryService)
{

    public readonly ApplicationDbContext _context = context;

    public readonly CategoryService _categoryService = categoryService;



    public async Task<Product?> GetProductById( int productId)
    {
        return await _context.Products.FindAsync(productId);
    }


    public async Task<bool> ImportProduct( JsonArray productsArray , int categoryId)
    {


        if(productsArray.Count == 0 || productsArray == null ) return false;

        int savedCount = 0;
        foreach (var item in productsArray)
        {

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