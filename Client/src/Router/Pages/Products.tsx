import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import FilterForm from "@/Components/FilterForm";
import ProductActions from "@/Components/ProductActions";
import Pagination from "@/Components/Pagination";
import { catalogProductsQuery, ProductFilters } from "@/api/catalogProducts";

const PAGE_SIZE = 24;
const emptyFilters: ProductFilters = {
  sortBy: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
};

const formatPrice = (price: number | null) =>
  price === null
    ? "Preis nicht verfügbar"
    : new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);

const Products = () => {
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [filterError, setFilterError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isFetching, isError, error } = useQuery(
    catalogProductsQuery(appliedFilters),
  );

  const handleChange = (name: keyof ProductFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setFilterError("");
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minPrice = filters.minPrice === "" ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === "" ? null : Number(filters.maxPrice);

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      setFilterError("Der Mindestpreis darf nicht über dem Höchstpreis liegen.");
      return;
    }

    setFilterError("");
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ ...emptyFilters });
    setAppliedFilters({ ...emptyFilters });
    setFilterError("");
    setCurrentPage(1);
  };

  const totalItems = products?.length ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const pageProducts = products?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? [];

  return (
    <main className="px-page-desktop py-gutter-desktop">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-headline-lg text-on-primary-fixed-variant">Produkte</h1>
        <p className="mt-2 text-gray-600">Entdecke das ALDI Sortiment.</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside aria-label="Produktfilter">
          <FilterForm
            filters={filters}
            error={filterError}
            onChange={handleChange}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </aside>

        <section aria-label="Produktliste">
          <div className="mb-4 flex min-h-8 items-center justify-between">
            <p className="text-sm text-gray-600" aria-live="polite">
              {products ? `${totalItems} Produkte` : ""}
            </p>
          </div>

          {isError && (
            <p role="alert" className="text-red-700">
              {error.message}
            </p>
          )}
          {!isFetching && !isError && products?.length === 0 && (
            <p className="border-y border-gray-200 py-8 text-gray-600">
              Keine Produkte für diese Filter gefunden.
            </p>
          )}

          {!isFetching && pageProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {pageProducts.map((product) => (
                <article
                  key={product.productId}
                  className="flex min-w-0 flex-col border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative grid aspect-square place-items-center bg-gray-50 p-3">
                    <Link to={`/offers/${product.productId}`} className="grid h-full w-full place-items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>
                    <ProductActions product={product} className="absolute right-2 top-2" />
                  </div>
                  <div className="flex grow flex-col gap-2 pt-3">
                    {product.brand && (
                      <p className="text-xs uppercase text-gray-500">{product.brand}</p>
                    )}
                    <Link to={`/offers/${product.productId}`} className="font-semibold text-on-primary-fixed-variant">
                      {product.name}
                    </Link>
                    <p className="mt-auto font-bold">{formatPrice(product.price)}</p>
                    {product.salesUnit && (
                      <p className="text-sm text-gray-600">{product.salesUnit}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          {!isFetching && !isError && (
            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Products;