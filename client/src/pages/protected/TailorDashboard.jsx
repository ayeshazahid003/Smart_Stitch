import React, { useState, useEffect } from "react";
import { ArchiveBoxIcon } from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router";
import { getTailorDashboardData } from "../../hooks/TailorHooks";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TailorDashboard = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getTailorDashboardData();

        if (response.success) {
          setDashboardData(response.dashboardData);
        } else {
          setError(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare sales chart data using real or fallback data
  const salesData = dashboardData?.salesTrend || {
    weekly: [50, 75, 100, 150],
    monthly: [200, 300, 400, 500],
    yearly: [1000, 1200, 1500, 1800],
  };

  const salesChartData = {
    labels:
      timeRange === "weekly"
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : timeRange === "monthly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
    datasets: [
      {
        label: "Sales",
        data: salesData[timeRange],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
      },
    },
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // Order stats from real data or fallback to default values
  const orderStats = dashboardData?.orderStats || {
    total: { count: 0, amount: 0 },
    active: { count: 0, amount: 0 },
    completed: { count: 0, amount: 0 },
    refunded: { count: 0, amount: 0 },
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Your Dashboard
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
              onClick={() => navigate("/add-shop-details")}
            >
              Add Shop Details
            </button>
            <button
              className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
              onClick={() => navigate("/add-services")}
            >
              Add Services
            </button>
            <button
              className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
              onClick={() => navigate("/add-extra-services")}
            >
              Add Extra Services
            </button>
            <button
              className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
              onClick={() => navigate("/all-orders")}
            >
              All Orders
            </button>
            <button className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition">
              Payouts
            </button>
          </div>
        </div>

        {/* Order Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Orders",
              value: `$${orderStats.total.amount.toFixed(2)}`,
              count: orderStats.total.count,
              icon: ArchiveBoxIcon,
            },
            {
              label: "Active Orders",
              value: `$${orderStats.active.amount.toFixed(2)}`,
              count: orderStats.active.count,
              icon: ArchiveBoxIcon,
            },
            {
              label: "Completed Orders",
              value: `$${orderStats.completed.amount.toFixed(2)}`,
              count: orderStats.completed.count,
              icon: ArchiveBoxIcon,
            },
            {
              label: "Refunded Orders",
              value: `$${orderStats.refunded.amount.toFixed(2)}`,
              count: orderStats.refunded.count,
              icon: ArchiveBoxIcon,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <stat.icon className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-700">
                  {stat.label}
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">Count: {stat.count}</p>
            </div>
          ))}
        </div>

        {/* Average Rating Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardData?.avgRating || 0}
          </p>
        </div>

        {/* Sales Graph Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-lg transition">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 sm:mb-0">
              Sales Trend
            </h3>
            <div className="flex space-x-2">
              {["weekly", "monthly", "yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-4 py-2 rounded-md transition bg-[#111827] ${
                    timeRange === range
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-80">
            <Line data={salesChartData} options={salesOptions} />
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Order
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Customer Name
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Image
                  </th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData?.recentOrders || []).length > 0 ? (
                  dashboardData.recentOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">
                        Order #{order.id.substring(0, 6)}
                      </td>
                      <td className="px-4 py-2">{order.customer}</td>
                      <td className="px-4 py-2">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "refunded"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">${order.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {order.image ? (
                          <img
                            className="w-12 h-12 rounded-md object-cover"
                            src={order.image}
                            alt="Product"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
