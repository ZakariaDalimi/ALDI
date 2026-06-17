using Microsoft.EntityFrameworkCore;
using ReactwithASP.Server.Services;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Services;
using System.Security.Claims;



var builder = WebApplication.CreateBuilder(args);
// 1. DEFINE THE POLICY
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://localhost:50277") // Your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<CategoryImportService>();

builder.Services.AddScoped<ProductService>();

builder.Services.AddScoped<OffersImportService>();




builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var conString = builder.Configuration.GetConnectionString("DefaultConnection") ??
     throw new InvalidOperationException("Connection string 'DefaultConnection'" +
    " not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(conString));





var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();