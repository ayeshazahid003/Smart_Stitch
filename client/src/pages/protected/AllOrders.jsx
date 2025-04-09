import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { getAllOrders } from "../../hooks/orderHooks";
import { toast } from "react-toastify";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        if (response.success) {
          setOrders(response.orders);
        } else {
          toast.error(response.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const calculateTotal = (order) => {
    const servicesTotal = order.utilizedServices.reduce(
      (total, service) => total + service.price,
      0
    );
    const extraServicesTotal =
      order.extraServices?.reduce(
        (total, service) => total + service.price,
        0
      ) || 0;
    return (order.pricing?.total || servicesTotal + extraServicesTotal).toFixed(
      2
    );
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          All Orders
        </h1>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-gray-900">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                  Order ID
                </th>
                {user?.role === "tailor" && (
                  <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                    Customer
                  </th>
                )}
                {user?.role === "customer" && (
                  <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                    Tailor
                  </th>
                )}
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                  Total Price
                </th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4">{order._id}</td>
                  {user?.role === "tailor" && (
                    <td className="px-6 py-4">
                      {order.customerId?.name || "N/A"}
                    </td>
                  )}
                  {user?.role === "customer" && (
                    <td className="px-6 py-4">
                      {order.tailorId?.name || "N/A"}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : order.status === "in progress"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">₨{calculateTotal(order)}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-white hover:text-gray-900 border-b hover:border-gray-900 transition duration-200"
                    >
                      View Details
                    </button>
                    {user?.role === "customer" &&
                      order.status === "pending" && (
                        <button
                          onClick={() => navigate(`/checkout/${order._id}`)}
                          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                        >
                          Checkout
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
