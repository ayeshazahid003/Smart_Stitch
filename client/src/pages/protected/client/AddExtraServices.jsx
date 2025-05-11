import React, { useState } from "react";
import axios from "axios";
import { addExtraService } from "../../../hooks/TailorHooks";
import { toast } from "react-toastify";

const AddExtraService = () => {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !description || !minPrice || !maxPrice) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    const payload = {
      serviceName,
      description,
      minPrice,
      maxPrice,
    };

    try {
      const response = await addExtraService(payload);
      if (response.success) {
        toast.success("Extra service added successfully");
        setServiceName("");
        setDescription("");
        setMinPrice("");
        setMaxPrice("");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to add extra service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Add Extra Service
        </h1>
        {message && (
          <p className="text-center mb-4 text-lg font-medium text-red-600">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="serviceName"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Service Name
            </label>
            <input
              type="text"
              id="serviceName"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter the extra service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Describe the extra service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minPrice"
                className="block text-xl font-semibold text-gray-700 mb-2"
              >
                Minimum Price (RS)
              </label>
              <input
                type="number"
                id="minPrice"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter minimum price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="maxPrice"
                className="block text-xl font-semibold text-gray-700 mb-2"
              >
                Maximum Price (RS)
              </label>
              <input
                type="number"
                id="maxPrice"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter maximum price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 bg-black text-white font-bold rounded-lg transition-colors`}
            >
              {loading ? "Adding..." : "Add Extra Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExtraService;
