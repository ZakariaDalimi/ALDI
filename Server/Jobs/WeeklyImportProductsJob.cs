
using Quartz;
using Server.Services;

namespace Server.Jobs;

public class WeeklyImportProductsJob(
    CategoryService categoryService,
    ProductService productService,
    OffersService offersService) : IJob
{
    private readonly CategoryService _categoryService = categoryService;
    private readonly ProductService _productService = productService;
    private readonly OffersService _offersService = offersService;

    public async ValueTask Execute(IJobExecutionContext context, CancellationToken cancellationToken)
    {
        await _categoryService.ImportCategoriesFromApi();
        await _productService.ImportProducts();
        await _offersService.ImportOffersFromApi();
        Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Weekly products import completed successfully.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
}