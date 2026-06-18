import { useQuery } from "@tanstack/react-query";
import { Product } from "./discountedProducts";


export const fetchProduct = async (id:string | number): Promise<Product> => {
 const response = await fetch(`http://localhost:5035/api/v1/Product/${id}`);
 if (!response.ok) {
    throw new Error(`Failed to fetch categories:${response.statusText}`)
 }
 return response.json();
}

export const singleProductQuery = (id: string) => ({
  queryKey: ['product', id] as const, 
  queryFn: () => fetchProduct(id),    
  staleTime: 1000 * 60 * 5,           
});
 
