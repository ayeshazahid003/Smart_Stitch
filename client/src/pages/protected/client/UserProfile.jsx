import React, { useEffect, useState, useRef } from "react";
import { getUserProfile, updateUserProfile } from "../../../hooks/userHooks";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

export default function UserProfile() {
  // Google Places API config
  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDBCi7hOX_2lQ14oISSLHXp0JS36OANFyQ", // <-- Replace with your key
    libraries,
  });

  // Reference for the autocomplete instance
  const autocompleteRef = useRef(null);

  // Default user shape (prevents "undefined" errors for nested fields)
  const defaultUser = {
    name: "",
    email: "",
    role: "",
    profilePicture: "",
    contactInfo: {
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
  };

  // Local state
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // For profile picture preview
  const [profilePreview, setProfilePreview] = useState(user.profilePicture);
  const [profileFile, setProfileFile] = useState(null);

  // We'll keep a local "searchAddress" for the autocomplete field
  const [searchAddress, setSearchAddress] = useState("");

  // Called when a place is selected from the autocomplete dropdown.
  // It extracts and fills the formatted address, city, state, postal code, and country fields.
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const formatted = place.formatted_address || "";

        // Initialize local variables
        let city = "";
        let state = "";
        let postalCode = "";
        let country = "";

        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              state = component.long_name;
            }
            if (types.includes("postal_code")) {
              postalCode = component.long_name;
            }
            if (types.includes("country")) {
              country = component.long_name; // or component.short_name for country code
            }
          }
        }

        setSearchAddress(formatted);

        setUser((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            address: {
              ...prev.contactInfo.address,
              line1: formatted,
              city,
              state,
              postalCode,
              country,
            },
          },
        }));
      }
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      const response = await getUserProfile();
      if (response.success) {
        const fetchedUser = response.user || {};
        // Merge with defaults to ensure nested objects exist
        const mergedUser = {
          ...defaultUser,
          ...fetchedUser,
          contactInfo: {
            ...defaultUser.contactInfo,
            ...fetchedUser.contactInfo,
            address: {
              ...defaultUser.contactInfo.address,
              ...fetchedUser.contactInfo?.address,
            },
          },
        };
        setUser(mergedUser);
        setProfilePreview(mergedUser.profilePicture);
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };
    fetchUserProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update top-level fields (name, email, role if allowed, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update contactInfo fields (phone, etc.)
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value,
      },
    }));
  };

  // Update address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: {
          ...prev.contactInfo.address,
          [name]: value,
        },
      },
    }));
  };

  // Profile picture file input handler updated to use FileReader's onload event.
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccessMessage("");

    // If user selected a new profile picture, embed its base64 in user data
    let updatedUser = { ...user };
    if (profileFile) {
      updatedUser.profilePicture = profilePreview;
    }

    const response = await updateUserProfile(updatedUser);
    if (response.success) {
      setSuccessMessage("Profile updated successfully!");
      // Merge again in case server changed anything
      const fetchedUser = response.user || {};
      const mergedUser = {
        ...defaultUser,
        ...fetchedUser,
        contactInfo: {
          ...defaultUser.contactInfo,
          ...fetchedUser.contactInfo,
          address: {
            ...defaultUser.contactInfo.address,
            ...fetchedUser.contactInfo?.address,
          },
        },
      };
      setUser(mergedUser);
      setProfilePreview(mergedUser.profilePicture);
    } else {
      setMessage(response.message);
    }
    setLoading(false);
  };

  if (loadError)
    return <div className="p-4 text-center">Error loading Google Maps</div>;
  if (!isLoaded)
    return <div className="p-4 text-center">Loading address search...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      {/* Top Section: Profile Picture + Basic Info */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        {/* Left: Picture, Name, Email */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border">
                <span className="text-gray-600 text-sm">No Image</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name || "User Name"}</h2>
            <p className="text-gray-500">{user.email || "Email"}</p>
          </div>
        </div>

        {/* Right: Upload New Profile Picture */}
        <div className="mt-4 md:mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="block w-full text-sm"
          />
        </div>
      </div>

      {/* Messages */}
      {message && <p className="text-red-500 mb-4 text-center">{message}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4 text-center">{successMessage}</p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Role (editable only if user.role === "customer") */}
          <div>
            <label className="block font-semibold mb-1">Role</label>
            {user.role === "customer" ? (
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="customer">Customer</option>
                <option value="tailor">Tailor</option>
              </select>
            ) : (
              <input
                type="text"
                name="role"
                value={user.role}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.contactInfo.phone}
              onChange={handleContactInfoChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Google Places Search Field */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Search Address</label>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Type to search address"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
            </Autocomplete>
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block font-semibold mb-1">Address Line 2</label>
            <input
              type="text"
              name="line2"
              value={user.contactInfo.address.line2}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Apartment, suite, unit, etc."
            />
          </div>

          {/* City */}
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              name="city"
              value={user.contactInfo.address.city}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="City"
            />
          </div>

          {/* State */}
          <div>
            <label className="block font-semibold mb-1">State/Province</label>
            <input
              type="text"
              name="state"
              value={user.contactInfo.address.state}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="State/Province"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block font-semibold mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={user.contactInfo.address.postalCode}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="ZIP/Postal Code"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={user.contactInfo.address.country}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Country"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
