import React, { useState, useEffect, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function LocationPicker({ initialLocation, onSave }) {
  console.log("initialLocation", initialLocation);
  const [location, setLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const serviceRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initMap();
    };
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  // Add this useEffect to properly handle initialLocation updates
  useEffect(() => {
    if (
      mapLoaded &&
      initialLocation &&
      mapInstanceRef.current &&
      markerRef.current
    ) {
      const position = {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
      };

      // Update the map center and marker position
      mapInstanceRef.current.setCenter(position);
      markerRef.current.setPosition(position);

      // Make sure the location state is set
      setLocation(initialLocation);
      setAddress(initialLocation.address || "");
    }
  }, [initialLocation, mapLoaded]);

  const initMap = () => {
    // Default to Lahore if no initialLocation
    const defaultPos = { lat: 31.5204, lng: 74.3587 };

    // Use initialLocation if available
    const start = initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultPos;

    const map = new window.google.maps.Map(mapRef.current, {
      center: start,
      zoom: 14,
    });
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: start,
      map,
      draggable: true,
      title: "Shop Location",
    });
    markerRef.current = marker;

    serviceRef.current = new window.google.maps.places.AutocompleteService();

    marker.addListener("dragend", async () => {
      const pos = marker.getPosition();
      const lat = pos.lat();
      const lng = pos.lng();
      updateLocationAndAddress(lat, lng);
    });
  };

  const updateLocationAndAddress = async (lat, lng) => {
    setLocation({ latitude: lat, longitude: lng });
    const geocoder = new window.google.maps.Geocoder();
    try {
      const res = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0])
            resolve(results[0].formatted_address);
          else reject();
        });
      });
      setAddress(res);
    } catch {
      setAddress("Unknown address");
    }
  };

  const handleInputChange = (query) => {
    setAddress(query);
    if (!query) {
      setSuggestions([]);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input: query },
      (preds, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(preds);
        }
      }
    );
  };

  const handleSelect = async (prediction) => {
    const placesService = new window.google.maps.places.PlacesService(
      mapInstanceRef.current
    );
    placesService.getDetails(
      { placeId: prediction.place_id },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place.geometry
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          mapInstanceRef.current.setCenter(place.geometry.location);
          mapInstanceRef.current.setZoom(16);
          markerRef.current.setPosition(place.geometry.location);
          updateLocationAndAddress(lat, lng);
          setSuggestions([]);
        }
      }
    );
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      mapInstanceRef.current.setCenter({ lat, lng });
      markerRef.current.setPosition({ lat, lng });
      updateLocationAndAddress(lat, lng);
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <Combobox as="div" value={address} onChange={handleSelect}>
        <div className="relative">
          <Combobox.Input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a location"
            onChange={(e) => handleInputChange(e.target.value)}
            displayValue={(val) => val}
            value={address}
          />
          <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>
        {suggestions.length > 0 && (
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="border border-gray-300 mt-1 rounded-md max-h-60 overflow-auto bg-white">
              {suggestions.map((s) => (
                <Combobox.Option
                  key={s.place_id}
                  value={s}
                  className={({ active }) =>
                    `cursor-pointer select-none p-2 ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  {s.description}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        )}
      </Combobox>

      <button
        type="button"
        onClick={handleUseCurrent}
        className="mt-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
      >
        Use Current Location
      </button>

      <div ref={mapRef} className="w-full h-64 mt-4 rounded-md" />

      {location && (
        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          onSave({
            latitude: location.latitude,
            longitude: location.longitude,
            address,
          })
        }
        disabled={!location}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
      >
        Save Location
      </button>
    </div>
  );
}
