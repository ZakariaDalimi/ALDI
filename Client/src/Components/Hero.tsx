import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  actionLabel?: string;
  linkTo?: string;
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
    <section aria-label="ALDI entdecken" className="group relative mb-16 h-[65svh] min-h-[440px] max-h-[760px] w-full overflow-hidden bg-neutral-900">
      {slides && slides.length > 0 && (
        <>
          {/* Text Overlay Layer */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-page-desktop">
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />

            <header key={activeIndex} className="motion-rise pointer-events-auto relative z-10 flex max-w-2xl flex-col items-start gap-4 pb-12 text-white transition-all duration-300 ease-in-out">
              {currentSlide?.title && (
                <p className="bg-secondary-container px-3 py-1 text-sm font-bold text-white">
                  {currentSlide.title}
                </p>
              )}
          
              {currentSlide?.subtitle && (
                <h1 className="break-words text-4xl font-extrabold text-white sm:text-5xl xl:text-6xl">
                  {currentSlide.subtitle}
                </h1>
              )}

              {currentSlide?.description && (
                <p className="max-w-xl text-base text-white/90 xl:text-lg">
                  {currentSlide.description}
                </p>
              )}
              {currentSlide?.linkTo && currentSlide.actionLabel && (
                <Link
                  to={currentSlide.linkTo}
                  className="mt-2 inline-flex min-h-12 items-center bg-white px-5 font-semibold text-primary transition-colors hover:bg-secondary-container hover:text-white"
                >
                  {currentSlide.actionLabel}
                  <ArrowRight className="ml-3" size={18} aria-hidden="true" />
                </Link>
              )}
            </header>
          </div>

          <Swiper 
            slidesPerView={1}
            modules={[Navigation, Pagination, EffectFade, Autoplay]} 
            effect={"fade"}
            fadeEffect={{ crossFade: true }}
            loop={true}
            onSlideChange={handleSlideChange}
            autoplay={{
              delay: 6000,
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
            <button aria-label="Vorheriges Angebot" title="Vorheriges Angebot" className="custom-prev pointer-events-auto absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-black/40 p-3 text-white opacity-0 transition-all hover:bg-black/70 group-hover:opacity-100">
              <ArrowLeft size={22} aria-hidden="true" />
            </button>

            <button aria-label="Nächstes Angebot" title="Nächstes Angebot" className="custom-next pointer-events-auto absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-black/40 p-3 text-white opacity-0 transition-all hover:bg-black/70 group-hover:opacity-100">
              <ArrowRight size={22} aria-hidden="true" />
            </button>
          </Swiper>
        </>
      )}
    </section>
  );
};

export default Hero;