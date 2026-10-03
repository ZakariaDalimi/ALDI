import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { productsQuery } from "../api/discountedProducts";
import { useQuery } from "@tanstack/react-query";
import ProductActions from "./ProductActions";
import { ArrowLeft, ArrowRight } from "lucide-react";

const formatPrice = (price: number | null) =>
  price === null
    ? "Preis nicht verfügbar"
    : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);

const Cards = () => {
  const { data: products = [] } = useQuery(productsQuery);
  const featuredProducts = products.slice(0, 12);

  return (
    <section className="border-y border-gray-200 bg-white py-12 md:py-16">
      <div className="px-page-desktop">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-secondary">Für deinen Einkauf</p>
            <h2 className="text-headline-lg text-on-primary-fixed-variant">Aktuelle Wochenangebote</h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center border-b-2 border-secondary px-1 font-semibold text-primary hover:text-secondary"
            to="/offers"
          >
            Alle Angebote <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </header>

      <div className="mb-4 flex justify-end gap-2">
        <button aria-label="Vorherige Produkte" title="Vorherige Produkte" className="featured-prev grid size-10 place-items-center border border-gray-300 text-primary hover:bg-primary hover:text-white [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:opacity-40">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button aria-label="Weitere Produkte" title="Weitere Produkte" className="featured-next grid size-10 place-items-center border border-gray-300 text-primary hover:bg-primary hover:text-white [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:opacity-40">
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      {featuredProducts.length > 0 && (
        <Swiper
          modules={[Navigation]}
          slidesPerView={1.4}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          navigation={{
            prevEl: ".featured-prev",
            nextEl: ".featured-next",
          }}
          className="w-full !py-3"
        >
          {featuredProducts.map((product, index) => (
            <SwiperSlide key={product.productId} className="!h-auto">
              <article style={{ animationDelay: `${(index % 6) * 70}ms` }} className="motion-rise flex h-full flex-col border border-gray-200 bg-white">
                <div className="relative grid aspect-[4/3] place-items-center bg-gray-50 p-4">
                  <Link to={`/offers/${product.productId}`} className="grid h-full w-full place-items-center">
                    <img src={product.imageUrl} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </Link>
                  <ProductActions product={product} className="absolute right-2 top-2" />
                  {product.originalPrice !== null && product.originalPrice > 0 && product.price !== null && (
                    <span className="absolute bottom-2 left-2 bg-secondary-container px-2 py-1 text-sm font-bold text-white">
                      Spare {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex grow flex-col p-4">
                  {product.brand && <p className="text-xs uppercase text-gray-500">{product.brand}</p>}
                  <Link to={`/offers/${product.productId}`} className="mt-1 font-semibold text-on-primary-fixed-variant">
                    {product.name}
                  </Link>
                  <div className="mt-auto flex items-baseline gap-2 pt-4">
                    <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice !== null && product.originalPrice > 0 && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  {product.salesUnit && <p className="mt-1 text-sm text-gray-600">{product.salesUnit}</p>}
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      </div>
    </section>
  );
};

export default Cards;
