namespace Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class ProductController(ProductService productService, FilterService filterService) : ControllerBase
{
    private readonly ProductService _productService = productService;
    private readonly FilterService _filterService = filterService;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll(
        [FromQuery] string? sortBy,
        [FromQuery] string? brand,
        [FromQuery] int? categoryId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        if (minPrice.HasValue && minPrice.Value < 0 || maxPrice.HasValue && maxPrice.Value < 0)
            return BadRequest("Prices must be zero or greater.");

        if (minPrice.HasValue && maxPrice.HasValue && minPrice.Value > maxPrice.Value)
            return BadRequest("minPrice cannot be greater than maxPrice.");

        var products = await _productService.GetProducts(sortBy, brand, categoryId, minPrice, maxPrice);
        return Ok(products ?? Enumerable.Empty<Product>());
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetProductDetails(int id)
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
        var result = await _productService.ImportProducts();

        if (result.ConfigurationMissing)
            return StatusCode(500, "API configuration is missing.");
        if (result.CategoriesMissing)
            return BadRequest("error");
        if (result.Imported)
            return Ok("Products data successfully imported to database.");

        return BadRequest("API response structure was invalid or empty.");
    }

}
