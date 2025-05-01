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
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const { fetchTailors, loading, error, data } = useTailors();

  useEffect(() => {
    // Initial fetch of all tailors
    fetchTailors({});
  }, []);

  // Update tailors when category or location filtering changes
  useEffect(() => {
    if (isNearMeActive && userLocation) {
      fetchTailors({
        query: selectedCategory !== "ALL" ? selectedCategory : "",
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        maxDistance: 10, // in kilometers, adjust as needed
      });
    } else if (selectedCategory !== "ALL") {
      fetchTailors({ query: selectedCategory });
    } else {
      fetchTailors({});
    }
  }, [selectedCategory, isNearMeActive, userLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsNearMeActive(true);
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsNearMeActive(false);
        setLoadingLocation(false);
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const toggleNearMe = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
    } else {
      if (userLocation) {
        setIsNearMeActive(true);
      } else {
        getUserLocation();
      }
    }
  };

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

      {/* Categories Filter and Near Me Button */}
      <div className="flex flex-col items-center mb-4">
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

        <div className="mt-4 flex items-center">
          <button
            onClick={toggleNearMe}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isNearMeActive
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            disabled={loadingLocation}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {loadingLocation
              ? "Getting location..."
              : isNearMeActive
              ? "Near Me (Active)"
              : "Near Me"}
          </button>
          {locationError && (
            <p className="ml-3 text-red-500 text-sm">{locationError}</p>
          )}
        </div>
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
          <div className="col-span-full text-center py-8">
            {isNearMeActive
              ? "No tailors found near your location"
              : "No tailors found"}
          </div>
        )}
      </div>

      <TailorFeatureSection />
      <Footer />
    </div>
  );
}
