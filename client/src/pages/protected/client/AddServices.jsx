import React, { useState } from "react";
import axios from "axios";

const AddServices = () => {
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!serviceType || !description || !price || !image) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("type", serviceType);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post("/tailor/add-service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setServiceType("");
      setDescription("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Error adding the service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add Services</h1>
      
      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="serviceType" className="block text-lg font-semibold">Service Type</label>
          <input
            type="text"
            id="serviceType"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="Enter the type of service"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-semibold">Description</label>
          <textarea
            id="description"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the service"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-lg font-semibold">Price ($)</label>
          <input
            type="number"
            id="price"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price of the service"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-semibold">Service Image</label>
          <input
            type="file"
            id="image"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full p-3 bg-gray-900  text-white font-semibold rounded-md ${loading ? "bg-blue-300" : ""}`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServices;
