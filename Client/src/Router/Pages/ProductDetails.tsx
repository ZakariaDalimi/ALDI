import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { singleProductQuery } from "../../api/singleProductQuery";
import { getSalePercentage } from "../../helpers/getSalePercentage";
import ProductActions from "@/Components/ProductActions";

const formatDate = (value: string | null | undefined) => {
  if (!value) return null;

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatValidity = (start: string | null, end: string | null) => {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);

  if (!formattedStart && !formattedEnd) return null;
  return [formattedStart, formattedEnd].filter(Boolean).join(" – ");
};

const formatPrice = (price: number | null) =>
  price === null
    ? "Preis nicht verfügbar"
    : new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);

const ProductDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    ...singleProductQuery(id ?? ""),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <p className="px-page-desktop py-12" role="alert">{error.message}</p>;
  }

  const product = data?.product;
  if (!product) {
    return <p className="px-page-desktop py-12">Produkt nicht gefunden.</p>;
  }

  const similarProducts = data.similarProducts ?? [];
  const validity = formatValidity(product.validityStart, product.validityEnd);
  const salePercentage =
    product.price !== null && product.originalPrice !== null
      ? getSalePercentage(product.price, product.originalPrice)
      : "";

  return (
    <main className="px-page-desktop py-gutter-desktop">
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="grid aspect-square place-items-center bg-white p-6">
          <img
            className="max-h-full max-w-full object-contain"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col justify-center gap-5">
          {product.brand && (
            <p className="text-sm font-semibold uppercase text-gray-600">{product.brand}</p>
          )}
          <h1 className="text-3xl font-bold text-on-primary-fixed-variant md:text-4xl">
            {product.name}
          </h1>
          {product.offerSectionTitle && (
            <p className="text-lg text-gray-600">{product.offerSectionTitle}</p>
          )}

          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-bold text-on-primary-fixed-variant">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice !== null && product.originalPrice > 0 && (
              <p className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            {salePercentage && (
              <span className="bg-red-100 px-2 py-1 text-sm font-semibold text-red-700">
                Spare {salePercentage}
              </span>
            )}
          </div>
          <ProductActions product={product} />

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-gray-200 pt-5">
            {product.salesUnit && (
              <>
                <dt className="text-gray-600">Verkaufseinheit</dt>
                <dd className="font-medium">{product.salesUnit}</dd>
              </>
            )}
            {product.offerCategory && (
              <>
                <dt className="text-gray-600">Angebotskategorie</dt>
                <dd className="font-medium">{product.offerCategory}</dd>
              </>
            )}
            {validity && (
              <>
                <dt className="text-gray-600">Gültig</dt>
                <dd className="font-medium">{validity}</dd>
              </>
            )}
            {!!product.categories?.length && (
              <>
                <dt className="text-gray-600">Kategorien</dt>
                <dd className="font-medium">
                  {product.categories.map((category) => category.name).join(", ")}
                </dd>
              </>
            )}
          </dl>
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-on-primary-fixed-variant">
            Ähnliche Produkte
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {similarProducts.map((similarProduct) => (
              <article
                key={similarProduct.productId}
                className="flex flex-col border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
              >
                <div className="relative grid aspect-square place-items-center bg-gray-50 p-3">
                  <Link to={`/offers/${similarProduct.productId}`} className="grid h-full w-full place-items-center">
                    <img
                      className="max-h-full max-w-full object-contain"
                      src={similarProduct.imageUrl}
                      alt={similarProduct.name}
                      loading="lazy"
                    />
                  </Link>
                  <ProductActions product={similarProduct} className="absolute right-2 top-2" />
                </div>
                <div className="flex grow flex-col gap-2 pt-3">
                  {similarProduct.brand && (
                    <p className="text-xs uppercase text-gray-500">{similarProduct.brand}</p>
                  )}
                  <Link to={`/offers/${similarProduct.productId}`} className="font-semibold">
                    {similarProduct.name}
                  </Link>
                  {similarProduct.offerSectionTitle && (
                    <p className="text-sm text-gray-600">{similarProduct.offerSectionTitle}</p>
                  )}
                  <p className="mt-auto font-bold">{formatPrice(similarProduct.price)}</p>
                  {similarProduct.originalPrice !== null && similarProduct.originalPrice > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(similarProduct.originalPrice)}
                    </p>
                  )}
                  {similarProduct.salesUnit && (
                    <p className="text-sm text-gray-600">{similarProduct.salesUnit}</p>
                  )}
                  {formatValidity(similarProduct.validityStart, similarProduct.validityEnd) && (
                    <p className="text-xs text-gray-600">
                      Gültig: {formatValidity(similarProduct.validityStart, similarProduct.validityEnd)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
