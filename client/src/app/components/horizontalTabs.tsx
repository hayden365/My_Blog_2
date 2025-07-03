"use client";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { Tag } from "../lib/types/post";
import Link from "next/link";

const HorizontalTabs = ({
  tags,
  activeTag,
}: {
  tags: Tag[];
  activeTag: string | "all";
}) => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
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
    <div className="relative w-full mx-10 pb-4 border-b border-gray-100">
      <div
        className={twMerge(
          `pb-4 pr-10 bg-transparent bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.75)_25%,_rgba(255,255,255,0.9)_50%,_rgba(255,255,255,1)_75%)]`,
          showLeftArrow ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          onClick={() => swiper?.slidePrev()}
          className="absolute left-0 top-0 z-20 w-10 h-full flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      <div className="overflow-x-auto mx-10">
        <Swiper
          onSwiper={setSwiper}
          slidesPerView="auto"
          spaceBetween={10}
          className="w-full"
          modules={[Mousewheel]}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 1,
            thresholdTime: 0,
          }}
          allowTouchMove={false}
          speed={100}
          resistance={false}
        >
          <SwiperSlide key="all" className="!w-auto">
            <Link
              href="/"
              className={twMerge(
                `flex-shrink-0 text-sm mr-6 ${
                  activeTag === "all"
                    ? "font-bold border-b-2 border-black text-black"
                    : "text-gray-500"
                }`
              )}
            >
              All
            </Link>
          </SwiperSlide>
          {tags &&
            tags.map((tag: Tag, index: number) => (
              <SwiperSlide key={tag._id} className="!w-auto">
                <Link
                  href={`/?tag=${tag.name}`}
                  className={twMerge(
                    `flex-shrink-0 text-sm ${
                      index === 0
                        ? "mr-6"
                        : index === tags.length - 1
                          ? "mr-[50px]"
                          : "mr-8"
                    } ${
                      activeTag === tag.name
                        ? "font-bold border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`
                  )}
                >
                  {tag.name}
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div
        className={twMerge(
          `pl-10 bg-[linear-gradient(90deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.75)_25%,_rgba(255,255,255,0.9)_50%,_rgba(255,255,255,1)_75%)]`,
          showRightArrow ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white to-transparent z-10" />
        <button
          onClick={() => swiper?.slideNext()}
          className="absolute right-0 top-0 z-20 bg-white/0 backdrop-blur-sm w-10 h-full flex items-center justify-center"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default HorizontalTabs;
