import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Slide } from "./Hero";
import { Product, productsQuery } from "../api/discountedProducts";
import { useQuery } from "@tanstack/react-query";

interface CardsProps {
  slides: Product[];
}

const Cards: React.FC<CardsProps> = ({ slides }) => {
  let { data: products, isLoading, isError } = useQuery(productsQuery);
  const shuffled = products ? [...products] : [];

  // 2. Fisher-Yates Shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const randomProducts = shuffled.slice(0, 20);
  console.log(randomProducts);

  return (
    <section className="my-margin-desktop px-page-desktop bg-surface py-margin-desktop">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-gutter-desktop w-full gap-4">
        <div className="w-full">
          <h1 className="text-headline-lg text-on-primary-fixed-variant ">
            This Week's Essentials
          </h1>
          <h4 className="text-headline-md text-gray-500 font-normal">
            This Week's Essentials Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Velit quasi odio tenetur at
          </h4>
        </div>
      </header>
      <div className="mb-6 w-full flex justify-between gap-4">
        {/* Visually on the left: This will now disable itself at the beginning */}
        <button className="custom-next bg-secondary-container p-1 text-white shadow-md shadow-gray-300 cursor-pointer [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:pointer-events-none transition-opacity duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>

        {/* Visually on the right: This will slide you forward */}
        <button className="custom-prev bg-secondary-container p-1 text-white shadow-md shadow-gray-300 cursor-pointer [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:pointer-events-none transition-opacity duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
            />
          </svg>
        </button>
      </div>

      {randomProducts?.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1.2} // Shows a peek of the next card on mobile viewports
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 2.3 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 5.5 }, // FIX: Changed from 5 to 5.5 for large screens
          }}
          navigation={{
            prevEl: ".custom-next",
            nextEl: ".custom-prev",
          }}
          className="w-full !py-4 px-8"
        >
          {randomProducts.map((slide, i) => {
            return (
              <SwiperSlide
                key={i}
      
                className="relative !h-auto flex flex-col bg-white pt-4 px-2 shadow-md shadow-gray-400 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-0 after:bg-secondary-container after:transition-all after:duration-300 hover:after:w-full"
              >
                <img
                  src={slide?.imageUrl}
                  alt=""
                  className="object-cover mb-4 h-auto w-[90%] mx-auto shadow-md shadow-gray-200 "
                />

                <div className="p-4 text-primary bg-white flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-primary-fixed-variant text-2xl mb-2">
                      {slide.name}
                    </h3>
                    <p className="text-sm">{slide.offerSectionTitle}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-bold">
                      <span className="text-4xl ! text-secondary-container mr-2">
                        {slide.price}
                      </span>
                      €
                    </p>
                    <div className="p-1 font-bold">
                      <p className="">{slide?.salesUnit}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      <div className="my-4 grid place-items-center">
        <Link
          className="relative p-2 bg-primary-container text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-secondary-container after:transition-all after:duration-300 hover:after:w-full"
          to="/products"
        >
          See More Products
        </Link>
      </div>
    </section>
  );
};

export default Cards;
