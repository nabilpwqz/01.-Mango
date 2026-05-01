"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  { name: "Ayesha", text: "The borrowing flow is super smooth and fast." },
  { name: "Rayan", text: "I discovered new science books every week." },
  { name: "Nabila", text: "Clean interface and very mobile friendly." }
];

export default function TestimonialSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      className="rounded-2xl bg-white border border-[#e5e7eb] p-6"
    >
      {testimonials.map((item) => (
        <SwiperSlide key={item.name}>
          <div className="py-6 text-center">
            <p className="text-lg md:text-xl">"{item.text}"</p>
            <p className="mt-4 font-semibold text-[#059669]">- {item.name}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
