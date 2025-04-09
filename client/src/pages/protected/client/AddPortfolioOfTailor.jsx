import React, { useState } from "react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { addPortfolioEntry } from "../../../hooks/TailorHooks";

export default function AddPortfolioOfTailor() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle file selection for multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !date || images.length === 0) {
      toast.error("Portfolio name, date, and at least one image are required.");
      return;
    }

    setLoading(true);
    const payload = {
      name,
      description,
      date,
      images: await Promise.all(
        images.map(async (img) => {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          return new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
          });
        })
      ),
    };

    try {
      const response = await addPortfolioEntry(payload);
      if (response.success) {
        toast.success("Portfolio entry added successfully");
        setName("");
        setDescription("");
        setDate(null);
        setImages([]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to add portfolio entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Add Portfolio Entry
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section on Top */}
          <p>This is where you post your previous works</p>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Portfolio Images
            </label>
            <div
              className={`w-full p-4 mt-2 border-2 border-dashed rounded-lg transition-colors ${
                dragActive
                  ? "border-gray-700 bg-gray-100"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <CameraIcon className="w-10 h-10 text-gray-500" />
                <input
                  type="file"
                  id="images"
                  className="hidden"
                  multiple
                  accept=".jpeg, .png, .mp4"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer block text-center mt-2"
                >
                  <p className="text-gray-700">Drop your images here, or</p>
                  <p className="text-blue-600 underline">browse</p>
                  <p className="text-gray-600 text-sm">
                    JPEG, PNG, MP4 allowed
                  </p>
                </label>
              </div>
            </div>
            {/* Selected Images Preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-full h-24 border rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-gray-900 text-white rounded-full p-1 hover:bg-gray-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Portfolio Name Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">
              Portfolio Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter portfolio name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Description Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows="3"
              placeholder="Enter portfolio description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">
              Portfolio Date
            </label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholderText="Select a date"
              maxDate={new Date()}
            />
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-gray-900 text-white font-bold rounded-lg transition-colors ${
                loading ? "bg-gray-500" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Adding..." : "Add Portfolio Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
