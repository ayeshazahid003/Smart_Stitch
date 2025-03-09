import React from "react";

const features = [
  {
    title: "Dress Tailor",
    subtitle: "Dress Tailor",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    rounded: true, // This image should be rounded
  },
  {
    title: "Design Sketches",
    subtitle: "Design",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    rounded: false, // Rectangular image
  },
  {
    title: "Handmade",
    subtitle: "Handmade",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    rounded: true, // This image should be rounded
  },
  {
    title: "Singer Machine",
    subtitle: "Custom Tailored",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
    rounded: false, // Rectangular image
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image with Conditional Rounded Styling */}
              <div
                className={`w-60 h-80 overflow-hidden ${
                  feature.rounded ? "rounded-t-full" : "rounded-md"
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              {/* Subtitle (Italic) */}
              <p className="text-md italic text-gray-600">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
