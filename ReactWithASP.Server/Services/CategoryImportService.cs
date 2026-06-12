using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ReactwithASP.Server.Models;
using ReactWithASP.Server.Data;

namespace ReactWithASP.Server.Services;



public class CategoryImportService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;
    

    public async Task<bool> ImportCategory(JsonArray categoriesArray)
    {

        if (categoriesArray == null || categoriesArray.Count == 0) return false;
        
        if (await _context.Products.AnyAsync()) return false;


        int savedCount = 0;
        foreach (var item in categoriesArray)
            {
            string categoryName = item?["name"]?.ToString() ?? string.Empty;
            int productCount = item?["count"]?.GetValue<int>() ?? 0;

            if (string.IsNullOrEmpty(categoryName)) continue;

            bool exists = _context.Categories.Any(c => c.Name == categoryName);
            if (exists) continue;

            var newCategory = new Category
            {
                Name = categoryName,
                Count = productCount,
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

}