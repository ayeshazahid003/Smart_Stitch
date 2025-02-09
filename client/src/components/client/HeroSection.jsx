import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    title: "Premium couture team.",
    subtitle: "High-end suits.",
    description:
      "At vero et justoprovident, similique sunt in culpa mi quis hendrerit...",
  },
  {
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703979/suit1_hn8kfi.jpg",
    title: "Handcrafted Perfection.",
    subtitle: "Elegant Custom Suits.",
    description:
      "Every detail tailored to perfection, ensuring a flawless experience.",
  },
  {
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    title: "Timeless Fashion.",
    subtitle: "Classic & Modern Styles.",
    description:
      "Experience the blend of traditional craftsmanship and modern aesthetics.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
              <h1 className="text-3xl md:text-5xl font-semibold mb-2">
                {slide.title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-light">{slide.subtitle}</h2>
              <p className="text-lg mt-3 max-w-xl">{slide.description}</p>
              <button className="mt-6 px-6 py-2 border border-white text-white text-sm uppercase tracking-wider hover:bg-white hover:text-black transition">
                Discover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Left & Right Navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </section>
  );
}
