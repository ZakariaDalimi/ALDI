using Microsoft.EntityFrameworkCore;
using Server.Services;
using Server.Data;
using Quartz;
using Server.Jobs;




var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://localhost:50277")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<CategoryService>();

builder.Services.AddScoped<ProductService>();

builder.Services.AddScoped<FilterService>();

builder.Services.AddScoped<OffersService>();

builder.Services.AddQuartz(q =>
{
    q.ScheduleJob<WeeklyImportProductsJob>(trigger => trigger
        .WithIdentity("WeeklyImportTrigger")
        .WithCronSchedule("0 0 7 ? * MON"));    // seconds, minutes, hours, day of month, month, day of week
});

builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var conString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    throw new InvalidOperationException("Connection string 'DefaultConnection'" +
    " not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(conString));





var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

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