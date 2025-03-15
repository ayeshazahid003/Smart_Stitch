import React, { useState, useRef } from "react";
import axios from "axios";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { GoogleMap, useLoadScript, Autocomplete } from "@react-google-maps/api";

// Google Maps configuration
const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};
const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

const AddShopDetails = () => {
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Google Maps Autocomplete ref
  const autocompleteRef = useRef(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDBCi7hOX_2lQ14oISSLHXp0JS36OANFyQ", // Replace with your API key
    libraries,
  });

  // Handle place selection from Autocomplete
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setAddress(place.formatted_address);
        setLatitude(place.geometry.location.lat());
        setLongitude(place.geometry.location.lng());
      }
    }
  };

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

    // Validate required fields
    if (!shopName || !address || !contact || images.length === 0) {
      setMessage("All fields are required.");
      return;
    }

    // Prepare shop location object
    const shopLocation = {
      address,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    setLoading(true);
    const formData = new FormData();
    formData.append("shopName", shopName);
    formData.append("shopLocation", JSON.stringify(shopLocation));
    formData.append("contact", contact);
    images.forEach((image) => formData.append("shopImages", image));

    try {
      const response = await axios.post("/tailor/add-shop", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setShopName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setContact("");
      setImages([]);
    } catch (error) {
      console.error("Error adding shop details:", error);
      setMessage("Error adding the shop details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add Shop Details</h1>

      {message && <p className="text-center text-red-500">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        {/* Shop Name */}
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

        {/* Address with Google Maps Autocomplete */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Shop Address</label>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter shop address"
            />
          </Autocomplete>
        </div>

        {/* Latitude and Longitude (auto-filled by Google Maps) */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Latitude</label>
          <input
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={latitude}
            readOnly
            placeholder="Latitude will auto-fill"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold">Longitude</label>
          <input
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded"
            value={longitude}
            readOnly
            placeholder="Longitude will auto-fill"
          />
        </div>

        {/* Contact Number */}
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

        {/* Shop Images */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Shop Images</label>
          <div
            className={`w-full p-6 mt-2 border-2 border-dashed rounded-lg ${
              dragActive ? "border-blue-500" : "border-gray-300"
            }`}
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

          {/* Preview selected images */}
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

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full p-3 bg-gray-900 text-white font-semibold rounded-md ${
              loading ? "bg-blue-300" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Shop"}
          </button>
        </div>
      </form>

      {/* Google Map Display (Optional) */}
      <div className="mt-6">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
        />
      </div>
    </div>
  );
};

export default AddShopDetails;