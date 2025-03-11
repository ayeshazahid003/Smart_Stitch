import React, { useState } from "react";
import axios from "axios";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";

const AddExtraService = () => {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
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
    const files = Array.from(e.dataTransfer.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !description || !price || images.length === 0) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("serviceName", serviceName);
    formData.append("description", description);
    formData.append("price", price);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("/tailor/add-extra-service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setServiceName("");
      setDescription("");
      setPrice("");
      setImages([]);
    } catch (error) {
      console.error("Error adding extra service:", error);
      setMessage("Error adding the extra service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add Extra Service</h1>
      {message && <p className="text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-lg font-semibold">Service Name</label>
          <input
            type="text"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Enter the extra service name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Description</label>
          <textarea
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the extra service"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Price ($)</label>
          <input
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Extra Service Images</label>
          <div
            className={`w-full p-6 mt-2 border-2 border-dashed rounded-lg ${dragActive ? "border-blue-500" : "border-gray-300"}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <CameraIcon className="w-8 h-8 mx-auto text-gray-400" />
            <input
              type="file"
              id="image"
              className="hidden"
              multiple
              accept=".jpeg, .png, .mp4"
              onChange={handleImageChange}
            />
            <label htmlFor="image" className="cursor-pointer text-center">
              <p className="text-gray-600">Drop images here, or</p>
              <p className="text-blue-600 underline">browse</p>
              <p className="text-gray-500 text-sm">jpeg, png, mp4 are allowed</p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-black text-white rounded-full p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full p-3 bg-gray-900 text-white font-semibold rounded-md ${loading ? "bg-blue-300" : ""}`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Extra Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExtraService;
