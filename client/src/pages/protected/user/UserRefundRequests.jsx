import React, { useState, useEffect } from "react";
import { getUserRefundRequests } from "../../../hooks/RefundRequest";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const statusColors = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
  },
  approved: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  rejected: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  processed: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
};

export default function UserRefundRequests() {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const data = await getUserRefundRequests();
        if (Array.isArray(data)) {
          setRefundRequests(data);
        } else {
          console.error("Invalid response format:", data);
          toast.error("Failed to load your refund requests");
        }
      } catch (error) {
        console.error("Error fetching user refund requests:", error);
        toast.error("Failed to load your refund requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading your refund requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        My Refund Requests
      </h1>

      {refundRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No refund requests found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You have not submitted any refund requests yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 shadow rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {refundRequests.map((req) => (
                <tr key={req._id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {req._id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate">
                    {req.reason}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatCurrency(req.amount)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        statusColors[req.status]?.bg
                      } ${statusColors[req.status]?.text}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          statusColors[req.status]?.dot
                        } mr-1.5`}
                      />
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {formatDate(req.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
