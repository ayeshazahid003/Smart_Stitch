import React, { useState, useEffect } from "react";
import { getListOfPortfolio } from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Slider from "react-slick";

export default function AllPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user || !user._id) return;
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
  }, []);

  const getSliderSettings = (imageCount) => ({
    dots: true,
    arrows: true,
    infinite: imageCount > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (message === "Tailor profile not found.") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl w-[400px] mb-4">
            We couldn’t find your tailor profile. Please add your shop details to get started.
          </p>
          <button
            onClick={() => (window.location.href = "/add-shop-details")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Shop Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {portfolio.length === 0 ? (
        <div className="flex justify-center items-center flex-col h-screen text-center py-8">
          <p className="text-gray-600 text-xl mb-4">
            It seems like you haven't added a portfolio yet.
          </p>
          <button
            onClick={() => (window.location.href = "/add-portfolio")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Portfolio
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => (window.location.href = "/add-portfolio")}
            className="absolute top-4 right-4 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Portfolio
          </button>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col"
              >
                {item.images && item.images.length > 0 && (
                  <Slider {...getSliderSettings(item.images.length)} className="mb-4">
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
        </>
      )}
    </div>
  );
}