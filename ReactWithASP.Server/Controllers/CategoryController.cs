namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactwithASP.Server.Models;
using System.Text.Json.Nodes;
using ReactWithASP.Server.Services;
using SQLitePCL;

[Route("api/v1/[controller]")]
[ApiController]
public class CategoryController(ApplicationDbContext context, CategoryImportService categoryImportService, IConfiguration configuration) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly CategoryImportService _categoryImportService = categoryImportService;
    private readonly IConfiguration _configuration = configuration;



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

        var request = new HttpRequestMessage(HttpMethod.Get, _configuration["ApiSettings:BaseUrl"] + "get_product_categories");
        request.Headers.Add("X-API-Key", _configuration["ApiSettings:ApiKey"]);

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
                bool isImported = await _categoryImportService.ImportCategory(categoriesArray);

                if (isImported)
                {
                    return Ok("Data successfully imported to database.");
                }
                else
                {
                    return Ok("Import skipped. The categories Array is empty or the categories are already saved in the database.");
                }
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