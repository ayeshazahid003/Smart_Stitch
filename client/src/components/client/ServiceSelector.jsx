import { useState, useEffect } from "react";
import axios from "axios";

export default function ServiceSelector({ onServicesSelected }) {
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const tailorProfile = await axios.get("/tailor/get-profile", {
        withCredentials: true,
      });
      setServices(tailorProfile.data.profile.serviceRates || []);
      setExtraServices(tailorProfile.data.profile.extraServices || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load services:", error);
      setLoading(false);
    }
  };

  const handleServiceToggle = (service, type = "regular") => {
    const serviceWithType = { ...service, type };
    const isSelected = selectedServices.some((s) => s._id === service._id);

    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((s) => s._id !== service._id)
      );
    } else {
      setSelectedServices([...selectedServices, serviceWithType]);
    }
  };

  useEffect(() => {
    onServicesSelected(selectedServices);
  }, [selectedServices, onServicesSelected]);

  if (loading) {
    return <div>Loading services...</div>;
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
