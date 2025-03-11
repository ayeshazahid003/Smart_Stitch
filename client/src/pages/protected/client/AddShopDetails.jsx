import React, { useState } from "react";
import axios from "axios";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";

const AddShopDetails = () => {
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
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
    if (!shopName || !location || !contact || images.length === 0) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("shopName", shopName);
    formData.append("location", location);
    formData.append("contact", contact);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("/tailor/add-shop", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setShopName("");
      setLocation("");
      setContact("");
      setImages([]);
    } catch (error) {
      console.error("Error adding shop details:", error);
      setMessage("Error adding the shop details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add Shop Details</h1>

      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-lg font-semibold">Shop Name</label>
          <input
            type="text"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter shop name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Location</label>
          <input
            type="text"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter shop location"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Contact Number</label>
          <input
            type="text"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter contact number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Shop Images</label>
          <div
  className={`w-full p-6 mt-2 border-2 border-dashed rounded-lg ${dragActive ? "border-blue-500" : "border-gray-300"}`}
  onDragEnter={handleDrag}
  onDragOver={handleDrag}
  onDragLeave={handleDrag}
  onDrop={handleDrop}
>
  <CameraIcon className="w-8 h-8 mx-auto text-gray-400" />
  <label className="cursor-pointer text-center block">
    <p className="text-gray-600">Drop your images and video here, or</p>
    <p className="text-blue-600 underline">browse</p>
    <p className="text-gray-500 text-sm">jpeg, .png, .mp4 are allowed</p>
    <input
      type="file"
      className="hidden"
      multiple
      accept=".jpeg, .png, .mp4"
      onChange={handleImageChange}
    />
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
            {loading ? "Adding..." : "Add Shop"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShopDetails;
