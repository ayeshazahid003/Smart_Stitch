import React, { useState, useRef, useEffect } from "react";
import { CameraIcon, XMarkIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { createTailorProfile, getTailorShop } from "../../../hooks/TailorHooks";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";

const libraries = ["places", "marker"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Default center (Lahore coordinates)
const DEFAULT_CENTER = { lat: 31.5204, lng: 74.3587 };

export default function AddShopDetails() {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [bio, setBio] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placeInputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(currentLocation);
          setMarkerPosition(currentLocation);
          reverseGeocode(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your current location");
          // Fall back to default center
          setMapCenter(DEFAULT_CENTER);
          setMarkerPosition(DEFAULT_CENTER);
        }
      );
    }

    // Fetch existing tailor profile
    const fetchTailorProfile = async () => {
      try {
        setLoading(true);
        const response = await getTailorShop();
        if (response.success && response.shopDetails) {
          const details = response.shopDetails;
          setShopName(details.shopName || "");
          setPhoneNumber(details.phoneNumber || "");
          setBio(details.bio || "");
          if (details.shopLocation) {
            setAddress(details.shopLocation.address || "");
            if (details.shopLocation.coordinates) {
              const position = {
                lat: Number(details.shopLocation.coordinates.lat),
                lng: Number(details.shopLocation.coordinates.lng),
              };
              setMapCenter(position);
              setMarkerPosition(position);
            }
          }
          if (details.shopImages && details.shopImages.length > 0) {
            setImages(details.shopImages.filter((img) => img !== null));
          }
        }
      } catch (error) {
        console.error("Error fetching tailor profile:", error);
        toast.error("Failed to load shop details");
      } finally {
        setLoading(false);
      }
    };

    fetchTailorProfile();
  }, []);

  useEffect(() => {
    if (isLoaded && !loadError) {
      // Initialize map
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: mapCenter,
        zoom: 15,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
      });
      mapRef.current = map;

      // Create marker using standard Marker
      const marker = new window.google.maps.Marker({
        map,
        position: markerPosition || mapCenter,
        draggable: true,
      });
      markerRef.current = marker;

      // Initialize place autocomplete
      const placeInput = document.getElementById("place-input");
      const placeAutocomplete = new window.google.maps.places.Autocomplete(
        placeInput,
        {
          types: ["address"],
        }
      );

      // Handle place selection
      placeAutocomplete.addListener("place_changed", () => {
        const place = placeAutocomplete.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setMapCenter(location);
          setMarkerPosition(location);
          setAddress(place.formatted_address);
          map.setCenter(location);
          marker.setPosition(location);
        }
      });

      // Handle map clicks
      map.addListener("click", (e) => {
        const clickedLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setMarkerPosition(clickedLocation);
        marker.setPosition(clickedLocation);
        reverseGeocode(clickedLocation);
      });

      // Handle marker drag
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        const newPos = {
          lat: position.lat(),
          lng: position.lng(),
        };
        setMarkerPosition(newPos);
        reverseGeocode(newPos);
      });
    }
  }, [isLoaded, loadError, mapCenter]);

  const reverseGeocode = async (location) => {
    if (!isLoaded || loadError) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK") {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });
      setAddress(response.formatted_address);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      toast.error("Could not get address for selected location");
    }
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
    if (
      !shopName ||
      !phoneNumber ||
      !address ||
      !bio ||
      images.length === 0 ||
      !markerPosition
    ) {
      toast.error("All fields are required");
      return;
    }

    const shopLocation = {
      address,
      coordinates: {
        lat: Number(markerPosition.lat),
        lng: Number(markerPosition.lng),
      },
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("shopLocation", JSON.stringify(shopLocation));
      formData.append("bio", bio);

      // Handle images
      const shopImages = await Promise.all(
        images.map(async (image) => {
          if (typeof image === "string") return image;
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          });
        })
      );

      formData.append("shopImages", JSON.stringify(shopImages));

      const response = await createTailorProfile(formData);

      if (response.success) {
        toast.success("Shop details updated successfully");
      } else {
        toast.error(response.message || "Failed to update shop details");
      }
    } catch (error) {
      console.error("Error updating shop details:", error);
      toast.error("An error occurred while updating shop details");
    } finally {
      setLoading(false);
    }
  };

  if (loadError)
    return (
      <div className="text-center py-4 text-red-600">
        Error loading Google Maps
      </div>
    );
  if (!isLoaded)
    return <div className="text-center py-4">Loading Google Maps...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Shop Details
        </h1>

        <div className="mb-8">
          <div className="relative">
            <div id="map" style={mapContainerStyle}></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md">
              <div className="relative">
                <input
                  id="place-input"
                  type="text"
                  className="w-full p-3 pl-10 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search location or click on map"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  ref={placeInputRef}
                />
                <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
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
          <input type="hidden" value={markerPosition?.lat} name="latitude" />
          <input type="hidden" value={markerPosition?.lng} name="longitude" />

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
                {images.map((image, index) => {
                  if (!image) return null;
                  return (
                    <div key={index} className="relative">
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
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
                  );
                })}
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
