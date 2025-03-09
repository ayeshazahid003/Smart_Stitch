import React, { useState } from "react";
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
  const navigate = useNavigate();

  // Static data for Sales Trend
  const salesData = {
    weekly: [50, 75, 100, 150],
    monthly: [200, 300, 400, 500],
    yearly: [1000, 1200, 1500, 1800],
  };

  const salesChartData = {
    labels:
      timeRange === "weekly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : timeRange === "monthly"
        ? ["Month 1", "Month 2", "Month 3", "Month 4"]
        : ["Year 1", "Year 2", "Year 3", "Year 4"],
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Your Dashboard
          </h1>
          <div className="flex space-x-4">
          <button className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
            onClick={() => navigate("/add-shop-details")}>
              Add Shop Details
            </button>
          <button className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
            onClick={() => navigate("/add-services")}>
              Add Services
            </button>
            <button className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
            onClick={() => navigate("/add-extra-services")}>
              Add Extra Services
            </button>
            <button className="px-5 py-2 bg-[#111827] text-white rounded-md shadow hover:bg-gray-800 transition"
            onClick={() => navigate("/all-orders")}>
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
            { label: "Total Orders", value: "$150", icon: ArchiveBoxIcon },
            { label: "Active Orders", value: "$50", icon: ArchiveBoxIcon },
            { label: "Completed Orders", value: "$80", icon: ArchiveBoxIcon },
            { label: "Refunded Orders", value: "$20", icon: ArchiveBoxIcon },
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
            </div>
          ))}
        </div>

        {/* Average Rating Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-gray-900">4.5</p>
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
                {[
                  {
                    order: "Product A",
                    customer: "Customer X",
                    date: "02/25/2025",
                    status: "Shipped",
                    amount: "$100",
                    img: "product-image.jpg",
                  },
                  {
                    order: "Product B",
                    customer: "Customer Y",
                    date: "02/24/2025",
                    status: "Completed",
                    amount: "$80",
                    img: "product-image.jpg",
                  },
                  {
                    order: "Product C",
                    customer: "Customer Z",
                    date: "02/23/2025",
                    status: "Refunded",
                    amount: "$20",
                    img: "product-image.jpg",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{row.order}</td>
                    <td className="px-4 py-2">{row.customer}</td>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.status}</td>
                    <td className="px-4 py-2">{row.amount}</td>
                    <td className="px-4 py-2">
                      <img
                        className="w-12 h-12 rounded-md object-cover"
                        src={row.img}
                        alt="Product"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
