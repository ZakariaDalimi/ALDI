import type { Product } from "./discountedProducts";

export const productSearchQuery = (name: string) => ({
  queryKey: ["product-search", name] as const,
  queryFn: async (): Promise<Product[]> => {
    const response = await fetch(
      `http://localhost:5035/api/v1/Product/find/${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    return response.json();
  },
  staleTime: 60 * 1000,
});