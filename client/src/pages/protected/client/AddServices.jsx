import React, { useState } from "react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { addServiceToTailor } from "../../../hooks/TailorHooks";
import { toast } from "react-toastify";

const AddServices = () => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!type || !description || !minPrice || !maxPrice || !image) {
      setMessage("All fields are required.");
      return;
    }

    const payload = {
      type,
      description,
      minPrice,
      maxPrice,
      //convert image to base64
      image: await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(image);
      }),
    };

    try {
      setLoading(true);
      const response = await addServiceToTailor(payload);
      if (response.success) {
        toast.success("Service added successfully!");
        setType("");
        setDescription("");
        setMinPrice("");
        setMaxPrice("");
        setImage(null);
        setMessage("");
      } else {
        toast.error("Failed to add service! please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to add service! please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Add Services</h1>

        {/* Selected Image Preview Section */}
        {image && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Selected Image</h2>
            <div className="relative w-48 h-48 border rounded-lg overflow-hidden shadow-sm mx-auto">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black text-white rounded-full p-1 hover:bg-gray-700 transition"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Service Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <label htmlFor="image" className="block text-lg font-semibold">
              Service Image
            </label>
            <div
              className={`w-full p-6 mt-2 border-2 border-dashed rounded-lg transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-100"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <CameraIcon className="w-10 h-10 mx-auto text-gray-400" />
              <input
                type="file"
                id="image"
                className="hidden"
                accept=".jpeg, .png, .mp4"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer block text-center mt-2"
              >
                <p className="text-gray-600">Drop your image here, or</p>
                <p className="text-blue-600 underline">browse</p>
                <p className="text-gray-500 text-sm">JPEG, PNG, MP4 allowed</p>
              </label>
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="type" className="block text-lg font-semibold">
              Service Type
            </label>
            <select
              id="type"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                Select a service type
              </option>
              <option value="Men's Tailoring">Men's Tailoring</option>
              <option value="Women's Tailoring">Women's Tailoring</option>
              <option value="Alterations & Repairs">
                Alterations & Repairs
              </option>
              <option value="Bespoke Suits">Bespoke Suits</option>
              <option value="Traditional Wear">Traditional Wear</option>
              <option value="Wedding Attire">Wedding Attire</option>
              <option value="Leather & Denim Repairs">
                Leather & Denim Repairs
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-semibold"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe the service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-lg font-semibold">
                Minimum Price ($)
              </label>
              <input
                type="number"
                id="minPrice"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-lg font-semibold">
                Maximum Price ($)
              </label>
              <input
                type="number"
                id="maxPrice"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter maximum price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-gray-900 text-white font-semibold rounded-md transition-colors ${
                loading ? "bg-blue-300" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
          {message && (
            <div className="mt-4 text-center text-red-600 font-medium">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddServices;
