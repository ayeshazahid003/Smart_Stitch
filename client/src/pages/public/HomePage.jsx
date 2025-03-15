import React, { useState } from "react";
import { Link } from "react-router"; // or "react-router" if you're using v5
import Header from "../../components/client/Header"; // Your existing navbar
import HeroSection from "../../components/client/HeroSection";
import FeatureSection from "../../components/client/FeatureSection";
import BespokeSection from "../../components/client/BespokeSection";
import NewsSection from "../../components/client/NewsSection";
import Footer from "../../components/client/Footer";
import serviceBg from "../../assets/dottedbgqa.png"; 
import eveningGown from "../../assets/eveinggown.jpg";
import weddingdress from "../../assets/ClassicWeddingDress.jpg";
import casualwear from "../../assets/0079280_170_b.jpg";
import kurta from "../../assets/kurta.jpg";
import luxury from "../../assets/luxury.jpg";
import office from "../../assets/office.jpg";
import tailor from "../../assets/tailor.png";
// Dummy Data
const tailors = [
  {
    id: 1,
    name: "Ahmed Tailors",
    rating: 4.8,
    image: tailor,
  },
  {
    id: 2,
    name: "Elegant Stitches",
    rating: 4.5,
    image: tailor,
  },
  {
    id: 3,
    name: "Modern Cuts",
    rating: 4.7,
    image: tailor,
  },
  {
    id: 4,
    name: "Classic Designs",
    rating: 4.6,
    image: tailor,
  },
];


// Dummy data for Trending Designs
const trendingDesigns = [
  {
    id: 1,
    title: "Elegant Evening Gown",
    image: eveningGown,
  },
  {
    id: 2,
    title: "Classic Wedding Dress",
    image: weddingdress,
  },
  {
    id: 3,
    title: "Modern Casual Wear",
    image: casualwear,
  },
  {
    id: 4,
    title: "Traditional Embroidered Kurta",
    image: kurta,
  },
  {
    id: 5,
    title: "Luxury Party Outfit",
    image: luxury,
  },
  {
    id: 6,
    title: "Chic Office Attire",
    image: office,
  },
];

// Example FAQ data:
const faqData = [
  {
    question: "Can I customise or alter any of your designs?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "How do I take my measurements to purchase a gown?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "Where are your dresses made?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
  {
    question: "How to pick the right material?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. Ad dolore magna ut enim veniam velit.",
  },
];

//services
const services = [
  {
    title: "Custom Tailoring",
    description: "Personalized suits and dresses",
    icon: "👔",
  },
  {
    title: "Pick & Drop Service",
    description: "Get your suit delivered",
    icon: "🚚",
  },
  {
    title: "Trending Designs",
    description: "View the latest fashion trends",
    icon: "🔥",
  },
  {
    title: "Loyalty Rewards",
    description: "Earn discounts and perks",
    icon: "🎁",
  },
];

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState(-1);

  const toggleFAQ = (index) => {
    setOpenFAQ(index === openFAQ ? -1 : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar: using your existing Header component */}
      <Header />

      <HeroSection />

      {/* Work on your new suit section */}
      <section className="relative bg-white py-16 overflow-hidden">
  {/* Blob 1 */}
  <div className="absolute top-0 right-0 w-72 h-72 animate-blob animation-delay-2000 opacity-30">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#9760F4"
        d="M53,-11.5C61.8,9.8,57.2,41.1,40.6,52.3C24,63.5,-4.6,54.6,-28.3,37.6C-52.1,20.6,-71.1,-4.3,-65.6,-21.1C-60.1,-37.9,-30,-46.5,-3.9,-45.2C22.1,-43.9,44.3,-32.8,53,-11.5Z"
        transform="translate(100 100)"
      />
    </svg>
  </div>

  {/* Blob 2 */}
  <div className="absolute bottom-0 left-0 w-64 h-64 animate-blob animation-delay-4000 opacity-30">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#51cbff"
        d="M53,-11.5C61.8,9.8,57.2,41.1,40.6,52.3C24,63.5,-4.6,54.6,-28.3,37.6C-52.1,20.6,-71.1,-4.3,-65.6,-21.1C-60.1,-37.9,-30,-46.5,-3.9,-45.2C22.1,-43.9,44.3,-32.8,53,-11.5Z"
        transform="translate(100 100)"
      />
    </svg>
  </div>

  <div className="mx-16 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center md:items-start">
    {/* Left Column */}
    <div className="md:w-1/2 text-left">
      <h2 className="text-4xl text-[#020535] md:text-5xl font-sans text-gray-900 leading-tight">
        Individuality of your design.
      </h2>
      <h3
        className="text-4xl md:text-5xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-transparent bg-clip-text"
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: "1.2",
          paddingTop: "10px",
          paddingBottom: "10px",
          overflowWrap: "break-word",
        }}
      >
        Create your style.
      </h3>

      <p className="text-md font-ibarra italic text-gray-600 mt-2">
        High Quality Tailor
      </p>
    </div>

    {/* Right Column */}
    <div className="md:w-1/2 mt-6 md:mt-0 text-gray-700 leading-relaxed text-lg">
      <p>
        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
        suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
        autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
        nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas.
      </p>
    </div>
  </div>
      </section>

    
        {/* Enhanced Services Section */}
        <section 
      className="py-16 bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: `url(${serviceBg})` }} // ✅ Set your image path here
    >
      <div className="max-w-6xl mx-auto px-6">
      <h3
              className="text-4xl md:text-5xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-transparent bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.2",
                paddingTop: "10px",
                paddingBottom: "40px",
                overflowWrap: "break-word",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Our Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center bg-[#020535] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:scale-105 hover:bg-[#9760F4] group"
            >
              <div className="bg-[#9760F4] text-[#ffffff] p-4 rounded-full text-5xl mb-4 shadow-md transition duration-500 ease-in-out group-hover:bg-[#ffffff] group-hover:text-[#9760F4]">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#ffffff] transition duration-500 ease-in-out group-hover:text-[#ffffff]">
                {service.title}
              </h3>
              <p className="text-[#c0c0c0] text-center text-sm transition duration-500 ease-in-out group-hover:text-[#ffffff]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>


    {/* Featured Tailors Section */}
    <section className="py-16 bg-gray-50">
    <h3
              className="text-4xl md:text-5xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-transparent bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.2",
                paddingTop: "10px",
                paddingBottom: "40px",
                overflowWrap: "break-word",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Featured Tailors
        </h3>

      <div className="flex justify-center flex-wrap gap-6 px-4">
        {tailors.map((tailor) => (
          <div
            key={tailor.id}
            className="min-w-[220px] bg-white p-5 rounded-xl shadow-lg border border-[#E5D5FA] transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden will-change-transform"
          >
            <div className="relative w-32 h-32 mx-auto mb-4 transition-transform duration-300 hover:scale-105 overflow-hidden">
              <img
                src={tailor.image}
                alt={tailor.name}
                className="w-full h-full rounded-full object-cover border-4 border-[#9760F4]"
              />
            </div>

            <h3 className="text-xl font-semibold text-[#2D033B]">{tailor.name}</h3>
            <p className="text-yellow-500 text-sm mb-3">⭐ {tailor.rating}</p>

            <Link
              to={`/tailor/${tailor.id}`}
              className="inline-block bg-[#9760F4] text-white py-2 px-5 rounded-full hover:bg-[#7b4bdb] transition-colors duration-300"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </section>





   {/* Trending Designs Section */}
      <section className="py-16 bg-gray-50">
      <h3
              className="text-4xl md:text-5xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-transparent bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1.2",
                paddingTop: "10px",
                paddingBottom: "40px",
                overflowWrap: "break-word",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Trending Designs
        </h3>
        
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
          {trendingDesigns.map((design) => (
            <div
              key={design.id}
              className="relative w-64 h-80 bg-[#F3F1F5] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9760F4] to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 flex items-end justify-center p-3">
                <p className="text-white text-lg font-semibold text-center">{design.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>






      <BespokeSection/>

      {/* Frequently Asked Questions */}
      <section className="relative bg-gray-50 py-10 md:py-16 overflow-hidden">
      
      {/* Purple Blob - Left to Bottom Center */}
      <svg
        className="absolute animate-leftToBottom w-80 h-80 opacity-20"
        style={{ left: "-15%", top: "-15%" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="url(#purpleGradient)"
          d="M30.8,-36C44.8,-32.2,64.5,-29.8,71.4,-20.4C78.3,-11,72.4,5.3,67.5,22.4C62.6,39.5,58.7,57.4,47.6,70C36.5,82.7,18.2,90,0.2,89.7C-17.8,89.4,-35.6,81.5,-50.9,70.2C-66.1,58.9,-78.8,44.3,-76.3,30C-73.7,15.7,-56,1.6,-48,-13.3C-40,-28.3,-41.8,-44.2,-35.5,-50.5C-29.1,-56.7,-14.6,-53.3,-3.1,-49.1C8.4,-44.9,16.8,-39.8,30.8,-36Z"
          transform="translate(100 100)"
        />
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#cf63ff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#4d1ae5", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Blue Blob - Right to Top Center */}
      <svg
        className="absolute animate-rightToTop w-96 h-96 opacity-20"
        style={{ right: "-15%", bottom: "-15%" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="url(#blueGradient)"
          d="M30.8,-36C44.8,-32.2,64.5,-29.8,71.4,-20.4C78.3,-11,72.4,5.3,67.5,22.4C62.6,39.5,58.7,57.4,47.6,70C36.5,82.7,18.2,90,0.2,89.7C-17.8,89.4,-35.6,81.5,-50.9,70.2C-66.1,58.9,-78.8,44.3,-76.3,30C-73.7,15.7,-56,1.6,-48,-13.3C-40,-28.3,-41.8,-44.2,-35.5,-50.5C-29.1,-56.7,-14.6,-53.3,-3.1,-49.1C8.4,-44.9,16.8,-39.8,30.8,-36Z"
          transform="translate(100 100)"
        />
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#4d8bff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1a47e5", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-4xl mx-auto px-4 relative">
      <h3
        className="text-4xl md:text-5xl font-sans bg-gradient-to-r from-[#cf63ff] to-[#4d1ae5] text-transparent bg-clip-text"
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: "1.2",
          paddingTop: "10px",
          paddingBottom: "10px",
          overflowWrap: "break-word",
          textAlign:"center",
          fontWeight: 500,
        }}
      >
        Frequently Asked Questions
      </h3>


        <div className="mt-8 space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border-b">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center py-3 text-left"
              >
                <span className="font-semibold text-gray-800">
                  {item.question}
                </span>
                <span className="text-gray-600">
                  {openFAQ === index ? "-" : "+"}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="text-gray-700 pb-4">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>



      {/* Bottom image gallery */}
      <NewsSection/>

      {/* Footer */}
      <Footer />
    </div>
  );
}
