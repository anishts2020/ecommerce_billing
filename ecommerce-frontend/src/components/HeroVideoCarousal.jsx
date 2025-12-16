import { motion } from "framer-motion";

const VIDEO_URL = "http://127.0.0.1:8000/videos/carouselvideo.mp4";

export default function HeroVideoCarousal() {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-black">
      <motion.video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </section>
  );
}
