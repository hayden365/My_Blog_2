"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import "swiper/css";

const tabs = [
  "For you",
  "Following",
  "Featured",
  "Typescript",
  "Apple",
  "Android",
  "iOS",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Docker",
];
const HorizontalTabs = () => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = useCallback(() => {
    if (swiper) {
      const { isBeginning, isEnd } = swiper;
      setShowLeftArrow(!isBeginning);
      setShowRightArrow(!isEnd);
    }
  }, [swiper]);

  useEffect(() => {
    checkArrows();
    const interval = setInterval(checkArrows, 200);
    return () => clearInterval(interval);
  }, [swiper, checkArrows]);

  return (
    <div className="relative w-full overflow-x-auto flex justify-center items-center gap-4 border-b border-gray-100">
      {showLeftArrow && (
        <button
          onClick={() => swiper?.slidePrev()}
          className="absolute left-0 z-10 bg-white w-10 h-10"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      )}
      <Swiper
        onSwiper={setSwiper}
        slidesPerView={7}
        spaceBetween={10}
        className="w-full"
      >
        {tabs.map((tab) => (
          <SwiperSlide key={tab}>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={twMerge(
                `flex-shrink-0 px-4 py-2 text-sm ${
                  activeTab === tab
                    ? "font-bold border-b-2 border-black text-black"
                    : "text-gray-500"
                }`
              )}
            >
              {tab}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      {showRightArrow && (
        <button
          onClick={() => swiper?.slideNext()}
          className="absolute right-0 z-10 bg-white w-10 h-10"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default HorizontalTabs;
