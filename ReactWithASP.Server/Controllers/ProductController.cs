namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var data = await _context.Products.ToListAsync();
        return Ok(data);
    }


    }