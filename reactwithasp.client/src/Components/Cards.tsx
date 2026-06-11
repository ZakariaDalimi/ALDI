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

// 1. Define the interface for the Props object
interface CardsProps {
  slides: Slide[];
}

// 2. Destructure 'slides' from the props object
const Cards: React.FC<CardsProps> = ({ slides }) => {
  return (
    <section className="my-margin-desktop px-page-desktop bg-surface py-margin-desktop">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-gutter-desktop w-full gap-4">
        <div className="w-full">
          <h1 className="text-headline-lg text-black ">
            This Week's Essentials
          </h1>
          <h4 className="text-headline-md text-gray-500 font-normal">
            This Week's Essentials Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Velit quasi odio tenetur at
          </h4>
        </div>
      </header>

      {/* 3. Added a height class to Swiper so the background images actually show up */}
      {slides?.length > 0 && (
       <Swiper
  modules={[Navigation, Pagination, Autoplay]} // <-- DO NOT MISS THIS
  slidesPerView={1}
  spaceBetween={16}
  breakpoints={{
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
  }}
  className="h-[400px] w-full"
>
          {slides.map((slide, i) => {
            return (
              <SwiperSlide
                key={i}
                style={{ backgroundImage: `url(${slide?.imgPath})` }}
                className="rounded-xl overflow-hidden h-full w-full bg-cover bg-center"
              >
                <div className="p-4 text-white bg-black/40 h-full">
                  <h3 className="font-bold">{slide.title}</h3>
                  <p className="text-sm">{slide.subtitle}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default Cards;