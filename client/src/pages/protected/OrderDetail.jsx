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

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Order ID: {order._id}
            </h2>
            <p className="text-gray-600">
              {user?.role === "customer" ? "Tailor" : "Customer"}:
              <span className="font-semibold">
                {user?.role === "customer"
                  ? order.tailorId?.name
                  : order.customerId?.name}
              </span>
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              statusColors[order.status]
            }`}
          >
            {order.status.toUpperCase()}
          </span>
        </div>

        {/* Design Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🎨 Design Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.design.designImage &&
              order.design.designImage.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Design Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {order.design.designImage.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Design ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Media Files Section */}
            {order.design.media && order.design.media.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Additional Media</h4>
                <div className="space-y-4">
                  {order.design.media.map((media, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
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

            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Customization Details
              </h4>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Fabric:</strong> {order.design.customization?.fabric}
                </p>
                <p>
                  <strong>Color:</strong> {order.design.customization?.color}
                </p>
                <p>
                  <strong>Style:</strong> {order.design.customization?.style}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {order.design.customization?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Section */}
        {order.measurement && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              📏 Measurements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
              <p>
                <strong>Height:</strong> {order.measurement.height} cm
              </p>
              <p>
                <strong>Chest:</strong> {order.measurement.chest} inches
              </p>
              <p>
                <strong>Waist:</strong> {order.measurement.waist} inches
              </p>
              <p>
                <strong>Hips:</strong> {order.measurement.hips} inches
              </p>
              <p>
                <strong>Shoulder:</strong> {order.measurement.shoulder} inches
              </p>
              <p>
                <strong>Neck:</strong> {order.measurement.neck} inches
              </p>
            </div>

            {/* Lower Body Measurements */}
            {order.measurement.lowerBody && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  🦵 Lower Body Measurements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
                  <p>
                    <strong>Length:</strong>{" "}
                    {order.measurement.lowerBody.length} inches
                  </p>
                  <p>
                    <strong>Waist:</strong> {order.measurement.lowerBody.waist}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Inseam:</strong>{" "}
                    {order.measurement.lowerBody.inseam} inches
                  </p>
                  <p>
                    <strong>Thigh:</strong> {order.measurement.lowerBody.thigh}{" "}
                    inches
                  </p>
                  <p>
                    <strong>Ankle:</strong> {order.measurement.lowerBody.ankle}{" "}
                    inches
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🛠 Utilized Services
          </h3>
          <div className="space-y-2">
            {order.utilizedServices.map((service) => (
              <p
                key={service.serviceId}
                className="text-gray-600 flex justify-between"
              >
                {service.serviceName}{" "}
                <span className="font-bold">₨{service.price}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Extra Services */}
        {order.extraServices && order.extraServices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              ✨ Extra Services
            </h3>
            <div className="space-y-2">
              {order.extraServices.map((service) => (
                <p
                  key={service.serviceId}
                  className="text-gray-600 flex justify-between"
                >
                  {service.serviceName}{" "}
                  <span className="font-bold">₨{service.price}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-700">
                Total Amount:
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₨{calculateTotal()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t pt-4 mt-6 flex justify-between items-center text-gray-500">
          <p>📄 Invoice ID: {order.invoiceId || "Not generated"}</p>
          <p>📅 Created: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Checkout Button for Customers */}
        {user?.role === "customer" && order.status === "pending" && (
          <div className="mt-6">
            <button
              onClick={() => navigate(`/checkout/${order._id}`)}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
