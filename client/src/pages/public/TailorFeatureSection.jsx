// src/components/client/TailorFeatureSection.jsx
import React, { useEffect } from "react";
import TailorCard from "../../components/client/TailorCard";
import { useTailors } from "../../hooks/TailorProfile/useTailors";

export default function TailorFeatureSection() {
  const { fetchTailors, loading, error, data } = useTailors();

  useEffect(() => {
    // Fetch all tailors on mount
    fetchTailors({});
  }, []);

  if (loading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-600">Loading featured tailors…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  const featuredTailors = data.tailors.slice(0, 4);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Featured Tailors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTailors.map((t) => (
            <TailorCard
              key={t.id}
              _id={t.id}
              shopName={t.shopName}
              image={t.image}
              rating={t.rating}
              experience={t.experience}
              priceRange={t.priceRange}
              description={t.description}
              services={t.services}
              location={t.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
