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

// Registering chart.js components
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

  // Static data for Line (Sales Trend)
  const salesData = {
    weekly: [50, 75, 100, 150],
    monthly: [200, 300, 400, 500],
    yearly: [1000, 1200, 1500, 1800],
  };

  const salesChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"], // Labels for each week
    datasets: [
      {
        label: "Sales",
        data: salesData[timeRange], // Data based on selected time range
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
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
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tailor Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md">All Orders</button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md">Payouts</button>
        </div>
      </div>

      {/* Order Stats Section */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between gap-2 items-center">
            <div className="w-5"><ArchiveBoxIcon /></div>
            <h3 className="text-lg font-bold text-gray-700">Total Orders</h3>
          </div>
          <p className="text-xl text-gray-900 font-bold">$150</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between gap-2 items-center">
            <div className="w-5"><ArchiveBoxIcon /></div>
            <h3 className="text-lg font-bold text-gray-700">Active Orders</h3>
          </div>
          <p className="text-xl text-gray-900 font-bold">$50</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between gap-2 items-center">
            <div className="w-5"><ArchiveBoxIcon /></div>
            <h3 className="text-lg font-bold text-gray-700">Completed Orders</h3>
          </div>
          <p className="text-xl text-gray-900 font-bold">$80</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between gap-2 items-center">
            <div className="w-5"><ArchiveBoxIcon /></div>
            <h3 className="text-lg font-bold text-gray-700">Refunded Orders</h3>
          </div>
          <p className="text-xl text-gray-900 font-bold">$20</p>
        </div>
      </div>

      {/* Average Rating Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg text-gray-700 font-bold">Average Rating</h3>
        <p className="text-xl text-gray-900 font-bold">4.5</p>
      </div>

      {/* Sale Graph Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-gray-700 font-bold">Sales Trend</h3>
          <div>
            <button
              className="px-3 py-1 bg-gray-900 text-white rounded-md mr-2"
              onClick={() => handleTimeRangeChange("weekly")}
            >
              Weekly
            </button>
            <button
              className="px-3 py-1 bg-gray-900 text-white rounded-md mr-2"
              onClick={() => handleTimeRangeChange("monthly")}
            >
              Monthly
            </button>
            <button
              className="px-3 py-1 bg-gray-900 text-white rounded-md"
              onClick={() => handleTimeRangeChange("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Line Chart with Full Width and Dynamic Height */}
        <div className="w-full h-[400px]"> {/* Set a fixed height, like 400px */}
          <Line data={salesChartData} options={salesOptions} />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg text-gray-700 font-bold mb-4">Recent Orders</h3>
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-gray-700 font-bold">
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {/* Static rows for recent orders */}
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">Product A</td>
              <td className="px-4 py-2">Customer X</td>
              <td className="px-4 py-2">02/25/2025</td>
              <td className="px-4 py-2">Shipped</td>
              <td className="px-4 py-2">$100</td>
              <td className="px-4 py-2"><img className="w-12 h-12" src="product-image.jpg" alt="Product" /></td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">Product B</td>
              <td className="px-4 py-2">Customer Y</td>
              <td className="px-4 py-2">02/24/2025</td>
              <td className="px-4 py-2">Completed</td>
              <td className="px-4 py-2">$80</td>
              <td className="px-4 py-2"><img className="w-12 h-12" src="product-image.jpg" alt="Product" /></td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">Product C</td>
              <td className="px-4 py-2">Customer Z</td>
              <td className="px-4 py-2">02/23/2025</td>
              <td className="px-4 py-2">Refunded</td>
              <td className="px-4 py-2">$20</td>
              <td className="px-4 py-2"><img className="w-12 h-12" src="product-image.jpg" alt="Product" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TailorDashboard;
