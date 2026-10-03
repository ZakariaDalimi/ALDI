import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "../../api/discountedProducts";
import { Link } from "react-router-dom";
import { getSalePercentage } from "../../helpers/getSalePercentage";
import ProductActions from "@/Components/ProductActions";
import Pagination from "@/Components/Pagination";

const PAGE_SIZE = 24;

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getWeekRange = (weekOffset: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + weekOffset * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start: getDateKey(start), end: getDateKey(end) };
};

const formatDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short" }).format(
    new Date(year, month - 1, day),
  );
};

const Offers = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: offers, isLoading, isError, error } = useQuery(productsQuery);
  const weekRange = getWeekRange(selectedWeek);
  const visibleOffers = offers?.filter((offer) => {
    const offerStart = offer.validityStart?.slice(0, 10);
    const offerEnd = offer.validityEnd?.slice(0, 10);

    return offerStart && offerEnd && offerStart <= weekRange.end && offerEnd >= weekRange.start;
  });
  const totalOffers = visibleOffers?.length ?? 0;
  const totalPages = Math.ceil(totalOffers / PAGE_SIZE);
  const pageOffers = visibleOffers?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="px-page-desktop py-gutter-desktop bg-surface relative">
      <header className="w-full mb-4 flex flex-col gap-4">
        <h1 className="text-headline-lg text-on-primary-fixed-variant">
          Wochenangebote
        </h1>
        <h1 className="text-headline-md text-on-surface w-full">
          <p className=" flex flex-col gap-3">
            <span className="text-lg text-gray-700 font-normal">
              Entdecke die wöchentlichen Angebote bei ALDI SÜD. Jede Woche
              erwarten dich in drei Kategorien vielfältige Angebote und
              spannende Deals. Frischeprodukte, Angebote bekannter Marken und
              unsere Eigenmarken – alles natürlich zum ALDI Preis!
            </span>
            <br />
            <span className="text-2xl">
              Angebote vom {formatDate(weekRange.start)} – {formatDate(weekRange.end)}
            </span>
          </p>
        </h1>
      </header>

      <div className="my-8 inline-flex rounded-md border border-gray-300 p-1" role="group" aria-label="Angebotswoche auswählen">
        {[0, 1].map((week) => (
          <button
            key={week}
            type="button"
            onClick={() => {
              setSelectedWeek(week);
              setCurrentPage(1);
            }}
            aria-pressed={selectedWeek === week}
            className={`cursor-pointer rounded px-4 py-2 ${selectedWeek === week ? "bg-primary text-white" : "text-on-surface hover:bg-gray-100"}`}
          >
            {week === 0 ? "Diese Woche" : "Nächste Woche"}
          </button>
        ))}
      </div>

      {isError && <p role="alert">{error.message}</p>}
      {!isLoading && !isError && visibleOffers?.length === 0 && (
        <p>
          Für {selectedWeek === 0 ? "diese" : "nächste"} Woche sind keine Angebote verfügbar.
        </p>
      )}

      {pageOffers && pageOffers.length > 0 && (
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 py-3 gap-y-12 gap-x-6">
          {pageOffers.map((product) => {
            const {
              productId,
              originalPrice,
              name,
              imageUrl,
              salesUnit,
              brand,
              offerSectionTitle,
              price,
            } = product;
            const offerPercentage =
            getSalePercentage(price,originalPrice);
            return (
              <article
                className="flex flex-col shadow-sm shadow-gray-200"
                key={productId}
              >
                <div className="relative">
                  <Link to={`${productId}`} className="block">
                    <img
                      className="aspect-square w-full object-contain p-3"
                      src={imageUrl}
                      alt={name || brand}
                    />
                  </Link>
                  <ProductActions product={product} className="absolute right-2 top-2" />
                </div>
                <div className="flex grow flex-col gap-2 p-4">
                  <Link to={`${productId}`} className="text-lg font-bold text-on-primary-fixed-variant">
                    {name}
                  </Link>
                  <p className="font-bold text-black/60">{offerSectionTitle}</p>
                  <p className="text-sm">({salesUnit})</p>
                  {originalPrice !== null && originalPrice > 0 && (
                    <div className="w-fit bg-surface-tint p-1 text-sm text-white">
                      Spare {offerPercentage}
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    {price !== null && (
                      <span className={`text-2xl font-bold ${originalPrice ? "text-red-600" : "text-on-primary-fixed-variant"}`}>
                        {price}€
                      </span>
                    )}
                    {originalPrice !== null && originalPrice > 0 && (
                      <span className="text-sm line-through">{originalPrice}€</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {!isLoading && !isError && (
        <Pagination
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={totalOffers}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    
    </div>
  );
};

export default Offers;
