import { useState, useEffect } from "react";
import Header from "../../components/client/Header";
import CartButton from "../../components/client/cartBTN";
import TailorCard from "../../components/client/TailorCard";
import TailorFeatureSection from "../../components/client/TailorFeatureSection";
import Footer from "../../components/client/Footer";
import { useNavigate } from "react-router";
import { useTailors } from "../../hooks/TailorProfile/useTailors";

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const navigate = useNavigate();
  const { fetchTailors, loading, error, data } = useTailors();

  useEffect(() => {
    // Initial fetch of all tailors
    fetchTailors({});
  }, []);

  // Update tailors when category changes
  useEffect(() => {
    if (selectedCategory !== "ALL") {
      fetchTailors({ query: selectedCategory });
    } else {
      fetchTailors({});
    }
  }, [selectedCategory]);

  const categories = [
    "ALL",
    "Men's Tailoring",
    "Women's Tailoring",
    "Alterations & Repairs",
    "Bespoke Suits",
    "Traditional Wear",
    "Wedding Attire",
    "Leather & Denim Repairs",
  ];

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.length > 0) {
      // Filter suggestions based on available services and tailor names
      const tailorSuggestions = data.tailors
        .map((tailor) => tailor.shopName)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(tailorSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

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
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setSuggestions([]);
                  }}
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
          {data.total || 0}+ Tailors
        </h1>
        <h1 className="text-3xl font-ibarra font-semibold text-[#111827]">
          One Vision, Perfection
        </h1>
      </div>

      {/* Categories Filter */}
      <div className="flex justify-center gap-6 py-3 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${
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
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">
            {error}
          </div>
        ) : data.tailors.length > 0 ? (
          data.tailors.map((tailor, index) => (
            <TailorCard
              key={index}
              _id={tailor.id}
              shopName={tailor.shopName}
              image={tailor.image}
              rating={tailor.rating}
              experience={tailor.experience}
              priceRange={tailor.priceRange}
              description={tailor.description}
              services={tailor.services}
              location={tailor.location}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">No tailors found</div>
        )}
      </div>

      <TailorFeatureSection />
      <Footer />
    </div>
  );
}
