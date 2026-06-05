namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactwithASP.Server.Models;
using System.Text.Json.Nodes;
using ReactWithASP.Server.Services;

[Route("api/[controller]")]
[ApiController]
public class CategoryController(ApplicationDbContext context, CategoryImportService categoryImportService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private readonly CategoryImportService _categoryImportService = categoryImportService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        var data = await _context.Categories.ToListAsync();
        return Ok(data);
    }


    [HttpGet("import")]
    public async Task<IActionResult> ImportCategories()
    {
        using var client = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Get, "https://api.parse.bot/scraper/3e8a2517-2748-4ad2-809c-d99f0bc32914/get_product_categories");

        request.Headers.Add("X-API-Key", "pmx_e1f7b5c621ba17cdd291feecfb899881");
        request.Headers.Add("Accept", "application/json");

        try
        {
            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                string errorContent = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, errorContent);
            }

            var jsonDoc = await response.Content.ReadFromJsonAsync<JsonNode>();
                
            
            var categoriesArray = jsonDoc?["data"]?["categories"]?.AsArray();

            if (categoriesArray == null)
            {
                return BadRequest("API response structure was invalid or empty.");
            }

            try
            {
                await _categoryImportService.ImportCategory(categoriesArray);
                return Ok("Data successfully imported to database.");
            }
            catch (Exception ex)
            {
                return BadRequest($"There is an error while importing categories: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Server error: {ex.Message}");
        }
    }

}