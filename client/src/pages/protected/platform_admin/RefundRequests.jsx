// filepath: /home/najam-ul-hassn/Desktop/Smart_Stitch/client/src/pages/protected/platform_admin/RefundRequests.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import {
  getAllRefundRequests,
  updateRefundStatus,
  processRefund,
} from "../../../hooks/RefundRequest.js";
import { format } from "date-fns";
import { toast } from "react-toastify";

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

export default function RefundRequests() {
  const [refundRequests, setRefundRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRefundRequest, setCurrentRefundRequest] = useState(null);
  const [action, setAction] = useState(""); // 'approve', 'reject' or 'partial'
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [partialAmount, setPartialAmount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const data = await getAllRefundRequests();
      if (Array.isArray(data)) {
        setRefundRequests(data);
      } else {
        console.error("Invalid response format:", data);
        toast.error("Failed to load refund requests");
      }
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      toast.error("Failed to load refund requests");
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (refundRequest, actionType) => {
    setCurrentRefundRequest(refundRequest);
    setAction(actionType);
    setAdminNotes("");
    setPartialAmount(
      actionType === "partial" ? refundRequest.amount / 2 : refundRequest.amount
    );
    setIsModalOpen(true);
  };

  const handleSubmitAction = async () => {
    setProcessing(true);
    try {
      let status = action === "approve" ? "approved" : "rejected";
      let amount = currentRefundRequest.amount;

      if (action === "partial") {
        status = "approved";
        amount = partialAmount;
      }

      const data = await updateRefundStatus(currentRefundRequest._id, {
        status,
        adminNotes,
        amount: action === "partial" ? partialAmount : undefined,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      // If it's an approval (full or partial), process the refund
      if (status === "approved") {
        const processResult = await processRefund(currentRefundRequest._id);
        if (processResult.error) {
          throw new Error(processResult.error);
        }
      }

      // Update the UI with the new status
      setRefundRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === currentRefundRequest._id
            ? { ...req, status, adminNotes }
            : req
        )
      );

      toast.success(
        `Refund request ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error processing refund action:", error);
      toast.error(error.message || "Failed to process refund request");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading refund requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">
            Refund Requests
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer refund requests by approving, rejecting, or
            partially approving them.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => fetchRefundRequests()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {refundRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No refund requests found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            There are currently no refund requests to manage.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {refundRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {request._id.substring(0, 8)}...
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.customer?.name || "Unknown"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.order?._id?.substring(0, 8) || "N/A"}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 max-w-sm truncate">
                          {request.reason}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(request.amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                              statusColors[request.status]?.bg
                            } ${statusColors[request.status]?.text}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                statusColors[request.status]?.dot
                              } mr-1.5`}
                            ></span>
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {request.status === "pending" && (
                            <Menu
                              as="div"
                              className="relative inline-block text-left"
                            >
                              <div>
                                <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                                  <span className="sr-only">Options</span>
                                  <EllipsisVerticalIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </Menu.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() =>
                                            openActionModal(request, "approve")
                                          }
                                          className={`${
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700"
                                          } block w-full text-left px-4 py-2 text-sm`}
                                        >
                                          Approve
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() =>
                                            openActionModal(request, "partial")
                                          }
                                          className={`${
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700"
                                          } block w-full text-left px-4 py-2 text-sm`}
                                        >
                                          Partial Approval
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() =>
                                            openActionModal(request, "reject")
                                          }
                                          className={`${
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700"
                                          } block w-full text-left px-4 py-2 text-sm text-red-600`}
                                        >
                                          Reject
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full z-10 p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {action === "approve"
                    ? "Approve Refund"
                    : action === "partial"
                    ? "Partial Refund Approval"
                    : "Reject Refund"}
                </h3>
                <div className="mt-4">
                  {currentRefundRequest && (
                    <>
                      <dl className="space-y-2 mb-5">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Customer
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentRefundRequest.customer?.name || "Unknown"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Order ID
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentRefundRequest.order?._id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Refund Reason
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentRefundRequest.reason}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Requested Amount
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatCurrency(currentRefundRequest.amount)}
                          </dd>
                        </div>
                      </dl>

                      {action === "partial" && (
                        <div className="mb-4">
                          <label
                            htmlFor="partialAmount"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Partial Refund Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                PKR
                              </span>
                            </div>
                            <input
                              type="number"
                              name="partialAmount"
                              id="partialAmount"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              min="0"
                              max={currentRefundRequest.amount}
                              value={partialAmount}
                              onChange={(e) =>
                                setPartialAmount(
                                  Math.min(
                                    parseFloat(e.target.value) || 0,
                                    currentRefundRequest.amount
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <label
                          htmlFor="adminNotes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Admin Notes
                        </label>
                        <textarea
                          id="adminNotes"
                          name="adminNotes"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Add your notes about this decision"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md mt-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {action === "approve" || action === "partial" ? (
                              <CheckIcon
                                className="h-6 w-6 text-green-400"
                                aria-hidden="true"
                              />
                            ) : (
                              <ExclamationTriangleIcon
                                className="h-6 w-6 text-red-400"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-800">
                              {action === "approve"
                                ? "Approve full refund?"
                                : action === "partial"
                                ? "Approve partial refund?"
                                : "Reject refund request?"}
                            </h3>
                            <div className="mt-2 text-sm text-gray-500">
                              <p>
                                {action === "approve"
                                  ? `This will approve a full refund of ${formatCurrency(
                                      currentRefundRequest.amount
                                    )}`
                                  : action === "partial"
                                  ? `This will approve a partial refund of ${formatCurrency(
                                      partialAmount
                                    )}`
                                  : "This will reject the refund request. The customer will be notified."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${
                  action === "reject"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
                onClick={handleSubmitAction}
                disabled={processing}
              >
                {processing
                  ? "Processing..."
                  : action === "approve"
                  ? "Approve Refund"
                  : action === "partial"
                  ? "Approve Partial Refund"
                  : "Reject Refund"}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsModalOpen(false)}
                disabled={processing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
