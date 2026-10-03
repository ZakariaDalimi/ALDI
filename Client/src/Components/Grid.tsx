import { Link } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "../api/categoriesQuery";
import { catalogProductsQuery, ProductFilters } from "@/api/catalogProducts";

const emptyFilters: ProductFilters = {
  sortBy: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
};

const Grid = () => {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const sortedCategories = [...categories].sort((first, second) =>
    first.name.localeCompare(second.name, "de"),
  );
  const productQueries = useQueries({
    queries: sortedCategories.map((category) =>
      catalogProductsQuery({
        ...emptyFilters,
        categoryId: String(category.categoryId),
      }),
    ),
  });
  const featuredCategories = sortedCategories
    .map((category, index) => ({
      category,
      products: productQueries[index]?.data,
    }))
    .filter((item) => (item.products?.length ?? 0) > 0)
    .slice(0, 6);

  return (
    <section className="mb-12 px-page-desktop">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-secondary">Finde dein Sortiment</p>
          <h2 className="text-headline-lg text-on-primary-fixed-variant">Einkaufen nach Kategorie</h2>
        </div>
        <Link
          className="inline-flex min-h-11 items-center border-b-2 border-secondary px-1 font-semibold text-primary hover:text-secondary"
          to="/categories"
        >
          Alle Kategorien ansehen <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {featuredCategories.map(({ category, products }, index) => {
          const image = products?.[0]?.imageUrl;
          const productCount = products?.length ?? 0;

          return (
            <Link
              key={category.categoryId}
              to={`/categories/${category.categoryId}`}
              style={{ animationDelay: `${index * 90}ms` }}
              className={`motion-rise group relative isolate min-h-48 overflow-hidden bg-tertiary-container sm:min-h-60 ${index === 0 ? "col-span-2 md:col-span-1 md:row-span-2 md:min-h-[31rem]" : ""}`}
            >
              {image && (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white md:p-5">
                <div>
                  <h3 className="text-lg font-bold md:text-xl">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/80">
                    {productCount} Produkte
                  </p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center bg-secondary-container text-white transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Grid;
