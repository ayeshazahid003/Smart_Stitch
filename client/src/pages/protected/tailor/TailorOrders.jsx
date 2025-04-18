import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../../context/UserContext";
import { getTailorOrders, updateOrderStatus } from "../../../hooks/orderHooks";
import { toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  FunnelIcon as FilterIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowUpIcon as SortAscendingIcon,
  ArrowDownIcon as SortDescendingIcon,
} from "@heroicons/react/20/solid";

const TailorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getTailorOrders();
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

    if (user) fetchOrders();
  }, [user]);

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, { status: newStatus });
      if (response.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const viewOrderDetails = (orderId) => {
    // navigate(`/tailor/orders/${orderId}`);
    return;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerId?.name &&
        order.customerId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    let aValue, bValue;
    switch (sortColumn) {
      case "_id":
        aValue = a._id.toLowerCase();
        bValue = b._id.toLowerCase();
        break;
      case "customer":
        aValue = a.customerId?.name?.toLowerCase() || "";
        bValue = b.customerId?.name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "total":
        aValue = parseFloat(calculateTotal(a));
        bValue = parseFloat(calculateTotal(b));
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = "";
        bValue = "";
    }
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const orderStatuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "in progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "placed",
      label: "Placed",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      value: "stiched",
      label: "Stitched",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "sold",
      label: "Sold",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-rose-100 text-rose-800 border-rose-200",
    },
    {
      value: "pending_payment",
      label: "Pending Payment",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      value: "on hold",
      label: "On Hold",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      value: "returned",
      label: "Returned",
      color: "bg-pink-100 text-pink-800 border-pink-200",
    },
    {
      value: "failed",
      label: "Failed",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      value: "disputed",
      label: "Disputed",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      value: "picked up",
      label: "Picked Up",
      color: "bg-teal-100 text-teal-800 border-teal-200",
    },
    {
      value: "out for delivery",
      label: "Out for Delivery",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "ready for pickup",
      label: "Ready for Pickup",
      color: "bg-lime-100 text-lime-800 border-lime-200",
    },
    {
      value: "awaiting pickup",
      label: "Awaiting Pickup",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
  ];

  const getStatusBadgeClass = (status) => {
    const statusObj = orderStatuses.find((s) => s.value === status);
    return statusObj
      ? statusObj.color
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const SortIndicator = ({ column }) => (
    <span className="ml-1 inline-flex">
      {sortColumn === column &&
        (sortOrder === "asc" ? (
          <SortAscendingIcon className="h-4 w-4" />
        ) : (
          <SortDescendingIcon className="h-4 w-4" />
        ))}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Orders
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                >
                  <option value="all">All Statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {sortedOrders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("_id")}
                    >
                      <div className="flex items-center">
                        Order ID
                        <SortIndicator column="_id" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">
                        Customer
                        <SortIndicator column="customer" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <SortIndicator column="status" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center">
                        Total
                        <SortIndicator column="total" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Created
                        <SortIndicator column="createdAt" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => viewOrderDetails(order._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₨{calculateTotal(order)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Update Status
                              <ChevronDownIcon
                                className="-mr-1 ml-2 h-5 w-5"
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
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 z-[999]">
                              <div className="py-1 max-h-64 overflow-y-auto">
                                {orderStatuses.map((status) => (
                                  <Menu.Item key={status.value}>
                                    {({ active }) => (
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            order._id,
                                            status.value
                                          )
                                        }
                                        className={`${
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700"
                                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                      >
                                        <span
                                          className={`mr-2 h-2 w-2 rounded-full ${status.color
                                            .replace("bg-", "bg-")
                                            .replace("text-", "")
                                            .replace("border-", "")}`}
                                        ></span>
                                        {status.label}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No orders found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "You haven't received any orders yet."}
                </p>
              </div>
            )}
          </div>

          {sortedOrders.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{sortedOrders.length}</span> order
                {sortedOrders.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TailorOrders;
