namespace Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json.Nodes;
using Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class ProductController(ApplicationDbContext context, ProductService productService, IConfiguration configuration, CategoryService categoryService, FilterService filterService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    private readonly ProductService _productService = productService;
    private readonly CategoryService _categoryService = categoryService;
    private readonly FilterService _filterService = filterService;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll([FromQuery] string? sortBy, [FromQuery] string? brand)
    {
        var products = await _productService.GetProducts(sortBy, brand);
        return Ok(products ?? Enumerable.Empty<Product>());
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Product?>> GetProductDetails(int id)
    {
        var product = await _productService.GetProductById(id);
        if(product == null) return NotFound("Product not Found!");
        return Ok(product);
    }


    [HttpGet("find/{name}")]
    public async Task<ActionResult<IEnumerable<Product>>> FindProducts(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return BadRequest("Product name is Empty");

        var products = await _filterService.SearchProducts(name.Trim());

        if (products == null) return Ok(Enumerable.Empty<Product>());
        return Ok(products);
    }




    [HttpGet("import")]
    public async Task<IActionResult> ImportProducts()
    {
        var limit = 220;

        var categories = await _categoryService.GetCategories();

        if(categories.Count <= 0)
        {
            return BadRequest("error");
        }

    

        int fetchedCount = 0;
        int savedCount = 0;

        using var client = new HttpClient();
        var apiKey = _configuration["ApiSettings:ApiKey"];
        var baseUrl = _configuration["ApiSettings:BaseUrl"];

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(baseUrl))
        {
            return StatusCode(500, "API configuration is missing.");
        }


        await _context.Database.ExecuteSqlRawAsync("DELETE FROM CategoryProduct;");
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM sqlite_sequence WHERE name='CategoryProduct';");


        var nonDiscountedProducts = _context.Products.Where(p => p.IsDiscount == false);
        _context.Products.RemoveRange(nonDiscountedProducts);
        await _context.SaveChangesAsync();

        foreach(var category in categories)
        {

            var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}get_products_by_category?limit={limit}&category_name={category.Name}");
            request.Headers.Add("X-API-Key", apiKey);


            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode) continue;
            var jsonDoc = await response.Content.ReadFromJsonAsync<JsonNode>();

            var productsArray = jsonDoc?["data"]?["products"]?.AsArray();
            if (productsArray == null) continue;

            fetchedCount++;

            if(fetchedCount > 0 && productsArray.Count != 0)
            {
                bool isImported = await _productService.ImportProduct(productsArray, category.Id);
                if(isImported) savedCount++;
            }
        }

        if(fetchedCount > 0 && savedCount >0)
        {
            return Ok("Products data successfully imported to database.");
        }
        else
        {
            return BadRequest("API response structure was invalid or empty.");
        }
    }

}
