import React, { useState } from 'react';
import axios from 'axios';

const AddExtraService = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName || !description || !price || !image) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append('serviceName', serviceName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/tailor/add-extra-service', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setServiceName('');
        setDescription('');
        setPrice('');
        setImage(null);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Extra Service</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="serviceName" className="block text-gray-700 font-semibold">Service Name</label>
          <input
            type="text"
            id="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter service name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter service description"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-semibold">Price ($)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter price"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-semibold">Service Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mt-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Service
        </button>
      </form>
    </div>
  );
};

export default AddExtraService;
