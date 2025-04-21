import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getOrderById } from "../../hooks/orderHooks";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        if (response.success) {
          console.log("Fetched order:", response.order);
          setOrder(response.order);
        } else {
          toast.error(response.message || "Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        Order not found
      </div>
    );
  }

  const calculateTotal = () => {
    const servicesTotal = order.utilizedServices.reduce(
      (total, service) => total + service.price,
      0
    );
    const extraServicesTotal =
      order.extraServices?.reduce(
        (total, service) => total + service.price,
        0
      ) || 0;
    return order.pricing?.total || servicesTotal + extraServicesTotal;
  };

  // Determine if the conditions for opening Google Maps are met
  const shouldOpenMap = () => {
    // Check if a delivery service is included
    const hasDeliveryService =
      order.utilizedServices?.some((service) =>
        service.serviceName?.toLowerCase().includes("delivery")
      ) ||
      order.extraServices?.some((service) =>
        service.serviceName?.toLowerCase().includes("delivery")
      );

    // Check payment method and status
    const isEligiblePayment =
      (order.paymentMethod === "card" || order.paymentMethod === "cod") &&
      order.paymentStatus === "unpaid";

    // Check if shipping address is valid and sufficiently detailed
    const hasValidShippingAddress =
      order.shippingAddress &&
      order.shippingAddress.city &&
      order.shippingAddress.country &&
      order.shippingAddress.postalCode &&
      (order.shippingAddress.line1 || order.shippingAddress.line2); // Need at least one address line

    return isEligiblePayment && hasDeliveryService && hasValidShippingAddress;
  };

  const handleProceed = () => {
    if (shouldOpenMap()) {
      // Construct address string from available parts
      const addressParts = [
        order.shippingAddress.line1,
        order.shippingAddress.line2,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.postalCode,
        order.shippingAddress.country,
      ]
        .filter((part) => part && part.trim() !== "")
        .join(", "); // Filter out empty/whitespace parts

      if (addressParts) {
        const encodedAddress = encodeURIComponent(addressParts);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        // Open Google Maps in a new tab
        window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
      } else {
        // This case should ideally not happen if hasValidShippingAddress is true, but as a fallback:
        toast.error("Could not format shipping address for map view.");
        // Fallback to checkout? Or just show error? Let's navigate as a fallback.
        navigate(`/checkout/${order._id}`);
      }
    } else {
      // Default action: navigate to checkout
      navigate(`/checkout/${order._id}`);
    }
  };

  // Determine button text based on action
  const buttonText = shouldOpenMap()
    ? "View Delivery Route"
    : "Proceed to Checkout";

  // Determine if the button should be shown based on original logic
  // Tailor sees button if status is NOT pending (e.g., stiched, completed, etc.)
  // Customer sees button ONLY if status IS pending
  const showButton =
    (user?.role === "tailor" && order.status !== "pending") ||
    (user?.role === "customer" && order.status === "pending");

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Order ID: <span className="font-mono text-lg">{order._id}</span>
            </h2>
            <p className="text-gray-600">
              {user?.role === "customer" ? "Tailor" : "Customer"}:{" "}
              <span className="font-semibold">
                {user?.role === "customer"
                  ? order.tailorId?.name || "N/A"
                  : order.customerId?.name || "N/A"}
              </span>
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${
              statusColors[order.status] || "bg-gray-100 text-gray-700" // Fallback color
            }`}
          >
            {order.status ? order.status.toUpperCase() : "UNKNOWN"}
          </span>
        </div>

        {/* Design Section */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
            🎨 Design Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Design Images */}
            {order.design?.designImage &&
              order.design.designImage.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Design Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {order.design.designImage.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Design ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Media Files Section */}
            {order.design?.media && order.design.media.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Additional Media</h4>
                <div className="space-y-4">
                  {order.design.media.map((media, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <p className="font-medium mb-2">
                        {media.type === "video" ? "🎥 Video" : "🎤 Voice Note"}
                      </p>
                      {media.type === "video" ? (
                        <video
                          src={media.url}
                          controls
                          className="w-full rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      ) : (
                        <audio src={media.url} controls className="w-full" />
                      )}
                      {media.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {media.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Details */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-2">Customization</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Fabric:</strong>{" "}
                  {order.design?.customization?.fabric || "N/A"}
                </p>
                <p>
                  <strong>Color:</strong>{" "}
                  {order.design?.customization?.color || "N/A"}
                </p>
                <p>
                  <strong>Style:</strong>{" "}
                  {order.design?.customization?.style || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {order.design?.customization?.description || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Section */}
        {order.measurement && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
              📏 Measurements
            </h3>
            {/* Upper Body */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 text-sm mb-4">
              <p>
                <strong>Height:</strong> {order.measurement.height || "N/A"} cm
              </p>
              <p>
                <strong>Chest:</strong> {order.measurement.chest || "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Waist:</strong> {order.measurement.waist || "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Hips:</strong> {order.measurement.hips || "N/A"} inches
              </p>
              <p>
                <strong>Shoulder:</strong> {order.measurement.shoulder || "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Neck:</strong> {order.measurement.neck || "N/A"} inches
              </p>
            </div>

            {/* Lower Body Measurements */}
            {order.measurement.lowerBody && (
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Lower Body
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 text-sm">
                  <p>
                    <strong>Length:</strong>{" "}
                    {order.measurement.lowerBody.length || "N/A"} inches
                  </p>
                  <p>
                    <strong>Waist:</strong>{" "}
                    {order.measurement.lowerBody.waist || "N/A"} inches
                  </p>
                  <p>
                    <strong>Inseam:</strong>{" "}
                    {order.measurement.lowerBody.inseam || "N/A"} inches
                  </p>
                  <p>
                    <strong>Thigh:</strong>{" "}
                    {order.measurement.lowerBody.thigh || "N/A"} inches
                  </p>
                  <p>
                    <strong>Ankle:</strong>{" "}
                    {order.measurement.lowerBody.ankle || "N/A"} inches
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shipping Address Section */}
        {order.shippingAddress && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
              🚚 Shipping Address
            </h3>
            <div className="text-gray-600 bg-gray-50 p-4 rounded-lg border text-sm">
              {order.shippingAddress.line1 && (
                <p>{order.shippingAddress.line1}</p>
              )}
              {order.shippingAddress.line2 && (
                <p>{order.shippingAddress.line2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Services & Pricing Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
              🛠 Services & Pricing
            </h3>
            {/* Utilized Services */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Utilized Services
              </h4>
              <div className="space-y-1 text-sm">
                {order.utilizedServices?.length > 0 ? (
                  order.utilizedServices.map((service, index) => (
                    <p
                      key={service.serviceId || index}
                      className="text-gray-600 flex justify-between"
                    >
                      <span>{service.serviceName || "Unnamed Service"}</span>
                      <span className="font-semibold">₨{service.price}</span>
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No standard services utilized.
                  </p>
                )}
              </div>
            </div>

            {/* Extra Services */}
            {order.extraServices && order.extraServices.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Extra Services
                </h4>
                <div className="space-y-1 text-sm">
                  {order.extraServices.map((service, index) => (
                    <p
                      key={service.serviceId || index}
                      className="text-gray-600 flex justify-between"
                    >
                      <span>
                        {service.serviceName || "Unnamed Extra Service"}
                      </span>
                      <span className="font-semibold">₨{service.price}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Info & Total */}
          <div className="bg-gray-50 p-4 rounded-lg border self-start">
            <h4 className="font-medium text-gray-700 mb-3">💰 Payment</h4>
            <div className="space-y-2 text-sm mb-4">
              <p className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-semibold capitalize">
                  {order.paymentMethod || "N/A"}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus
                    ? order.paymentStatus.toUpperCase()
                    : "N/A"}
                </span>
              </p>
            </div>

            {/* Total Amount */}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <p className="text-lg font-semibold text-gray-700">Total:</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₨{calculateTotal()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>📅 Created: {new Date(order.createdAt).toLocaleString()}</p>
          <p>🔄 Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
        </div>

        {/* Action Button */}
        {showButton && (
          <div className="mt-6 text-center">
            <button
              onClick={handleProceed}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
