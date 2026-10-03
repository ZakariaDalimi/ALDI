import { Product } from "./discountedProducts";

export interface ProductFilters {
  sortBy: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
}

export const catalogProductsQuery = (filters: ProductFilters) => ({
  queryKey: ["catalog-products", filters] as const,
  queryFn: async (): Promise<Product[]> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value.trim());
    });

    const query = params.toString();
    const response = await fetch(
      `http://localhost:5035/api/v1/Product${query ? `?${query}` : ""}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  },
  staleTime: 5 * 60 * 1000,
});