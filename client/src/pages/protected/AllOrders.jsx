import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Importing useNavigate for navigation

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  // Dummy data for orders
  useEffect(() => {
    const dummyOrders = [
      {
        _id: "1",
        customerId: { name: "Customer A" },
        tailorId: { name: "Tailor X" },
        status: "pending",
        utilizedServices: [{ serviceName: "Custom Stitching", price: 50 }],
        createdAt: "2025-02-25T12:00:00Z",
      },
      {
        _id: "2",
        customerId: { name: "Customer B" },
        tailorId: { name: "Tailor Y" },
        status: "completed",
        utilizedServices: [{ serviceName: "Fabric Design", price: 75 }],
        createdAt: "2025-02-24T12:00:00Z",
      },
      {
        _id: "3",
        customerId: { name: "Customer C" },
        tailorId: { name: "Tailor Z" },
        status: "in progress",
        utilizedServices: [{ serviceName: "Measurements", price: 40 }],
        createdAt: "2025-02-23T12:00:00Z",
      },
      {
        _id: "4",
        customerId: { name: "Customer D" },
        tailorId: { name: "Tailor A" },
        status: "refunded",
        utilizedServices: [{ serviceName: "Alterations", price: 60 }],
        createdAt: "2025-02-22T12:00:00Z",
      },
    ];

    setOrders(dummyOrders);
    setLoading(false);
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`); // Navigate to the order details page with the order ID
  };

  if (loading) return <div className="text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">All Orders</h1>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-gray-900">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Order ID</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Customer</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Tailor</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Status</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Total Price</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Created At</th>
                <th className="px-6 py-3 text-gray-100 font-semibold text-sm uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                  <td className="px-6 py-4">{order._id}</td>
                  <td className="px-6 py-4">{order.customerId?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{order.tailorId?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${order.status === "pending"
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
                  <td className="px-6 py-4">
                    ${order.utilizedServices.reduce((total, service) => total + service.price, 0)}
                  </td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(order._id)} // Trigger navigation to details page
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-white hover:text-gray-900 border-b hover:border-gray-900 transition duration-200"
                    >
                      View Details
                    </button>
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
