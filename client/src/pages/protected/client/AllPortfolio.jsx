import React, { useState, useEffect } from "react";
import { getListOfPortfolio } from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AllPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      const response = await getListOfPortfolio(user._id);
      if (response.success) {
        setPortfolio(response.portfolio);
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [user._id]);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4">
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col"
          >
            {item.images && item.images.length > 0 && (
              <Slider {...sliderSettings} className="mb-4">
                {item.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Portfolio ${item.name} ${index}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </Slider>
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600 mb-2">
              {item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description}
            </p>
            <p className="text-gray-500 mb-4">
              {new Date(item.date).toLocaleDateString()}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => alert("Edit clicked")}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilSquareIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => alert("Delete clicked")}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
