import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
// 1. Added Autoplay to the modules import
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation"; 
import "swiper/css/pagination"; 
import "swiper/css/effect-fade"; 

export type Slide = {
  imgPath: string;
  title?: string;
  subtitle?: string;
  description?: string;
};

export interface HeroProps {
  slides: Slide[];
}

const Hero: React.FC<HeroProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section className="mb-margin-desktop relative w-full h-[70vh] group overflow-hidden bg-neutral-900">
      {slides && slides.length > 0 && (
        <>
          {/* Text Overlay Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center px-page-desktop">
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

            <header className="relative z-10 text-white flex flex-col justify-center items-start gap-4 max-w-full pb-12 transition-all duration-300 ease-in-out">
              {currentSlide?.title && (
                <h4 className="text-md xl:text-xl font-bold tracking-wide p-[0.5rem] btn-secondary opacity-100 !text-white transform transition-all duration-300">
                  {currentSlide.title}
                </h4>
              )}
          
              {currentSlide?.subtitle && (
                <h2 className="text-white/80 text-3xl xl:text-6xl font-extrabold tracking-tight break-words xl:max-w-3xl">
                  {currentSlide.subtitle}
                </h2>
              )}

              {currentSlide?.description && (
                <p className="max-w-full xl:max-w-xl text-white/90 text-base xl:text-lg">
                  {currentSlide.description}
                </p>
              )}
            </header>
          </div>

          <Swiper 
            slidesPerView={1}
            // 2. Added Autoplay here inside the modules array
            modules={[Navigation, Pagination, EffectFade, Autoplay]} 
            effect={"fade"}
            fadeEffect={{ crossFade: true }}
            loop={true}
            onSlideChange={handleSlideChange}
            // 3. Enabled autoplay with a realistic reading delay (5000ms = 5s)
            // disableOnInteraction: false keeps it running even if a user clicks a nav arrow
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            pagination={{
              clickable: true,
            }}
            className="w-full h-full relative 
              [&_.swiper-pagination-bullet]:bg-white 
              [&_.swiper-pagination-bullet]:opacity-50 
              [&_.swiper-pagination-bullet-active]:bg-white 
              [&_.swiper-pagination-bullet-active]:opacity-100 
              [&_.swiper-pagination]:z-20 
              [&_.swiper-pagination]:bottom-6"
          >
            {slides.map((slide, i) => (
              <SwiperSlide
                key={i}
                style={{ backgroundImage: `url(${slide?.imgPath})` }}
                className="h-full w-full bg-cover bg-center"
              />
            ))}

            {/* Navigation Controls */}
            <button className="btn-secondary custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 hover:bg-white/40 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button className="btn-secondary custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 hover:bg-white/40 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </Swiper>
        </>
      )}
    </section>
  );
};

export default Hero;