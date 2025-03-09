import React from "react";

const dummyOrders = [
  {
    _id: "1",
    customerId: "CUST12345",
    
    status: "pending",
    design: {
      designImage: ["https://via.placeholder.com/150"],
      customization: {
        fabric: "Cotton",
        color: "Blue",
        style: "Modern",
        description: "A sleek modern design with custom embroidery.",
      },
      media: [{ type: "video", url: "https://via.placeholder.com/150", description: "Fabric sample" }],
    },
    measurement: {
      height: 170,
      chest: 40,
      waist: 32,
      hips: 38,
      shoulder: 18,
      wrist: 7,
      sleeves: 24,
      neck: 16,
      lowerBody: {
        length: 40,
        waist: 32,
        inseam: 30,
        thigh: 22,
        ankle: 10,
      },
    },
    utilizedServices: [
      { serviceId: "1", serviceName: "Basic Stitching", price: 50 },
      { serviceId: "2", serviceName: "Custom Embroidery", price: 30 },
    ],
    extraServices: [{ serviceId: "3", serviceName: "Express Delivery", price: 15 }],
    invoiceId: "INV001",
    createdAt: "2025-03-04",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  return (
    <div className="p-6 min-h-screen ">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-left"> Order Details</h1>

      {dummyOrders.map((order) => (
        <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Order ID: {order._id}</h2>
              <p className="text-gray-600">Customer ID: <span className="font-semibold">{order.customerId}</span></p>
              
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${statusColors[order.status]}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Design Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🎨 Design Details</h3>
            <div className="flex items-center gap-4">
              <img src={order.design.designImage[0]} alt="Design" className="w-24 h-24 object-cover rounded-lg shadow-md" />
              <div>
                <p className="text-gray-600"><strong>Fabric:</strong> {order.design.customization.fabric}</p>
                <p className="text-gray-600"><strong>Color:</strong> {order.design.customization.color}</p>
                <p className="text-gray-600"><strong>Style:</strong> {order.design.customization.style}</p>
                <p className="text-gray-600"><strong>Description:</strong> {order.design.customization.description}</p>
              </div>
            </div>
          </div>

          {/* Measurement Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📏 Measurements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
              <p><strong>Height:</strong> {order.measurement.height} cm</p>
              <p><strong>Chest:</strong> {order.measurement.chest} inches</p>
              <p><strong>Waist:</strong> {order.measurement.waist} inches</p>
              <p><strong>Hips:</strong> {order.measurement.hips} inches</p>
              <p><strong>Shoulder:</strong> {order.measurement.shoulder} inches</p>
              <p><strong>Neck:</strong> {order.measurement.neck} inches</p>
            </div>

            {/* Lower Body Measurements */}
            {order.measurement.lowerBody && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">🦵 Lower Body Measurements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
                  <p><strong>Length:</strong> {order.measurement.lowerBody.length} inches</p>
                  <p><strong>Waist:</strong> {order.measurement.lowerBody.waist} inches</p>
                  <p><strong>Inseam:</strong> {order.measurement.lowerBody.inseam} inches</p>
                  <p><strong>Thigh:</strong> {order.measurement.lowerBody.thigh} inches</p>
                  <p><strong>Ankle:</strong> {order.measurement.lowerBody.ankle} inches</p>
                </div>
              </div>
            )}
          </div>

          {/* Utilized Services */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🛠 Utilized Services</h3>
            {order.utilizedServices.map((service) => (
              <p key={service.serviceId} className="text-gray-600 flex justify-between">
                {service.serviceName} <span className="font-bold">${service.price}</span>
              </p>
            ))}
          </div>

          {/* Extra Services */}
          {order.extraServices.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">✨ Extra Services</h3>
              {order.extraServices.map((service) => (
                <p key={service.serviceId} className="text-gray-600 flex justify-between">
                  {service.serviceName} <span className="font-bold">${service.price}</span>
                </p>
              ))}
            </div>
          )}

          {/* Footer Section */}
          <div className="border-t pt-4 mt-6 flex justify-between items-center text-gray-500">
            <p>📄 Invoice ID: {order.invoiceId}</p>
            <p>📅 Created At: {order.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;

