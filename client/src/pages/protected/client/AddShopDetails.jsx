import React, { useState } from 'react';
import axios from 'axios';

const AddShopDetails = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [bio, setBio] = useState('');
  const [shopImages, setShopImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!shopName || !address || !coordinates || !bio || shopImages.length === 0) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append('shopName', shopName);
    formData.append('address', address);
    formData.append('coordinates', coordinates);
    formData.append('bio', bio);

    // Append images to form data
    shopImages.forEach((image) => {
      formData.append('shopImages', image);
    });

    try {
      const response = await axios.post('/api/tailor/add-shop-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setShopName('');
        setAddress('');
        setCoordinates('');
        setBio('');
        setShopImages([]);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setShopImages([...e.target.files]);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Shop Details</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="shopName" className="block text-gray-700 font-semibold">Shop Name</label>
          <input
            type="text"
            id="shopName"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter shop name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-semibold">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter shop address"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="coordinates" className="block text-gray-700 font-semibold">Coordinates (Longitude, Latitude)</label>
          <input
            type="text"
            id="coordinates"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter coordinates as 'longitude, latitude'"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 font-semibold">Biography</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter your shop biography"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shopImages" className="block text-gray-700 font-semibold">Shop Images</label>
          <input
            type="file"
            id="shopImages"
            multiple
            onChange={handleFileChange}
            className="w-full mt-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Shop Details
        </button>
      </form>
    </div>
  );
};

export default AddShopDetails;
