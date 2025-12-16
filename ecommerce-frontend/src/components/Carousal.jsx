import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "SELECTED PIQUE POLOSHIRT",
    subtitle: "Free Shipping Worldwide",
    image: "/img2.png", // make sure this is PNG with transparent background
  },
  {
    id: 2,
    title: "SUMMER TEE COLLECTION",
    subtitle: "Limited Edition",
    image: "/img2.png", // converted to PNG for transparency
  },
  {
    id: 3,
    title: "CLASSIC DENIM JACKET",
    subtitle: "New Arrival",
    image: "/img2.png",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden border-b bg-[#f5f5f4]">
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-between"
        >
          {/* Text section */}
          <div className="w-1/2 pl-16 z-10">
            <h2 className="text-4xl font-bold">{slides[current].title}</h2>
            <p className="mt-2 text-gray-600">{slides[current].subtitle}</p>
          </div>

          {/* Image section */}
          <div className="w-1/2 h-full flex justify-end mr-[40px]">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="h-full object-contain bg-transparent"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full z-20"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full z-20"
      >
        &#10095;
      </button>
    </div>
  );
}
