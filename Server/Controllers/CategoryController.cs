namespace Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Models;
using System.Text.Json.Nodes;
using Server.Services;
using SQLitePCL;

[Route("api/v1/[controller]")]
[ApiController]
public class CategoryController(CategoryService categoryService) : ControllerBase
{
    private readonly CategoryService _categoryService = categoryService;



    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        var data = await _categoryService.GetCategories();
        if (data == null) return NotFound();
        return Ok(data);
    }


    [HttpGet("import")]
    public async Task<IActionResult> ImportCategories()
    {
        return await _categoryService.ImportCategoriesFromApi();
    }

}