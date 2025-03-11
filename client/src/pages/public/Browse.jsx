import React, { useState } from "react";
import Header from "../../components/client/Header";
import CartButton from "../../components/client/cartBTN";
import TailorCard from "../../components/client/TailorCard";
import { tailorServices } from "../../constant/data";
import TailorFeatureSection from "../../components/client/TailorFeatureSection";
import Footer from "../../components/client/Footer";
import { useNavigate } from "react-router";



export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const navigate = useNavigate();

  const tailorOptions = [
    "Custom Suit Tailor",
    "Wedding Dress Tailor",
    "Alterations & Repairs",
    "Local Bespoke Tailors",
    "Traditional Attire Tailor",
    "Leather Jacket Repair",
    "Quick Fix Tailors",
  ];

  const categories = [
    "ALL",
    "Men’s Tailoring",
    "Women’s Tailoring",
    "Alterations & Repairs",
    "Bespoke Suits",
    "Traditional Wear",
    "Wedding Attire",
    "Leather & Denim Repairs",
  ];


  // const handleSearchChange = (event) => {
  //   // const query = event.target.value;
  //   // setSearchTerm(query);
  //   // setSuggestions(
  //   //   query.length > 0
  //   //     ? tailorOptions.filter((item) =>
  //   //         item.toLowerCase().includes(query.toLowerCase())
  //   //       )
  //   //     : []
  //   // );
  //   navigate(`/search`);
  // };

  const filteredTailorServices =
    selectedCategory === "ALL"
      ? tailorServices
      : tailorServices.filter((service) =>
          service.categories.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div>
      <Header />
      <CartButton />

      {/* Hero Section */}
      <div
        className="relative h-[400px] flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative font-ibarra text-white text-4xl z-10">
          Find the Perfect Tailor for Your Needs
        </h1>
        <div className="relative z-10 mt-6 w-80">
          <input
            type="text"
            placeholder="Search for tailors, services..."
            className="p-3 w-full rounded-full border-2 border-gray-300 focus:outline-none"
            // value={searchTerm}
            // onChange={handleSearchChange}
            onClick={() => navigate(`/search`)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 cursor-pointer hover:bg-gray-200"
                  onClick={() => setSearchTerm(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="px-4 py-8 flex justify-center items-center flex-col">
        <h1 className="text-3xl font-ibarra font-semibold text-[#111827]">
          100+ Tailors
        </h1>
        <h1 className="text-3xl font-ibarra font-semibold text-[#111827]">
          One Vision, Perfection
        </h1>
      </div>

      {/* Categories Filter */}
      <div className="flex justify-center gap-6 py-3">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-semibold ${
              selectedCategory === category
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tailor Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredTailorServices.map((service, index) => (
          <TailorCard key={index} {...service} />
        ))}
      </div>

      <TailorFeatureSection />

      <Footer/>
    </div>
  );
}
