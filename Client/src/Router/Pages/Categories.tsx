import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import ProductActions from "@/Components/ProductActions";
import { categoriesQuery } from "../../api/categoriesQuery";
import { catalogProductsQuery, ProductFilters } from "@/api/catalogProducts";

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

const CategoryProductSlider = ({ products }: { products: Product[] }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  return (
    <>
      {products.length > 1 && (
        <div className="mb-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Vorherige Produkte"
            className="grid size-10 place-items-center border border-gray-300 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Weitere Produkte"
            className="grid size-10 place-items-center border border-gray-300 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      <Swiper
        onSwiper={setSwiper}
        slidesPerView={1.2}
        spaceBetween={12}
        breakpoints={{
          480: { slidesPerView: 2.1 },
          768: { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4.2, spaceBetween: 16 },
          1280: { slidesPerView: 5.2, spaceBetween: 20 },
        }}
        className="w-full !py-2"
      >
        {products.map((product) => (
          <SwiperSlide key={product.productId} className="!h-auto">
            <article className="flex h-full min-w-0 flex-col border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md">
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
                {product.brand && <p className="text-xs uppercase text-gray-500">{product.brand}</p>}
                <Link to={`/offers/${product.productId}`} className="font-semibold text-on-primary-fixed-variant">
                  {product.name}
                </Link>
                <p className="mt-auto font-bold">{formatPrice(product.price)}</p>
                {product.salesUnit && <p className="text-sm text-gray-600">{product.salesUnit}</p>}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

const Categories = () => {
  const {
    data: categories = [],
    isError: categoriesFailed,
    error: categoriesError,
  } = useQuery(categoriesQuery);
  const categoryProductQueries = useQueries({
    queries: categories.map((category) =>
      catalogProductsQuery({
        ...emptyFilters,
        categoryId: String(category.categoryId),
      }),
    ),
  });
  const productsFailed = categoryProductQueries.some((query) => query.isError);
  const productsError = categoryProductQueries.find((query) => query.isError)?.error;

  const sortedCategories = [...categories].sort((first, second) =>
    first.name.localeCompare(second.name, "de"),
  );
  const availableCategories = sortedCategories.filter((category) => {
    const categoryIndex = categories.findIndex(
      (item) => item.categoryId === category.categoryId,
    );
    return (categoryProductQueries[categoryIndex]?.data?.length ?? 0) > 0;
  });
  const availableProductCount = availableCategories.reduce((total, category) => {
    const categoryIndex = categories.findIndex(
      (item) => item.categoryId === category.categoryId,
    );
    return total + (categoryProductQueries[categoryIndex]?.data?.length ?? 0);
  }, 0);

  if (categoriesFailed || productsFailed) {
    return (
      <main className="px-page-desktop py-gutter-desktop">
        <p role="alert" className="text-red-700">
          {categoriesError?.message ?? productsError?.message ?? "Kategorien konnten nicht geladen werden."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="bg-tertiary-container text-white">
        <div className="px-page-desktop py-12 md:py-16">
          <p className="mb-3 text-sm font-semibold uppercase text-tertiary-fixed-dim">
            ALDI Sortiment
          </p>
          <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">
            Finde, was auf deiner Liste steht.
          </h1>
          <p className="mt-4 text-white/75">
            {availableCategories.length} Kategorien · {availableProductCount} Produkte
          </p>
        </div>
      </header>

      <nav
        aria-label="Produktkategorien"
        className="sticky top-0 z-20 border-b border-gray-200 bg-surface/95 px-page-desktop py-4 backdrop-blur"
      >
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {availableCategories.map((category) => (
            <li key={category.categoryId} className="shrink-0">
              <a
                href={`#category-${category.categoryId}`}
                className="inline-flex min-h-10 items-center border border-gray-300 bg-white px-4 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-page-desktop">
        {availableCategories.map((category, index) => {
          const categoryIndex = categories.findIndex(
            (item) => item.categoryId === category.categoryId,
          );
          const categoryProducts = categoryProductQueries[categoryIndex]?.data ?? [];
          const previewProducts = categoryProducts.slice(0, 15);

          return (
            <section
              id={`category-${category.categoryId}`}
              key={category.categoryId}
              className="scroll-mt-24 border-b border-gray-200 py-10 md:py-14"
            >
              <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-baseline gap-3 md:gap-5">
                  <span className="text-sm font-bold text-secondary-container">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-bold text-on-primary-fixed-variant md:text-3xl">
                    {category.name}
                  </h2>
                </div>
                <span className="text-sm text-gray-600">
                  {categoryProducts.length} Produkte
                </span>
              </header>

              <CategoryProductSlider products={previewProducts} />
              {categoryProducts.length > 15 && (
                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/categories/${category.categoryId}`}
                    className="inline-flex min-h-11 items-center justify-center bg-primary px-5 font-semibold text-white transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    Mehr ansehen: {category.name}
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default Categories