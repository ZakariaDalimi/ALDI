namespace Server.Models;



public class Category
{
    public int CategoryId{get;set;}
    public string Name{get;set;} = string.Empty;


    [System.Text.Json.Serialization.JsonIgnore]
    public List<Product> Products { get; set; } = [] ;

}