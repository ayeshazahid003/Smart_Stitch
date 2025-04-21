import React, { useEffect, useState, useRef } from "react";
import { getUserProfile, updateUserProfile } from "../../../hooks/userHooks";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

export default function UserProfile() {
  /* --------------------------------------------------------------------- */
  /* Google Places API config --------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBxlCPMKTJnAEuy43rjvfhkZ8twF0Wumdo",
    libraries,
  });

  /* --------------------------------------------------------------------- */
  /* Refs ----------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const autocompleteRef = useRef(null);

  /* --------------------------------------------------------------------- */
  /* Default shape -------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
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

  /* --------------------------------------------------------------------- */
  /* State ---------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [searchAddress, setSearchAddress] = useState("");

  /* --------------------------------------------------------------------- */
  /* Validators ----------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const phoneRegex = /^\+92\d{10}$/; // +92 followed by 10 digits
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const validateInputs = () => {
    if (!user.name.trim()) {
      setMessage("Name is required.");
      return false;
    }
    if (!emailRegex.test(user.email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(user.contactInfo.phone)) {
      setMessage("Phone must start with +92 and contain 10 digits after it.");
      return false;
    }
    if (!user.contactInfo.address.line1.trim()) {
      setMessage("Address Line 1 is required (select from search field).");
      return false;
    }
    setMessage("");
    return true;
  };

  /* --------------------------------------------------------------------- */
  /* Autocomplete handler ------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const formatted = place.formatted_address || "";
        let city = "",
          state = "",
          postalCode = "",
          country = "";

        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes("locality")) city = component.long_name;
            if (types.includes("administrative_area_level_1"))
              state = component.long_name;
            if (types.includes("postal_code")) postalCode = component.long_name;
            if (types.includes("country")) country = component.long_name;
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

  /* --------------------------------------------------------------------- */
  /* Fetch profile -------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getUserProfile();
      if (res.success) {
        const fetched = res.user || {};
        const merged = {
          ...defaultUser,
          ...fetched,
          contactInfo: {
            ...defaultUser.contactInfo,
            ...fetched.contactInfo,
            address: {
              ...defaultUser.contactInfo.address,
              ...fetched.contactInfo?.address,
            },
          },
        };
        setUser(merged);
        setProfilePreview(merged.profilePicture);
      } else {
        setMessage(res.message);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------------------------------------- */
  /* Change handlers ------------------------------------------------------ */
  /* --------------------------------------------------------------------- */
  const handleChange = ({ target: { name, value } }) =>
    setUser((p) => ({ ...p, [name]: value }));

  const handleContactInfoChange = ({ target: { name, value } }) =>
    setUser((p) => ({
      ...p,
      contactInfo: { ...p.contactInfo, [name]: value },
    }));

  const handleAddressChange = ({ target: { name, value } }) =>
    setUser((p) => ({
      ...p,
      contactInfo: {
        ...p.contactInfo,
        address: { ...p.contactInfo.address, [name]: value },
      },
    }));

  const handlePhoneChange = ({ target: { value } }) => {
    // Allow only digits and a single leading '+', truncate to +92 plus 10 digits
    let cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      cleaned = "+" + cleaned.slice(1).replace(/\+/g, "");
    } else if (cleaned.length) {
      cleaned = "+".concat(cleaned.replace(/\+/g, ""));
    }
    if (cleaned.length > 13) cleaned = cleaned.slice(0, 13); // +92xxxxxxxxxx
    setUser((p) => ({
      ...p,
      contactInfo: { ...p.contactInfo, phone: cleaned },
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /* --------------------------------------------------------------------- */
  /* Submit --------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateInputs()) return;

    setLoading(true);
    let updated = { ...user };
    if (profileFile) updated.profilePicture = profilePreview;

    const res = await updateUserProfile(updated);
    if (res.success) {
      setSuccessMessage("Profile updated successfully!");
      const fetched = res.user || {};
      const merged = {
        ...defaultUser,
        ...fetched,
        contactInfo: {
          ...defaultUser.contactInfo,
          ...fetched.contactInfo,
          address: {
            ...defaultUser.contactInfo.address,
            ...fetched.contactInfo?.address,
          },
        },
      };
      setUser(merged);
      setProfilePreview(merged.profilePicture);
    } else setMessage(res.message);
    setLoading(false);
  };

  /* --------------------------------------------------------------------- */
  /* Render --------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  if (loadError)
    return <div className="p-4 text-center">Error loading Google Maps</div>;
  if (!isLoaded)
    return <div className="p-4 text-center">Loading address search…</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      {/* Top Section ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
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
                <span className="text-gray-600 text-sm">No Image</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name || "User Name"}</h2>
            <p className="text-gray-500">{user.email || "Email"}</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="block w-full text-sm"
          />
        </div>
      </div>

      {/* Messages ------------------------------------------------------- */}
      {message && <p className="text-red-500 mb-4 text-center">{message}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4 text-center">{successMessage}</p>
      )}

      {/* Form ----------------------------------------------------------- */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              required
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Role */}
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

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              required
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={user.contactInfo.phone}
              required
              onChange={handlePhoneChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              pattern="\+92[0-9]{10}"
              title="Phone number must start with +92 followed by 10 digits"
              inputMode="tel"
              placeholder="+923XXXXXXXXX"
            />
          </div>

          {/* Google Places Search */}
          <div className="mb-4 md:col-span-2">
            <label className="block font-semibold mb-1">Search Address</label>
            <Autocomplete
              onLoad={(a) => (autocompleteRef.current = a)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Type to search address"
              />
            </Autocomplete>
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block font-semibold mb-1">Address Line 2</label>
            <input
              type="text"
              name="line2"
              value={user.contactInfo.address.line2}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Apartment, suite, unit, etc."
            />
          </div>

          {/* City */}
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

          {/* State */}
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

          {/* Postal Code */}
          <div>
            <label className="block font-semibold mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              pattern="[0-9]{5}"
              title="5‑digit postal code"
              value={user.contactInfo.address.postalCode}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Postal Code"
            />
          </div>

          {/* Country */}
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

        {/* Submit -------------------------------------------------------- */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
