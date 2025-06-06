import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import Header from "../../components/client/Header";
import CartButton from "../../components/client/cartBTN";
import Footer from "../../components/client/Footer";
import { useSearchTailors } from "../../hooks/TailorProfile/useSearchTailors";
import { useSearchParams } from "react-router";
import TailorCard from "../../components/client/TailorCard";

const getPriceRanges = (tailorServices) => {
  const ranges = [
    { label: "Less than PKR 5,000", min: 0, max: 4999 },
    { label: "PKR 5,000 to PKR 10,000", min: 5000, max: 10000 },
    { label: "PKR 10,000 to PKR 15,000", min: 10001, max: 15000 },
    { label: "PKR 15,000+", min: 15001, max: Infinity },
  ];
  return ranges.map((range) => {
    const count = (tailorServices || []).filter(
      (t) => t.price >= range.min && t.price <= range.max
    ).length;
    return { ...range, count };
  });
};

const getRatingRanges = (tailorServices) => {
  const ranges = [
    { label: "3+ Stars", min: 3 },
    { label: "4+ Stars", min: 4 },
    { label: "4.5+ Stars", min: 4.5 },
  ];
  return ranges.map((range) => {
    const count = (tailorServices || []).filter(
      (t) => t.rating >= range.min
    ).length;
    return { ...range, count };
  });
};

const getExperienceRanges = (tailorServices) => {
  const ranges = [
    { label: "1+ Years", min: 1 },
    { label: "3+ Years", min: 3 },
    { label: "5+ Years", min: 5 },
  ];
  return ranges.map((range) => {
    const count = (tailorServices || []).filter(
      (t) => t.experience >= range.min
    ).length;
    return { ...range, count };
  });
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const { searchTailors, loading, error, data } = useSearchTailors();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  // For multiple checkbox filters, we'll store arrays of selected indexes for each category.
  const [selectedPriceIndexes, setSelectedPriceIndexes] = useState([]);
  const [selectedRatingIndexes, setSelectedRatingIndexes] = useState([]);
  const [selectedExperienceIndexes, setSelectedExperienceIndexes] = useState(
    []
  );

  // For mobile collapsible sidebar
  const [showFilters, setShowFilters] = useState(false);

  // Near Me functionality
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get user's location for "Near Me" feature
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

  // Toggle Near Me functionality
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

  useEffect(() => {
    // Initial search with query parameter if it exists
    const initialQuery = searchParams.get("query") || "";
    if (initialQuery) {
      searchTailors(initialQuery);
    } else {
      searchTailors("");
    }
  }, []);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      const params = { query: searchTerm };

      // Add filter parameters
      if (selectedPriceIndexes.length > 0) {
        const selectedRange = priceRanges[selectedPriceIndexes[0]];
        params.minPrice = selectedRange.min;
        params.maxPrice = selectedRange.max;
      }

      if (selectedRatingIndexes.length > 0) {
        const selectedRange = ratingRanges[selectedRatingIndexes[0]];
        params.minRating = selectedRange.min;
      }

      if (selectedExperienceIndexes.length > 0) {
        const selectedRange = experienceRanges[selectedExperienceIndexes[0]];
        params.minExperience = selectedRange.min;
      }

      // Add location parameters if Near Me is active
      if (isNearMeActive && userLocation) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
        params.maxDistance = 10; // in kilometers, adjust as needed
      }

      // Update search params in URL
      setSearchParams(params);

      // Call search API with filters
      searchTailors(params);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    selectedPriceIndexes,
    selectedRatingIndexes,
    selectedExperienceIndexes,
    isNearMeActive,
    userLocation,
    setSearchParams,
  ]);

  // Precompute our filter ranges (with counts) using the fetched data
  const priceRanges = getPriceRanges(data?.tailors);
  const ratingRanges = getRatingRanges(data?.tailors);
  const experienceRanges = getExperienceRanges(data?.tailors);

  // Handle search input & suggestions
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (data?.tailors) {
      setSuggestions(
        query.length > 0
          ? Array.from(
              new Set([
                ...data.tailors.map((service) => service.shopName),
                ...data.tailors.flatMap((service) =>
                  service.description ? [service.description] : []
                ),
              ])
            ).filter((item) => item.toLowerCase().includes(query))
          : []
      );
    }
  };

  // Filter handlers remain the same
  const handlePriceCheck = (index) => {
    if (selectedPriceIndexes.includes(index)) {
      setSelectedPriceIndexes(selectedPriceIndexes.filter((i) => i !== index));
    } else {
      setSelectedPriceIndexes([...selectedPriceIndexes, index]);
    }
  };

  const handleRatingCheck = (index) => {
    if (selectedRatingIndexes.includes(index)) {
      setSelectedRatingIndexes(
        selectedRatingIndexes.filter((i) => i !== index)
      );
    } else {
      setSelectedRatingIndexes([...selectedRatingIndexes, index]);
    }
  };

  const handleExperienceCheck = (index) => {
    if (selectedExperienceIndexes.includes(index)) {
      setSelectedExperienceIndexes(
        selectedExperienceIndexes.filter((i) => i !== index)
      );
    } else {
      setSelectedExperienceIndexes([...selectedExperienceIndexes, index]);
    }
  };

  // Filter the tailors based on selected filters
  const filteredTailors = (data?.tailors || []).filter((tailor) => {
    // Match search
    const matchSearch =
      searchTerm === "" ||
      tailor.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tailor.description &&
        tailor.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Price filter
    let matchPrice = true;
    if (selectedPriceIndexes.length > 0) {
      matchPrice = selectedPriceIndexes.some((idx) => {
        const range = priceRanges[idx];
        const price = tailor.price || 0;
        return price >= range.min && price <= range.max;
      });
    }

    // Rating filter
    let matchRating = true;
    if (selectedRatingIndexes.length > 0) {
      matchRating = selectedRatingIndexes.some((idx) => {
        const range = ratingRanges[idx];
        return (tailor.rating || 0) >= range.min;
      });
    }

    // Experience filter
    let matchExperience = true;
    if (selectedExperienceIndexes.length > 0) {
      matchExperience = selectedExperienceIndexes.some((idx) => {
        const range = experienceRanges[idx];
        return (tailor.experience || 0) >= range.min;
      });
    }

    return matchSearch && matchPrice && matchRating && matchExperience;
  });

  // ...rest of your render methods remain the same...
  const renderFilterUI = () => {
    return (
      <div className="md:w-64">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Near Me Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Location</h3>
          <div className="flex items-center">
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
                <span className="ml-2 text-md">{range.label}</span>
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
                <span className="ml-2 text-md">{range.label}</span>
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
                <span className="ml-2 text-md">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : filteredTailors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTailors.map((tailor, index) => (
              <TailorCard
                _id={tailor.id}
                key={index}
                shopName={tailor.shopName}
                image={tailor.image}
                rating={tailor.rating}
                experience={tailor.experience}
                priceRange={tailor.priceRange}
                description={tailor.description}
                services={tailor.services}
                location={tailor.location}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No tailors found.</p>
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
