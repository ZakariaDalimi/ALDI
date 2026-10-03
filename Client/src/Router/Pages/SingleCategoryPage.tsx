import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import ProductActions from "@/Components/ProductActions";
import Pagination from "@/Components/Pagination";
import { categoriesQuery } from "@/api/categoriesQuery";
import { catalogProductsQuery, ProductFilters } from "@/api/catalogProducts";

const emptyFilters: ProductFilters = {
  sortBy: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
};
const PAGE_SIZE = 24;

const formatPrice = (price: number | null) =>
  price === null
    ? "Preis nicht verfügbar"
    : new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);

const SingleCategoryPage = () => {
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => setCurrentPage(1), [categoryName]);
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesFailed,
    error: categoriesError,
  } = useQuery(categoriesQuery);
  const selectedCategory = categories.find(
    (category) =>
      String(category.categoryId) === categoryName ||
      category.name.replace(/\s/g, "").toLocaleLowerCase("de-DE") ===
        categoryName?.toLocaleLowerCase("de-DE"),
  );
  const categoryId = selectedCategory?.categoryId;
  const {
    data: products = [],
    isError: productsFailed,
    error: productsError,
  } = useQuery({
    ...catalogProductsQuery({
      ...emptyFilters,
      categoryId: categoryId === undefined ? "" : String(categoryId),
    }),
    enabled: categoryId !== undefined,
  });
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const pageProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (categoriesLoading) return null;

  if (categoriesFailed || productsFailed) {
    return (
      <main className="px-page-desktop py-gutter-desktop">
        <p role="alert" className="text-red-700">
          {categoriesError?.message ?? productsError?.message ?? "Produkte konnten nicht geladen werden."}
        </p>
      </main>
    );
  }

  if (!selectedCategory) {
    return (
      <main className="px-page-desktop py-gutter-desktop">
        <p>Kategorie nicht gefunden.</p>
        <Link className="mt-4 inline-block underline" to="/categories">
          Zurück zu allen Kategorien
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="bg-tertiary-container text-white">
        <div className="px-page-desktop py-10 md:py-14">
          <Link
            to="/categories"
            className="mb-5 inline-block text-sm text-white/75 transition-colors hover:text-white"
          >
            ← Alle Kategorien
          </Link>
          <p className="mb-2 text-sm font-semibold uppercase text-tertiary-fixed-dim">
            ALDI Sortiment
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">{selectedCategory.name}</h1>
          <p className="mt-3 text-white/75">
            {products.length} {products.length === 1 ? "Produkt" : "Produkte"}
          </p>
        </div>
      </header>

      <section className="px-page-desktop py-8 md:py-12" aria-label={`Produkte: ${selectedCategory.name}`}>
        {products.length === 0 ? (
          <p className="border-y border-gray-200 py-8 text-gray-600">
            Für diese Kategorie sind derzeit keine Produkte verfügbar.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={products.length}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </main>
  );
};

export default SingleCategoryPage