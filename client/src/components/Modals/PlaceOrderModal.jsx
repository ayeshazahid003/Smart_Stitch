import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Minus, Calendar } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router";
import { useCreateOffer } from "../../hooks/orderHooks";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

const PlaceOrderModal = ({
  isOpen,
  onClose,
  tailorName,
  tailorId,
  services: passedServices,
}) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedExtraServices, setSelectedExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customOfferAmount, setCustomOfferAmount] = useState("");
  const [requiredDate, setRequiredDate] = useState("");

  const { user } = useUser();
  const navigate = useNavigate();
  const { createOffer } = useCreateOffer();

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Fetch tailor services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        if (passedServices) {
          setServices(passedServices);
          const extraServicesRes = await axios.get(
            `/tailor/extra-services/${tailorId}`
          );
          setExtraServices(extraServicesRes.data.extraServices || []);
        } else {
          const [servicesRes, extraServicesRes] = await Promise.all([
            axios.get(`/tailor/services/${tailorId}`),
            axios.get(`/tailor/extra-services/${tailorId}`),
          ]);
          setServices(servicesRes.data.services || []);
          setExtraServices(extraServicesRes.data.extraServices || []);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load tailor services");
      } finally {
        setLoading(false);
      }
    };

    if (tailorId && isOpen) {
      fetchServices();
    }
  }, [tailorId, isOpen, passedServices]);

  const calculateDiscountedPrice = (service) => {
    if (!service.discount) return service.minPrice;

    const { type, value } = service.discount;
    if (type === "percentage") {
      return service.minPrice - service.minPrice * (value / 100);
    } else if (type === "fixed") {
      return service.minPrice - value;
    }
    return service.minPrice;
  };

  const handleServiceSelection = (service, isExtra = false) => {
    const servicesList = isExtra ? selectedExtraServices : selectedServices;
    const setServicesList = isExtra
      ? setSelectedExtraServices
      : setSelectedServices;

    const existingService = servicesList.find(
      (s) => s.serviceId === service._id
    );

    if (existingService) {
      setServicesList(servicesList.filter((s) => s.serviceId !== service._id));
    } else {
      // Always use original price for the offer
      setServicesList([
        ...servicesList,
        {
          serviceId: service._id,
          serviceName: isExtra ? service.serviceName : service.type,
          quantity: 1,
          price: service.minPrice, // Use original price
        },
      ]);

      // Update custom offer amount when services are selected/deselected
      if (!isExtra) {
        const updatedServices = [
          ...selectedServices,
          {
            serviceId: service._id,
            serviceName: service.type,
            quantity: 1,
            price: service.minPrice, // Use original price
          },
        ];
        const totalAmount = calculateServicesTotal(updatedServices);
        setCustomOfferAmount(totalAmount.toString());
      }
    }
  };

  const updateQuantity = (serviceId, increment, isExtra = false) => {
    const servicesList = isExtra ? selectedExtraServices : selectedServices;
    const setServicesList = isExtra
      ? setSelectedExtraServices
      : setSelectedServices;

    const updatedServices = servicesList.map((service) => {
      if (service.serviceId === serviceId) {
        const newQuantity = service.quantity + (increment ? 1 : -1);
        if (newQuantity < 1) return service;
        return {
          ...service,
          quantity: newQuantity,
          price: service.originalPrice, // For extra services, keep original price
        };
      }
      return service;
    });

    setServicesList(updatedServices);

    // Update custom offer amount when quantities change for main services
    if (!isExtra) {
      const totalOriginalAmount = calculateServicesTotal(updatedServices);
      setCustomOfferAmount(totalOriginalAmount.toString());
    }
  };

  const calculateServicesTotal = (services) => {
    return services.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );
  };

  const calculateExtraServicesTotal = () => {
    return selectedExtraServices.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );
  };

  const calculateTotalAmount = () => {
    const customAmount =
      Number(customOfferAmount) || calculateServicesTotal(selectedServices);
    return customAmount + calculateExtraServicesTotal();
  };

  const calculateTotalItems = () => {
    const servicesCount = selectedServices.reduce(
      (sum, service) => sum + service.quantity,
      0
    );
    const extraServicesCount = selectedExtraServices.reduce(
      (sum, service) => sum + service.quantity,
      0
    );
    return servicesCount + extraServicesCount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (selectedServices.length === 0) {
      setError("Please select at least one service");
      return;
    }

    if (!description) {
      setError("Please provide a description");
      return;
    }

    if (!customOfferAmount || Number(customOfferAmount) <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }
    if (!requiredDate) {
      setError("Please select a required completion date");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const offerData = {
        tailorId,
        amount: calculateTotalAmount(),
        description,
        selectedServices: selectedServices.map((service) => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          quantity: service.quantity,
          price: service.price,
        })),
        requiredDate: new Date(requiredDate).toISOString(),
        extraServices: selectedExtraServices,
        totalItems: calculateTotalItems(),
      };

      const result = await createOffer(offerData);
      if (result.success) {
        toast.success("Request Sent successfully!");
        onClose();
      } else {
        setError(result.message || "Failed to place offer");
      }
    } catch (err) {
      setError(err.message || "Failed to place offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 shadow-xl rounded-xl z-[70]">
            <p className="text-center">Loading services...</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 shadow-xl rounded-xl z-[70] max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-semibold mb-6 text-gray-900">
            Place an Offer to {tailorName}
          </Dialog.Title>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Available Services
              </h3>
              {services.map((service) => (
                <div
                  key={service._id}
                  className="flex flex-col space-y-2 p-3 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedServices.some(
                          (s) => s.serviceId === service._id
                        )}
                        onChange={() => handleServiceSelection(service)}
                        className="rounded border-gray-300"
                      />
                      <span className="font-medium">{service.type}</span>
                    </div>
                    <div className="text-right">
                      {service.discount ? (
                        <div>
                          <span className="line-through text-gray-400">
                            ₨{service.minPrice}
                          </span>
                          <span className="text-green-600 ml-2">
                            ₨{calculateDiscountedPrice(service)}
                          </span>
                          <div className="text-xs text-red-500">
                            {service.discount.value}% Off
                          </div>
                          <div className="text-xs text-gray-500">
                            (Negotiable from ₨{service.minPrice})
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-600">
                          ₨{service.minPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedServices.some(
                    (s) => s.serviceId === service._id
                  ) && (
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        type="button"
                        onClick={() => updateQuantity(service._id, false)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>
                        {selectedServices.find(
                          (s) => s.serviceId === service._id
                        )?.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(service._id, true)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {selectedServices.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Offer Amount for Selected Services
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">₨</span>
                    <input
                      type="number"
                      value={customOfferAmount}
                      onChange={(e) => setCustomOfferAmount(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your offer amount"
                      min="1"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Original amount: ₨{calculateServicesTotal(selectedServices)}
                  </p>
                </div>
              )}
            </div>

            {extraServices.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Extra Services (Fixed Price)
                </h3>
                {extraServices.map((service) => (
                  <div
                    key={service._id}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedExtraServices.some(
                            (s) => s.serviceId === service._id
                          )}
                          onChange={() => handleServiceSelection(service, true)}
                          className="rounded border-gray-300"
                        />
                        <span className="font-medium">
                          {service.serviceName}
                        </span>
                      </div>
                      <span className="text-gray-600">₨{service.minPrice}</span>
                    </div>
                    {selectedExtraServices.some(
                      (s) => s.serviceId === service._id
                    ) && (
                      <div className="flex items-center space-x-2 ml-6">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(service._id, false, true)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span>
                          {selectedExtraServices.find(
                            (s) => s.serviceId === service._id
                          )?.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(service._id, true, true)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Requirements or Notes
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Describe any specific requirements, customizations, or timeline needs"
                rows={4}
                required
              />
            </div>
            <div>
              <label
                htmlFor="requiredDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Required Completion Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="date"
                  id="requiredDate"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  min={getTomorrowDate()}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Please select when you need your order to be completed
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Items:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Services Total:</span>
                <span>
                  ₨
                  {customOfferAmount ||
                    calculateServicesTotal(selectedServices)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Extra Services Total:</span>
                <span>₨{calculateExtraServicesTotal()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Final Total:</span>
                <span>₨{calculateTotalAmount()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

PlaceOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tailorName: PropTypes.string.isRequired,
  tailorId: PropTypes.string.isRequired,
};

export default PlaceOrderModal;
