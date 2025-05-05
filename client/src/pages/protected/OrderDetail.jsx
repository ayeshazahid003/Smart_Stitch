import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router";
import { getOrderById } from "../../hooks/orderHooks";
import { createRefundRequest } from "../../hooks/RefundRequest";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [submittingRefund, setSubmittingRefund] = useState(false);
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

    // Check if shipping address is valid and sufficiently detailed
    const hasValidShippingAddress =
      order?.shippingAddress &&
      order?.shippingAddress?.city &&
      order?.shippingAddress?.country &&
      order?.shippingAddress?.postalCode &&
      (order?.shippingAddress?.line1 || order.shippingAddress?.line2);

    // Tailors should always see the map if there's a delivery service & address
    if (user?.role === "tailor") {
      return hasDeliveryService && hasValidShippingAddress;
    }

    // For customers: check payment method and status as before
    const isEligiblePayment =
      (order.paymentMethod === "card" || order.paymentMethod === "cod") &&
      order.paymentStatus === "unpaid";

    return isEligiblePayment && hasDeliveryService && hasValidShippingAddress;
  };

  const handleProceed = () => {
    if (user?.role === "tailor") {
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
        .join(", ");

      if (addressParts) {
        const encodedAddress = encodeURIComponent(addressParts);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Could not format shipping address for map view.");
        return;
      }
    } else {
      navigate(`/checkout/${order._id}`);
    }
  };

  // Check if customer can request a refund for this order
  const canRequestRefund = () => {
    return (
      user?.role === "customer" &&
      (order.paymentStatus === "paid" ||
        order?.paymentDetails?.paymentStatus === "paid") &&
      (order.status === "delivered" || order.status === "completed") &&
      order.paymentStatus !== "refunded" &&
      order.paymentStatus !== "refund_requested"
    );
  };

  // Handle opening the refund modal
  const openRefundModal = () => {
    setRefundReason("");
    setIsRefundModalOpen(true);
  };

  // Handle submitting a refund request
  const handleRefundSubmit = async () => {
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for your refund request");
      return;
    }

    setSubmittingRefund(true);
    try {
      const response = await createRefundRequest({
        orderId: order._id,
        reason: refundReason,
      });

      if (response._id) {
        toast.success("Refund request submitted successfully");
        setIsRefundModalOpen(false);

        // Refresh order details to update status
        const updatedOrder = await getOrderById(orderId);
        if (updatedOrder.success) {
          setOrder(updatedOrder.order);
        }
      } else {
        toast.error(response.error || "Failed to submit refund request");
      }
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("An error occurred while submitting your refund request");
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Determine button text based on action
  const buttonText =
    user?.role === "tailor" ? "View Delivery Route" : "Proceed to Checkout";

  // Determine if the button should be shown
  const showButton =
    (user?.role === "tailor" && order.status !== "pending") ||
    (user?.role === "customer" && order.status === "pending");

  console.log("order measurement", order.customerId.measurements[0]);

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
              statusColors[order.status] || "bg-gray-100 text-gray-700"
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

            {order.design?.media && order.design?.media?.length > 0 && (
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
        {(order.measurement || order?.customerId?.measurements) && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
              📏 Measurements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 text-sm mb-4">
              <p>
                <strong>Height:</strong>{" "}
                {order.measurement?.height ||
                  order?.customerId?.measurements[0]?.data?.height ||
                  "N/A"}{" "}
                cm
              </p>
              <p>
                <strong>Chest:</strong>{" "}
                {order.measurement?.chest ||
                  order?.customerId?.measurements[0]?.data?.chest ||
                  "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Waist:</strong>{" "}
                {order.measurement?.waist ||
                  order?.customerId?.measurements[0]?.data?.waist ||
                  "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Hips:</strong>{" "}
                {order.measurement?.hips ||
                  order?.customerId?.measurements[0]?.data?.hips ||
                  "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Shoulder:</strong>{" "}
                {order.measurement?.shoulder ||
                  order?.customerId?.measurements[0]?.data?.shoulder ||
                  "N/A"}{" "}
                inches
              </p>
              <p>
                <strong>Neck:</strong>{" "}
                {order.measurement?.neck ||
                  order?.customerId?.measurements[0]?.data?.neck ||
                  "N/A"}{" "}
                inches
              </p>
            </div>

            {(order?.measurement?.lowerBody ||
              order?.customerId?.measurements[0]?.data?.lowerBody) && (
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Lower Body
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 text-sm">
                  <p>
                    <strong>Length:</strong>{" "}
                    {order.measurement.lowerBody.length ||
                      order?.customerId?.measurements[0]?.data?.lowerBody
                        ?.length ||
                      "N/A"}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Waist:</strong>{" "}
                    {order.measurement.lowerBody?.waist ||
                      order?.customerId?.measurements[0]?.data?.lowerBody
                        ?.waist ||
                      "N/A"}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Inseam:</strong>{" "}
                    {order.measurement.lowerBody?.inseam ||
                      order?.customerId?.measurements[0]?.data?.lowerBody
                        ?.inseam ||
                      "N/A"}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Thigh:</strong>{" "}
                    {order.measurement.lowerBody?.thigh ||
                      order?.customerId?.measurements[0]?.data?.lowerBody
                        ?.thigh ||
                      "N/A"}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Ankle:</strong>{" "}
                    {order.measurement.lowerBody?.ankle ||
                      order?.customerId?.measurements[0]?.data?.lowerBody
                        ?.ankle ||
                      "N/A"}{" "}
                    inches
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
                <p>{order.shippingAddress?.line1}</p>
              )}
              {order.shippingAddress.line2 && (
                <p>{order.shippingAddress?.line2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        )}
        {/* Services & Pricing Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
              🛠 Services & Pricing
            </h3>
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
                    order?.paymentDetails?.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order?.paymentDetails?.paymentStatus === "unpaid"
                      ? "bg-red-100 text-red-700"
                      : order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "unpaid"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order?.paymentDetails?.paymentStatus ||
                    order.paymentStatus ||
                    "N/A"}
                </span>
              </p>
            </div>
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
        {/* Refund Request Button - For customers with paid & delivered orders */}
        {canRequestRefund() && (
          <div className="mt-6 text-center">
            <button
              onClick={openRefundModal}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Request Refund
            </button>
          </div>
        )}
      </div>

      {/* Refund Request Modal */}
      {isRefundModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsRefundModalOpen(false)}
          ></div>

          {/* Modal container */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Request a Refund
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please provide a reason for your refund request. Our team
                      will review your request and process it accordingly.
                    </p>
                  </div>

                  <div className="mt-4">
                    <textarea
                      rows={4}
                      name="refundReason"
                      id="refundReason"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Please explain why you are requesting a refund..."
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900">
                      Order Details
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Total Amount: ₨{order.pricing?.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={handleRefundSubmit}
                  disabled={submittingRefund}
                >
                  {submittingRefund ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsRefundModalOpen(false)}
                  disabled={submittingRefund}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
