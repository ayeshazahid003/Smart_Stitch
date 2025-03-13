import React, { useState } from "react";
import { Filter, X } from "lucide-react"; // <-- Import icons from lucide-react
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
  // Repeated for demonstration...
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
  },
];

// Define filter ranges for Price, Rating, Experience
// Each range object includes a label, plus numeric boundaries (for price or rating/experience).
// We'll compute the "count" of matching tailors to show in parentheses (like the screenshot).
const getPriceRanges = () => {
  const ranges = [
    { label: "Less than PKR 5,000", min: 0, max: 4999 },
    { label: "PKR 5,000 to PKR 10,000", min: 5000, max: 10000 },
    { label: "PKR 10,000 to PKR 15,000", min: 10001, max: 15000 },
    { label: "PKR 15,000+", min: 15001, max: Infinity },
  ];
  return ranges.map((range) => {
    const count = tailorServices.filter(
      (t) => t.price >= range.min && t.price <= range.max
    ).length;
    return { ...range, count };
  });
};

const getRatingRanges = () => {
  const ranges = [
    { label: "3+ Stars", min: 3 },
    { label: "4+ Stars", min: 4 },
    { label: "4.5+ Stars", min: 4.5 },
  ];
  return ranges.map((range) => {
    const count = tailorServices.filter((t) => t.rating >= range.min).length;
    return { ...range, count };
  });
};

const getExperienceRanges = () => {
  const ranges = [
    { label: "1+ Years", min: 1 },
    { label: "3+ Years", min: 3 },
    { label: "5+ Years", min: 5 },
  ];
  return ranges.map((range) => {
    const count = tailorServices.filter((t) => t.experience >= range.min).length;
    return { ...range, count };
  });
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // For multiple checkbox filters, we'll store arrays of selected indexes for each category.
  const [selectedPriceIndexes, setSelectedPriceIndexes] = useState([]);
  const [selectedRatingIndexes, setSelectedRatingIndexes] = useState([]);
  const [selectedExperienceIndexes, setSelectedExperienceIndexes] = useState([]);

  // For mobile collapsible sidebar
  const [showFilters, setShowFilters] = useState(false);

  // Precompute our filter ranges (with counts).
  const priceRanges = getPriceRanges();
  const ratingRanges = getRatingRanges();
  const experienceRanges = getExperienceRanges();

  // Handle search input & suggestions
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

  // Toggle checkbox for a specific price range
  const handlePriceCheck = (index) => {
    if (selectedPriceIndexes.includes(index)) {
      setSelectedPriceIndexes(
        selectedPriceIndexes.filter((i) => i !== index)
      );
    } else {
      setSelectedPriceIndexes([...selectedPriceIndexes, index]);
    }
  };

  // Toggle checkbox for a specific rating range
  const handleRatingCheck = (index) => {
    if (selectedRatingIndexes.includes(index)) {
      setSelectedRatingIndexes(
        selectedRatingIndexes.filter((i) => i !== index)
      );
    } else {
      setSelectedRatingIndexes([...selectedRatingIndexes, index]);
    }
  };

  // Toggle checkbox for a specific experience range
  const handleExperienceCheck = (index) => {
    if (selectedExperienceIndexes.includes(index)) {
      setSelectedExperienceIndexes(
        selectedExperienceIndexes.filter((i) => i !== index)
      );
    } else {
      setSelectedExperienceIndexes([...selectedExperienceIndexes, index]);
    }
  };

  // Filtering logic: we do "OR" logic within each category
  // (i.e., pass if tailor fits at least one selected range in that category).
  // If no checkboxes selected in a category, skip that category filter.
  const filteredTailors = tailorServices.filter((tailor) => {
    // 1) Match search
    const matchSearch =
      searchTerm === "" ||
      tailor.title.toLowerCase().includes(searchTerm) ||
      tailor.categories.toLowerCase().includes(searchTerm);

    // 2) Price filter
    // If no price ranges are selected, pass automatically.
    // Otherwise, pass if the tailor's price fits at least one selected range.
    let matchPrice = true;
    if (selectedPriceIndexes.length > 0) {
      matchPrice = false; // We start false and look for an OR match
      for (let idx of selectedPriceIndexes) {
        const range = priceRanges[idx];
        if (tailor.price >= range.min && tailor.price <= range.max) {
          matchPrice = true;
          break;
        }
      }
    }

    // 3) Rating filter
    let matchRating = true;
    if (selectedRatingIndexes.length > 0) {
      matchRating = false;
      for (let idx of selectedRatingIndexes) {
        const range = ratingRanges[idx];
        if (tailor.rating >= range.min) {
          matchRating = true;
          break;
        }
      }
    }

    // 4) Experience filter
    let matchExperience = true;
    if (selectedExperienceIndexes.length > 0) {
      matchExperience = false;
      for (let idx of selectedExperienceIndexes) {
        const range = experienceRanges[idx];
        if (tailor.experience >= range.min) {
          matchExperience = true;
          break;
        }
      }
    }

    return matchSearch && matchPrice && matchRating && matchExperience;
  });

  // Renders the checkboxes for Price, Rating, Experience
  const renderFilterUI = () => {
    return (
      <div className="md:w-64">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Price Range</h3>
          <div className="flex flex-col space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectedPriceIndexes.includes(index)}
                  onChange={() => handlePriceCheck(index)}
                />
                <span className="ml-2 text-md">
                  {range.label} ({range.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Rating</h3>
          <div className="flex flex-col space-y-2">
            {ratingRanges.map((range, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectedRatingIndexes.includes(index)}
                  onChange={() => handleRatingCheck(index)}
                />
                <span className="ml-2 text-md">
                  {range.label} ({range.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <h3 className="text-lg font-medium mb-2">Experience</h3>
          <div className="flex flex-col space-y-2">
            {experienceRanges.map((range, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectedExperienceIndexes.includes(index)}
                  onChange={() => handleExperienceCheck(index)}
                />
                <span className="ml-2 text-md">
                  {range.label} ({range.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renders the main content: search bar, suggestions, and results
  const renderMainContent = () => {
    return (
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for tailors, services..."
            className="p-3 w-full border border-gray-300 rounded focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <h2 className="text-2xl font-semibold mb-6">Tailors</h2>
        {filteredTailors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTailors.map((tailor, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <img
                  src={tailor.image}
                  alt={tailor.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {tailor.title}
                  </h3>
                  <p className="text-md text-gray-500 mb-2">
                    {tailor.categories}
                  </p>
                  <div className="text-md text-gray-600 space-y-1">
                    <div>⭐ {tailor.rating}</div>
                    <div>💰 PKR {tailor.price}</div>
                    <div>🧵 {tailor.experience} Years Experience</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tailors found.</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <CartButton />

      <div className="container mx-auto p-4 md:p-6">
        {/* Mobile filter toggle button */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h1 className="text-xl font-semibold">Tailors</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex">
          {/* Sidebar (collapsible on mobile) */}
          {/* Overlay for mobile */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
              onClick={() => setShowFilters(false)}
            ></div>
          )}

          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white p-4 z-50 transform transition-transform duration-300
            md:static md:translate-x-0 md:h-auto md:w-1/4 md:block
            ${showFilters ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            {/* Close button (mobile only) */}
            <button
              className="mb-4 flex items-center md:hidden"
              onClick={() => setShowFilters(false)}
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </button>
            {renderFilterUI()}
          </div>

          {/* Main Content */}
          <div className="flex-1 md:pl-6">{renderMainContent()}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
