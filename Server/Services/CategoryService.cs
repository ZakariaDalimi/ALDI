using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Data;

namespace Server.Services;



public class CategoryService(ApplicationDbContext context, IConfiguration configuration)
{
    private readonly ApplicationDbContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    

    public async Task<dynamic> GetCategories()
    {
        return await _context.Categories
         .Select(c => new
        {
            c.CategoryId,
            c.Name,
            Products = c.Products.Select(p => new
            {
                p.ProductId,
                p.Name,
                p.Brand,
                p.Price,
                p.ImageUrl,
                p.SalesUnit,
                p.IsDiscount,
                p.OriginalPrice,
                p.ValidityStart,
                p.ValidityEnd,
                p.OfferCategory,
                p.OfferSectionTitle,
                Categories = p.Categories.Select( cat => new
                {
                    cat.CategoryId,
                    cat.Name
                })
            })
        })
        .ToListAsync();
    }


    public async Task<int?> GetCategoryIdByName( string categoryName)
    {
        return await _context.Categories
            .Where(c=> c.Name == categoryName)
            .Select(c => c.CategoryId)
            .FirstOrDefaultAsync();
    }




    public async Task<bool> ImportCategory(JsonArray categoriesArray)
    {

        if (categoriesArray == null || categoriesArray.Count == 0) return false;
        
        if (await _context.Products.AnyAsync()) return false;


        int savedCount = 0;
        foreach (var item in categoriesArray)
            {
            string categoryName = item?["name"]?.ToString() ?? string.Empty;

            if (string.IsNullOrEmpty(categoryName)) continue;

            bool exists = _context.Categories.Any(c => c.Name == categoryName);
            if (exists) continue;

            var newCategory = new Category
            {
                Name = categoryName,
                Products = []
            };

            _context.Categories.Add(newCategory);
            savedCount++;
        }
        

        if (savedCount > 0)
        {
            await _context.SaveChangesAsync();
            return true; 
        }

        return false;
    }

    public async Task<IActionResult> ImportCategoriesFromApi()
    {
        using var client = new HttpClient();
        var apiKey = _configuration["ApiSettings:ApiKey"];
        var baseUrl = _configuration["ApiSettings:BaseUrl"];

        var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}get_product_categories");
        request.Headers.Add("X-API-Key", apiKey);

        try
        {
            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                string errorContent = await response.Content.ReadAsStringAsync();
                return new ObjectResult(errorContent) { StatusCode = (int)response.StatusCode };
            }

            var jsonDoc = await response.Content.ReadFromJsonAsync<JsonNode>();
            var categoriesArray = jsonDoc?["data"]?["categories"]?.AsArray();

            if (categoriesArray == null)
            {
                return new BadRequestObjectResult("API response structure was invalid or empty.");
            }

            try
            {
                bool isImported = await ImportCategory(categoriesArray);

                if (isImported)
                {
                    return new OkObjectResult("Data successfully imported to database.");
                }

                return new OkObjectResult("Import skipped. The categories Array is empty or the categories are already saved in the database.");
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"There is an error while importing categories: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            return new ObjectResult($"Server error: {ex.Message}") { StatusCode = 500 };
        }
    }

}