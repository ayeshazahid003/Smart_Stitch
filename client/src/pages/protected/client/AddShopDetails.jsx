import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { createTailorProfile, getTailorShop } from "../../../hooks/TailorHooks";
import { GoogleMap, useLoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { toast } from "react-toastify";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};
const initialCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function AddShopDetails() {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [bio, setBio] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDBCi7hOX_2lQ14oISSLHXp0JS36OANFyQ",
    libraries,
  });

  // Fetch existing tailor shop details (if any) and prefill fields
  useEffect(() => {
    const fetchTailorProfile = async () => {
      setLoading(true);
      const response = await getTailorShop();
      if (response.success && response.shopDetails) {
        const details = response.shopDetails;
        setShopName(details.shopName || "");
        setPhoneNumber(details.phoneNumber || "");
        if (details.shopLocation) {
          setAddress(details.shopLocation.address || "");
          if (
            details.shopLocation.coordinates &&
            details.shopLocation.coordinates.length >= 2
          ) {
            setLatitude(details.shopLocation.coordinates[0]);
            setLongitude(details.shopLocation.coordinates[1]);
            setMapCenter({
              lat: details.shopLocation.coordinates[0],
              lng: details.shopLocation.coordinates[1],
            });
          }
        }
        setBio(details.bio || "");
        if (details.shopImages && details.shopImages.length > 0) {
          // Set images to the URL array (existing images)
          setImages(details.shopImages);
        }
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };

    fetchTailorProfile();
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setAddress(place.formatted_address);
        setLatitude(lat);
        setLongitude(lng);
        setMapCenter({ lat, lng });
      }
    }
  };

  const onMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setLatitude(newLat);
    setLongitude(newLng);
    setMapCenter({ lat: newLat, lng: newLng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: newLat, lng: newLng } },
      (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        }
      }
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Append new files to existing images array.
    // Note: Existing images may be URL strings.
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
    if (!shopName || !phoneNumber || !address || !bio || images.length === 0) {
      setMessage("All fields are required.");
      return;
    }

    const shopLocation = {
      address,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    // Convert each image to base64 only if it's a File; if it's already a URL, keep it as-is.
    const shopImages = await Promise.all(
      images.map(async (image) => {
        if (typeof image === "string") {
          return image;
        } else {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        }
      })
    );

    const payload = {
      shopName,
      phoneNumber,
      shopLocation,
      bio,
      shopImages,
    };

    console.log(payload);

    try {
      setMessage("");
      setLoading(true);
      const response = await createTailorProfile(payload);
      setLoading(false);
      if (response.success) {
        setMessage("Shop added successfully");
        toast.success("Shop added successfully");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("Failed to add shop");
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Add Shop Details
        </h1>

        <div className="mb-8">
          <div className="relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={mapCenter}
              options={{ disableDefaultUI: true }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              {latitude && longitude && (
                <Marker
                  position={{
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  }}
                  draggable
                  onDragEnd={onMarkerDragEnd}
                />
              )}
            </GoogleMap>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md">
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search location"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Autocomplete>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Selected Address
            </label>
            <input
              type="text"
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Address selected from map"
              value={address}
            />
          </div>
          <input type="hidden" value={latitude} name="latitude" />
          <input type="hidden" value={longitude} name="longitude" />

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Shop Images
            </label>
            <div
              className={`w-full p-6 border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-100"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <CameraIcon className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">
                Drop your images or video here, or
              </p>
              <label className="cursor-pointer text-blue-600 underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".jpeg, .png, .mp4"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-gray-500 text-sm mt-1">
                JPEG, PNG, MP4 allowed
              </p>
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={typeof image === "string" ? image : URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
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
              disabled={loading}
              className={`w-full md:w-1/3 p-3 font-semibold rounded-md transition-colors ${
                loading ? "bg-blue-300" : "bg-gray-900 hover:bg-gray-800"
              } text-white`}
            >
              {loading ? "Adding..." : "Add Shop"}
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
}

