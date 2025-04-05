import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ServiceSelector({ onServicesSelected }) {
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const tailorProfile = await axios.get("/tailor/get-profile", {
        withCredentials: true,
      });
      console.log("Tailor Profile:", tailorProfile.data);
      setServices(tailorProfile.data.shopDetails.serviceRates || []);
      setExtraServices(tailorProfile.data.shopDetails.extraServices || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed as this is just an API call

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleServiceToggle = useCallback((service, type = "regular") => {
    const serviceWithType = { ...service, type };
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s._id === service._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== service._id);
      }
      return [...prev, serviceWithType];
    });
  }, []);

  useEffect(() => {
    onServicesSelected(selectedServices);
  }, [selectedServices, onServicesSelected]);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading services: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Regular Services
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedServices.some((s) => s._id === service._id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-300"
              }`}
              onClick={() => handleServiceToggle(service, "regular")}
            >
              <p className="font-medium">{service.type}</p>
              <p className="text-sm text-gray-500">{service.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                PKR {service.minPrice} - {service.maxPrice}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Extra Services
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {extraServices.map((service) => (
            <div
              key={service._id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedServices.some((s) => s._id === service._id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-300"
              }`}
              onClick={() => handleServiceToggle(service, "extra")}
            >
              <p className="font-medium">{service.serviceName}</p>
              <p className="text-sm text-gray-500">{service.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                PKR {service.minPrice} - {service.maxPrice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
