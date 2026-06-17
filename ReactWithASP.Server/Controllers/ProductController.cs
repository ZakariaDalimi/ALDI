namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json.Nodes;
using ReactwithASP.Server.Services;
using ReactWithASP.Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class ProductController(ApplicationDbContext context, ProductService productService, IConfiguration configuration) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private readonly IConfiguration _configuration = configuration;

    private readonly ProductService _productService = productService;


    [HttpGet]
    public async Task<IEnumerable<Product>> GetAll()
    {
        return await _context.Products
                            .Where(p => p.IsDiscount == false)
                            .ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Product?>> GetProductDetails(int id)
    {
        var product = await _productService.GetProductById(id);
        if(product == null) return NotFound("Product not Found!");
        return Ok(product);
        
    }

}