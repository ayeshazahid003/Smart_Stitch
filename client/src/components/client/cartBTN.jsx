import React, { useState } from "react";
import { ShoppingCart, X } from "lucide-react";

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Sample Orders with unified structure
  const orders = [
    {
      title: "Custom Suit Order",
      design: {
        designImage: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        customization: {
          fabric: "Wool",
          color: "Navy Blue",
          style: "Slim Fit",
          description: "A perfectly tailored suit for formal events.",
        },
      },
      utilizedServices: [
        { serviceName: "Bespoke Suit Tailoring", price: 250 },
        { serviceName: "Fabric Consultation", price: 50 },
      ],
    },
    {
      title: "Alteration Service",
      utilizedServices: [
        {
          serviceName: "Pant Length Adjustment",
          price: 20,
          designImage:
            "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        },
        {
          serviceName: "Jacket Sleeve Shortening",
          price: 30,
          designImage:
            "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        },
      ],
    },
  ];

  return (
    <>
      {/* Floating Cart Button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/80 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="w-6 h-6" />
      </button>

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full md:w-[30%] bg-card text-foreground shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-popover sticky top-0 z-10">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            className="text-foreground hover:text-red-500 transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="p-6 space-y-4 overflow-y-auto scrollbar-none h-[calc(100vh-140px)]">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-popover p-4 rounded-lg shadow-md"
            >
              {/* Order with Design */}
              {order.design?.designImage?.length > 0 && (
                <>
                  <img
                    src={order.design.designImage[0]}
                    alt="Design"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    <strong>Fabric:</strong> {order.design.customization.fabric}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Color:</strong> {order.design.customization.color}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Style:</strong> {order.design.customization.style}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Description:</strong>{" "}
                    {order.design.customization.description}
                  </p>
                </>
              )}

              {/* Services List */}
              <div className="mt-3">
                {order.utilizedServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 bg-secondary p-3 rounded-lg mb-2"
                  >
                    {service.designImage && (
                      <img
                        src={service.designImage}
                        alt="Service"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{service.serviceName}</p>
                      <p className="text-sm text-muted-foreground">${service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Button (Fixed at Bottom) */}
        <div className="p-6 bg-popover border-t border-border sticky bottom-0 z-10">
          <button className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/80 transition">
            Checkout
          </button>
        </div>
      </div>

      {/* Overlay (Click to Close Cart) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
