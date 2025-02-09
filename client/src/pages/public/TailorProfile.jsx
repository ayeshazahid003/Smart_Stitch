import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

export default function TailorProfile() {
  // Sample tailor data (replace with real API data)
  const tailor = {
    name: "John Doe",
    shopName: "Elite Tailor Studio",
    profilePicture: "https://source.unsplash.com/150x150/?portrait", // Profile picture field
    shopLocation: "New York, USA",
    bio: "Expert in custom suits, bridal wear, and high-end fashion alterations.",
    rating: 4.8,
    shopImages: [
      "https://source.unsplash.com/800x600/?tailor,shop",
      "https://source.unsplash.com/800x600/?sewing,machine",
    ],
    portfolio: [
      {
        name: "Custom Suit",
        images: ["https://source.unsplash.com/800x600/?suit,fashion"],
        description: "Handmade premium suit with the finest materials.",
      },
      {
        name: "Bridal Dress",
        images: ["https://source.unsplash.com/800x600/?wedding,dress"],
        description: "Elegant and personalized wedding dress designs.",
      },
    ],
    serviceRates: [
      {
        type: "Custom Suit",
        description: "Premium bespoke suits tailored to perfection.",
        price: 499,
        image: "https://source.unsplash.com/200x200/?suit,fashion",
      },
      {
        type: "Alterations",
        description: "Perfect fitting and quality adjustments.",
        price: 99,
        image: "https://source.unsplash.com/200x200/?tailor,alteration",
      },
    ],
    reviews: [
      {
        user: "Michael",
        comment: "Absolutely fantastic craftsmanship!",
        rating: 5,
      },
      {
        user: "Sarah",
        comment: "Perfect wedding dress, great experience!",
        rating: 4.8,
      },
    ],
  };

  // Search state to filter items in the profile
  const [searchTerm, setSearchTerm] = useState("");

  // Filter portfolio items based on name or description
  const filteredPortfolio = tailor.portfolio.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter services based on type or description
  const filteredServices = tailor.serviceRates.filter((service) =>
    service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter reviews based on comment or user name
  const filteredReviews = tailor.reviews.filter((review) =>
    review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${tailor.shopImages[0]})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold">{tailor.shopName}</h1>
          <p className="text-lg mt-2 flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" />
            {tailor.shopLocation}
          </p>
          <p className="text-lg mt-4 max-w-2xl mx-auto">{tailor.bio}</p>
        </div>

        {/* Profile Picture with absolute positioning */}
        <img
          src={tailor.profilePicture}
          alt="Profile"
          className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-xl"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search in profile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Portfolio Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Portfolio
          </h2>
          {filteredPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolio.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No portfolio items found.</p>
          )}
        </section>

        {/* Services & Pricing Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Services & Rates
          </h2>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={service.image}
                    alt={service.type}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{service.type}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-indigo-600 font-bold text-xl">
                      ${service.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No services found.</p>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Customer Reviews
          </h2>
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700 mb-4">"{review.comment}"</p>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-bold text-gray-800">{review.rating}</span>
                    <span className="text-gray-500 ml-auto">- {review.user}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No reviews found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
