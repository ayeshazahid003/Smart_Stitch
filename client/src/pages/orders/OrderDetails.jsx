import React from "react";
import Header from "../../components/client/Header";

export default function OrderDetails() {
  // Static data for Order based on your Order schema
  const orderData = {
    _id: "order123456",
    customerId: "customer123",
    tailorId: "tailor456",
    voucherId: "voucher789",
    status: "in progress",
    design: {
      designImage: [
        "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
        "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
      ],
      customization: {
        fabric: "Cotton",
        color: "Blue",
        style: "Modern",
        description: "A modern blue cotton design with a sleek finish.",
      },
      media: [
        {
          type: "video",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          description: "Design process overview",
        },
        {
          type: "voicenote",
          url: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3",
          description: "Tailor’s voice note explanation",
        },
      ],
    },
    measurement: {
      height: 170,
      chest: 90,
      waist: 70,
      hips: 95,
      shoulder: 45,
      wrist: 16,
      sleeves: 60,
      neck: 38,
      lowerBody: {
        length: 100,
        waist: 70,
        inseam: 75,
        thigh: 55,
        ankle: 22,
      },
    },
    utilizedServices: [
      {
        serviceId: "service001",
        serviceName: "Basic Alteration",
        price: 50,
      },
    ],
    extraServices: [
      {
        serviceId: "serviceExtra001",
        serviceName: "Embroidery",
        price: 30,
      },
    ],
    invoiceId: "invoice001",
    createdAt: "2023-09-15T12:00:00Z",
    updatedAt: "2023-09-16T12:00:00Z",
  };

  // Static data for Tailor Profile based on your TailorProfile schema
  const tailorData = {
    tailorId: "tailor456",
    shopName: "Tailor Master",
    portfolio: [
      {
        name: "Summer Collection",
        images: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
        ],
        description: "A collection of breezy summer outfits.",
        date: "2023-06-01T00:00:00Z",
      },
    ],
    serviceRates: [
      {
        type: "Alteration",
        description: "Basic alterations to perfect your fit.",
        price: 50,
        image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
      },
      {
        type: "Custom Design",
        description: "Bespoke designs tailored to your style.",
        price: 150,
        image: "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
      },
    ],
    extraServices: [
      {
        serviceName: "Embroidery",
        description: "High quality embroidery work to add unique details.",
        price: 30,
      },
    ],
    shopLocation: {
      address: "123 Fashion St, Style City",
      coordinates: [-74.006, 40.7128],
    },
    shopImages: [
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
      "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703980/suit2_hqs58y.jpg",
    ],
    bio: "Experienced tailor with over 10 years in the industry, dedicated to delivering quality and style.",
    isVerified: true,
    verificationToken: "verify123",
    rating: 4.5,
    reviews: ["review1", "review2"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-09-10T00:00:00Z",
  };

  // Calculate subtotal of utilized and extra services
  const utilizedTotal = orderData.utilizedServices.reduce(
    (acc, svc) => acc + svc.price,
    0
  );
  const extraTotal = orderData.extraServices.reduce(
    (acc, svc) => acc + svc.price,
    0
  );
  const subTotal = utilizedTotal + extraTotal;

  // Mock shipping cost and tax for demonstration
  const shippingCost = 5.99;
  const taxes = 3.25;
  const total = subTotal + shippingCost + taxes;

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Detail:</h2>
        </div>

        <div className="max-w-7xl mx-auto bg-white rounded-md shadow-lg p-6 md:p-8">
          {/* Top Section: Order Info + Summary */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            {/* Left: Order Info */}
            <div className="w-full md:w-2/3 pr-0 md:pr-6">
              {/* Package & Date */}
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Order:{" "}
                  <span className="font-medium text-gray-800">
                    {orderData._id}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mb-4">(Package 1 of 1)</p>
                <h3 className="text-xl font-semibold mb-1">
                  Estimated Delivery Date
                </h3>
                <p className="text-gray-700 text-sm">Monday, May 30</p>
                <p className="mt-2 text-green-600 text-sm font-medium">
                  Status:{" "}
                  {orderData.status === "in progress"
                    ? "In Progress"
                    : orderData.status}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your package is on its way.
                </p>
              </div>

              {/* Shipping Address, Delivery Method, Tracking */}
              <div className="border-b pb-4 mb-4 space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold">Shipping Address</h4>
                  <p className="text-gray-600 mt-1">
                    {/* Not in orderData, using tailor's shop address as placeholder */}
                    {tailorData.shopLocation.address},<br />
                    Style City
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Delivery Method</h4>
                  <p className="text-gray-600 mt-1">
                    Standard (5-7 Business Days)
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Tracking ID</h4>
                  <p className="text-blue-600 mt-1 hover:underline cursor-pointer">
                    1231512498124
                  </p>
                </div>
              </div>

              {/* Sign Up for Notifications (example) */}
              <div className="mb-4 text-sm">
                <h4 className="font-semibold mb-2">Stay Updated</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="smsNotifications"
                    className="text-gray-700 cursor-pointer"
                  >
                    Sign up for SMS Order Notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full md:w-1/3 mt-8 md:mt-0">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-4 text-sm">
                  {/* Utilized Services */}
                  {orderData.utilizedServices.map((service, idx) => (
                    <div key={idx} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {service.serviceName}
                        </p>
                        <p className="text-gray-500">Quantity: 1</p>
                      </div>
                      <p className="font-medium text-gray-800">
                        ${service.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {/* Extra Services */}
                  {orderData.extraServices.map((service, idx) => (
                    <div key={idx} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {service.serviceName}
                        </p>
                        <p className="text-gray-500">Quantity: 1</p>
                      </div>
                      <p className="font-medium text-gray-800">
                        ${service.price.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="flex items-center justify-between border-t pt-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium text-gray-800">
                      ${subTotal.toFixed(2)}
                    </p>
                  </div>
                  {/* Shipping */}
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium text-gray-800">
                      ${shippingCost.toFixed(2)}
                    </p>
                  </div>
                  {/* Taxes */}
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Taxes</p>
                    <p className="font-medium text-gray-800">
                      ${taxes.toFixed(2)}
                    </p>
                  </div>
                  {/* Total */}
                  <div className="flex items-center justify-between border-t pt-2">
                    <p className="font-semibold text-gray-800">Total</p>
                    <p className="font-semibold text-gray-800">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-[#111827] text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Design & Measurement */}
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Design & Measurements
              </h3>
              {/* Design Images */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Design Images</h4>
                <div className="grid grid-cols-2 gap-2">
                  {orderData.design.designImage.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Design ${index}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
              {/* Customization */}
              <div className="mb-4 text-sm text-gray-700">
                <h4 className="font-semibold mb-1">Customization</h4>
                <p>Fabric: {orderData.design.customization.fabric}</p>
                <p>Color: {orderData.design.customization.color}</p>
                <p>Style: {orderData.design.customization.style}</p>
                <p>Description: {orderData.design.customization.description}</p>
              </div>
              {/* Media */}
              <div className="mb-4 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Media</h4>
                <div className="space-y-3">
                  {orderData.design.media.map((media, index) => (
                    <div key={index} className="p-3 bg-white border rounded-md">
                      <p>
                        <span className="font-medium">Type:</span> {media.type}
                      </p>
                      <p>
                        <span className="font-medium">URL:</span>{" "}
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Description:</span>{" "}
                        {media.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Measurements */}
              <div className="text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Measurement Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <p>Height: {orderData.measurement.height} cm</p>
                  <p>Chest: {orderData.measurement.chest} cm</p>
                  <p>Waist: {orderData.measurement.waist} cm</p>
                  <p>Hips: {orderData.measurement.hips} cm</p>
                  <p>Shoulder: {orderData.measurement.shoulder} cm</p>
                  <p>Wrist: {orderData.measurement.wrist} cm</p>
                  <p>Sleeves: {orderData.measurement.sleeves} cm</p>
                  <p>Neck: {orderData.measurement.neck} cm</p>
                </div>
                <h5 className="mt-4 font-medium">Lower Body</h5>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p>Length: {orderData.measurement.lowerBody.length} cm</p>
                  <p>Waist: {orderData.measurement.lowerBody.waist} cm</p>
                  <p>Inseam: {orderData.measurement.lowerBody.inseam} cm</p>
                  <p>Thigh: {orderData.measurement.lowerBody.thigh} cm</p>
                  <p>Ankle: {orderData.measurement.lowerBody.ankle} cm</p>
                </div>
              </div>
            </div>

            {/* Tailor Profile */}
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Tailor Profile
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Shop Name:</span>{" "}
                  {tailorData.shopName}
                </p>
                <p>
                  <span className="font-semibold">Bio:</span> {tailorData.bio}
                </p>
                <p>
                  <span className="font-semibold">Verified:</span>{" "}
                  {tailorData.isVerified ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  {tailorData.rating} / 5
                </p>
              </div>

              {/* Service Rates */}
              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">Service Rates</h4>
                {tailorData.serviceRates.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white p-3 rounded-md shadow-sm mb-2"
                  >
                    <img
                      src={service.image}
                      alt={service.type}
                      className="w-14 h-14 object-cover rounded-md mr-3"
                    />
                    <div>
                      <p className="font-medium">{service.type}</p>
                      <p className="text-gray-500">${service.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Services */}
              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">Extra Services</h4>
                {tailorData.extraServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-md shadow-sm mb-2"
                  >
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-gray-500">{service.description}</p>
                    <p className="text-gray-700 font-semibold">
                      ${service.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shop Location */}
              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">Shop Location</h4>
                <p>{tailorData.shopLocation.address}</p>
                <p>
                  Coordinates: {tailorData.shopLocation.coordinates.join(", ")}
                </p>
              </div>

              {/* Shop Images */}
              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">Shop Images</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tailorData.shopImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Shop Image ${index}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
