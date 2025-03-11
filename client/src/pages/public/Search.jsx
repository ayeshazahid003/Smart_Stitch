import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/client/Header";
import CartButton from "../../components/client/cartBTN";
import Footer from "../../components/client/Footer";

const tailorServices = [
  {
    title: "Classic Tailor",
    categories: "Men's Suits, Formal Wear",
    price: 5000,
    rating: 4.5,
    experience: 5,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Modern Tailor",
    categories: "Women's Dresses, Bridal",
    price: 8000,
    rating: 4.2,
    experience: 3,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Luxury Tailors",
    categories: "Designer Wear, Bespoke",
    price: 15000,
    rating: 4.8,
    experience: 10,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Classic Tailor",
    categories: "Men's Suits, Formal Wear",
    price: 5000,
    rating: 4.5,
    experience: 5,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Modern Tailor",
    categories: "Women's Dresses, Bridal",
    price: 8000,
    rating: 4.2,
    experience: 3,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Luxury Tailors",
    categories: "Designer Wear, Bespoke",
    price: 15000,
    rating: 4.8,
    experience: 10,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  }
  ,
  {
    title: "Classic Tailor",
    categories: "Men's Suits, Formal Wear",
    price: 5000,
    rating: 4.5,
    experience: 5,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Modern Tailor",
    categories: "Women's Dresses, Bridal",
    price: 8000,
    rating: 4.2,
    experience: 3,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Luxury Tailors",
    categories: "Designer Wear, Bespoke",
    price: 15000,
    rating: 4.8,
    experience: 10,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  }
  ,
   {
    title: "Classic Tailor",
    categories: "Men's Suits, Formal Wear",
    price: 5000,
    rating: 4.5,
    experience: 5,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Modern Tailor",
    categories: "Women's Dresses, Bridal",
    price: 8000,
    rating: 4.2,
    experience: 3,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Luxury Tailors",
    categories: "Designer Wear, Bespoke",
    price: 15000,
    rating: 4.8,
    experience: 10,
    image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  }
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    price: "",
    rating: "",
    experience: "",
  });

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    setSuggestions(
      query.length > 0
        ? tailorServices
            .map((service) => service.title)
            .concat(
              tailorServices.flatMap((service) =>
                service.categories.split(", ")
              )
            )
            .filter((item) => item.toLowerCase().includes(query))
        : []
    );
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const filteredTailors = tailorServices.filter((tailor) => {
    return (
      (searchTerm === "" ||
        tailor.title.toLowerCase().includes(searchTerm) ||
        tailor.categories.toLowerCase().includes(searchTerm)) &&
      (filters.price === "" ||
        (filters.price === "low-to-high" && tailor.price >= 0) ||
        (filters.price === "high-to-low" && tailor.price >= 0)) &&
      (filters.rating === "" || tailor.rating >= parseFloat(filters.rating)) &&
      (filters.experience === "" || tailor.experience >= parseInt(filters.experience))
    );
  });

  return (
    <div>
      <Header />
      <CartButton />

      {/* Hero Section */}
      <div className="relative h-[400px] flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-white text-4xl z-10">
          Find the Perfect Tailor for Your Needs
        </h1>
        <div className="relative z-10 mt-6 w-80">
          <div className="flex items-center gap-2 relative">
            <input
              type="text"
              placeholder="Search for tailors, services..."
              className="p-3 w-full rounded-full border-2 border-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-gray-100 rounded-full shadow-md relative"
            >
              <FaFilter />
            </button>

            {/* Filters Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 bg-white shadow-lg border rounded-lg p-4 w-64"
                >
                  <h3 className="text-lg font-semibold mb-3">Filters</h3>
                  <div className="grid gap-3">
                    {/* Price Filter */}
                    <select
                      name="price"
                      onChange={handleFilterChange}
                      className="p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Sort by Price</option>
                      <option value="low-to-high">Low to High</option>
                      <option value="high-to-low">High to Low</option>
                    </select>

                    {/* Rating Filter */}
                    <select
                      name="rating"
                      onChange={handleFilterChange}
                      className="p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Filter by Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>

                    {/* Experience Filter */}
                    <select
                      name="experience"
                      onChange={handleFilterChange}
                      className="p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Filter by Experience</option>
                      <option value="1">1+ Years</option>
                      <option value="3">3+ Years</option>
                      <option value="5">5+ Years</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTailors.length > 0 ? (
            filteredTailors.map((tailor, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <img
                  src={tailor.image}
                  alt={tailor.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{tailor.title}</h3>
                <p className="text-gray-600 mt-2">{tailor.categories}</p>
                <p className="text-gray-500 mt-1">⭐ {tailor.rating}</p>
                <p className="text-gray-500 mt-1">💰 PKR {tailor.price}</p>
                <p className="text-gray-500 mt-1">🧵 {tailor.experience} Years Experience</p>
              </div>
            ))
          ) : (
            <p>No tailors found.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
