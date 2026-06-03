using ReactWithASP.Server.Models;

namespace ReactwithASP.Server.Models;



public class Category
{
    public int CategoryId{get;set;}
    public int Count{get;set;}
    public string Name{get;set;} = string.Empty;


    public List<Product> Products { get; set; } = [] ;

}