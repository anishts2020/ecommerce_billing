import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { ASSET_BASE_URL } from "../api/api";

export default function Carousel() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  /* 🔄 Fetch carousel items */
  useEffect(() => {
    api
      .get("/carousels")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        // Important: sort by order
        const sorted = [...list].sort(
          (a, b) => a.carousel_order - b.carousel_order
        );

        setSlides(sorted);
      })
      .catch(console.error);
  }, []);

  /* ⏱ Auto slide ONLY for images */
  useEffect(() => {
    if (!slides.length) return;

    const slide = slides[current];

    // Image → auto advance
    if (slide.carousel_type === "image") {
      const timer = setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
      }, 2500);

      return () => clearTimeout(timer);
    }

    // Video → do nothing (wait for onEnded)
  }, [current, slides]);

  if (!slides.length) return null;

  const slide = slides[current];
  const src = `${ASSET_BASE_URL}/${slide.carousel_url}`;

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-[#f5f5f4]">
      <AnimatePresence mode="wait">
        {/* IMAGE */}
        {slide.carousel_type === "image" && (
          <motion.img
            key={`img-${slide.id}`}
            src={src}
            className="absolute inset-0 w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* VIDEO */}
        {slide.carousel_type === "video" && (
          <motion.video
            key={`vid-${slide.id}`}
            src={src}
            className="absolute inset-0 w-full h-full object-contain"
            autoPlay
            muted
            playsInline
            onEnded={() =>
              setCurrent((p) => (p + 1) % slides.length)
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "bg-black w-5" : "bg-black/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
