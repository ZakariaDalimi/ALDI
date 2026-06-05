using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<CategoryImportService>();


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var conString = builder.Configuration.GetConnectionString("DefaultConnection") ??
     throw new InvalidOperationException("Connection string 'DefaultConnection'" +
    " not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(conString));


builder.Services.AddHttpClient("MyExternalApi", client =>
{
    client.BaseAddress = new Uri("https://api.parse.bot/scraper/");
    client.DefaultRequestHeaders.Add("X-Api-Key", "pmx_e1f7b5c621ba17cdd291feecfb899881");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});




var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
