using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ReactwithASP.Server.Models;
using ReactWithASP.Server.Data;

namespace ReactWithASP.Server.Services;



public class CategoryService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;
    

    public async Task<dynamic> GetCategories()
    {

        return await _context.Categories
            .Select(c => new
            {
                Id = c.CategoryId,
                Name = c.Name
            }).ToListAsync();
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

}