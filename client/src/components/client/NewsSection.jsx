import React from "react";

const newsArticles = [
  {
    title: "Colorful and fashionable wardrobe",
    date: "April 20, 2023",
    category: "Tailors",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Handmade suit for elegant event",
    date: "April 20, 2023",
    category: "Tailors",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "Spring-summer fashion ideas 2023",
    date: "April 20, 2023",
    category: "Tailors",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
  {
    title: "DIY dress for wedding season",
    date: "April 20, 2023",
    category: "Tailors",
    image:
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
  },
];

export default function NewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Read Our Latest News
        </h2>
        <p className="text-lg italic text-gray-600 mt-2">High Quality Tailor</p>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">
          {newsArticles.map((article, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* News Image */}
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* News Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {article.title}
              </h3>

              {/* Date & Category */}
              <p className="text-md italic text-gray-600 mt-1">
                {article.date} / {article.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
