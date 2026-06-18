import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "../../api/discountedProducts";
import { Link } from "react-router-dom";
import { getSalePercentage } from "../../helpers/getSalePercentage";

const Offers = () => {
  const { data: offers, isLoading, isError, error } = useQuery(productsQuery);
  return (
    <div className="px-page-desktop py-gutter-desktop bg-surface">
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
              Angebote der aktuellen Woche. Mo., 15.6. – Sa., 20.6.
            </span>
          </p>
        </h1>
      </header>

      <button className="cursor-pointer hover:shadow-md shadow-gray-400 duration-200 text-white p-4 my-12 rounded-xl bg-primary">
          Sortieren & Filtern
      </button>

      {offers && offers.length > 0 && (
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 py-3 gap-y-12 gap-x-6">
          {offers.map((product) => {
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
              <Link to={`${productId}`}
                className="flex flex-col shadow-sm shadow-gray-200"
                key={productId}
              >
                <img
                  className="object-cover p-1 relative"
                  src={imageUrl}
                  alt={name || brand}
                />
                <div className="p-4 flex flex-col gap-2 justify-between grow-1">
                  <h4 className="text-lg font-bold text-on-primary-fixed-variant">
                    {name}
                  </h4>
                  <p className="text-black/60 font-bold">{offerSectionTitle}</p>
                  <p className="text-sm">({salesUnit})</p>
                  {originalPrice > 0 && 
                  
                  <div className="text-sm w-fit rounded-lg p-1 bg-surface-tint text-white">
                   Spare {offerPercentage}
                  </div>
                  }
                  
                  <div className="w-full flex flex-wrap items-center">
                    <h4 className=" font-bold text-lg text-on-primary-fixed-variant">
                      {price ? (
                        <>
                          {" "}
                          <span className={`text-2xl ${originalPrice ? "text-red-600" :"text-on-primary-fixed-variant"}`}>{price}€</span>{" "}
                          
                          <span className="text-sm line-through">
                            {originalPrice > 0 && `${originalPrice}€`}
                          </span>
                        </>
                      ) : (
                        originalPrice
                      )}{" "}
                    </h4>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Offers;
