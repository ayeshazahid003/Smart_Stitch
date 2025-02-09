import React, { useState } from "react";
import Header from "../../components/client/Header";
import CartButton from "../../components/client/cartBTN";

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Dummy data for tailor search suggestions (replace with API fetch if needed)
  const tailorOptions = [
    "Custom Suit Tailor",
    "Wedding Dress Tailor",
    "Alterations & Repairs",
    "Local Bespoke Tailors",
    "Traditional Attire Tailor",
    "Leather Jacket Repair",
    "Quick Fix Tailors",
  ];

  // Function to filter suggestions based on input
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      const filteredSuggestions = tailorOptions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <Header />
      <CartButton />
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
          />
          {/* Suggestions Dropdown */}
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
    </div>
  );
}
