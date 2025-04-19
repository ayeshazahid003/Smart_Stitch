import React, { useState, useEffect } from "react";
import LocationPicker from "../tailor/LocationPage";
import { createTailorProfile, getTailorShop } from "../../../hooks/TailorHooks";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddShopDetails() {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [bio, setBio] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getTailorShop();
      if (res.success && res.shopDetails) {
        const d = res.shopDetails;
        setShopName(d.shopName || "");
        setPhoneNumber(d.phoneNumber || "");
        setBio(d.bio || "");
        if (d.shopLocation) {
          setAddress(d.shopLocation.address || "");
          if (d.shopLocation.coordinates) {
            setMarkerPosition({
              latitude: Number(d.shopLocation.coordinates.lat),
              longitude: Number(d.shopLocation.coordinates.lng),
            });
          }
        }
        if (d.shopImages) setImages(d.shopImages.filter(Boolean));
      }

      setLoading(false);
    })();
  }, []);

  const handleLocationSave = (loc) => {
    setMarkerPosition({ latitude: loc.latitude, longitude: loc.longitude });
    setAddress(loc.address);
  };

  const handleImageChange = (e) =>
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  const removeImage = (i) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  // Helper function to convert File to base64
  const fileToBase64 = async (file) => {
    if (typeof file === "string") return file; // Already a URL or base64

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Helper function to upload a single image
  const uploadImage = async (base64Image) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/uploadimage",
        {
          file: base64Image,
          folder: "Home",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !shopName ||
      !phoneNumber ||
      !address ||
      !bio ||
      !markerPosition ||
      images.length === 0
    ) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      // Step 1: Upload all images first
      const imageUploadPromises = [];
      for (const img of images) {
        const base64Image = await fileToBase64(img);
        imageUploadPromises.push(uploadImage(base64Image));
      }

      // Wait for all images to upload and get their URLs
      const shopImageUrls = await Promise.all(imageUploadPromises);
      console.log("Uploaded image URLs:", shopImageUrls);

      // Step 2: Create shop profile with the image URLs
      const shopLocation = {
        address,
        coordinates: {
          lat: markerPosition.latitude,
          lng: markerPosition.longitude,
        },
      };

      console.log("Shop location:", shopLocation);

      // Create JSON payload
      const shopData = {
        shopName,
        phoneNumber,
        bio,
        shopLocation,
        shopImages: shopImageUrls,
      };

      // Make API request with JSON data
      const response = await createTailorProfile(shopData);

      if (response.success) toast.success("Shop details updated");
      else toast.error(response.message || "Update failed");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload images or update shop details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Shop Details
        </h2>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Shop Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter shop name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter shop description"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Location
          </label>
          <LocationPicker
            initialLocation={
              markerPosition && {
                latitude: markerPosition.latitude,
                longitude: markerPosition.longitude,
                address,
              }
            }
            onSave={handleLocationSave}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Shop Images
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer bg-gray-100 p-4 rounded-md hover:bg-gray-200">
              <CameraIcon className="w-6 h-6 text-gray-600" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`preview-${idx}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Shop"}
        </button>
      </div>
    </div>
  );
}
