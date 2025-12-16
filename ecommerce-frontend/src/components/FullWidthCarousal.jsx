import React, { useState } from "react";
import Slider from "react-slick";
import { motion, useAnimation } from "framer-motion";

const slides = [
  {
    image: "/img2.png",
    title: "Testimonials",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    author: "John Brown",
  },
  {
    image: "img.png",
    title: "Testimonials",
    content: "This is another testimonial example. Great service and amazing experience!",
    author: "Jane Doe",
  },
  {
    image: "img.png",
    title: "Testimonials",
    content: "Highly recommend! Quality and service are unmatched.",
    author: "Michael Smith",
  },
];

export default function FullWidthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  return (
    <div className="w-full relative h-screen overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full h-screen">
            {/* Background Image */}
            <motion.div
              style={{ backgroundImage: `url(${slide.image})` }}
              className="absolute top-0 left-0 w-full h-full bg-center bg-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: currentSlide === index ? 1 : 1.2 }}
              transition={{ duration: 1 }}
            />

            {/* Overlay Content */}
            <motion.div
              className="relative z-10 flex flex-col items-start justify-center h-full px-10 md:px-20 text-white max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 50,
              }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl mb-6">{slide.content}</p>
              <span className="text-lg italic">- {slide.author} -</span>
            </motion.div>

            {/* Optional: Avatars / Dots */}
            <div className="absolute bottom-10 left-10 flex space-x-4 z-20">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full border-2 border-white overflow-hidden cursor-pointer ${
                    currentSlide === i ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => setCurrentSlide(i)}
                >
                  <img src={s.image} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
