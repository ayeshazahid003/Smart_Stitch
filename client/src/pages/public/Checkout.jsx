"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CreditCard, DollarSign, PlusCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import MeasurementModal from "../../components/client/MeasurementModal";
import { useUser } from "../../context/UserContext";
import { verifyVoucherByTitle } from "../../hooks/voucherHooks";

import {
  getOrderById,
  updateOrderStatus,
  createCheckoutSession,
} from "../../hooks/orderHooks";
import {
  getUserProfile,
  addUserAddress,
  addMeasurement,
} from "../../hooks/userHooks";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  "pk_test_51PmxHkKSeVleLwBsHSoyHGeqevzroDon1EPOYsmxFYNQY4xc4w6KPIrDIFAQhBUEDcQ5xVTnBY4iBt5fjuZOhbTc00F74sCE1x"
);

function CheckoutPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // Add addresses state
  const [addresses, setAddresses] = useState([]);

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(2);

  // Address and delivery states
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [instructions, setInstructions] = useState("");
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Design and media states
  const [designImages, setDesignImages] = useState([]);
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [measurementTab, setMeasurementTab] = useState("existing");
  const [tempSelectedMeasurementId, setTempSelectedMeasurementId] =
    useState(null);

  // New state variables
  const [existingMeasurements, setExistingMeasurements] = useState([]);
  const [newMeasurement, setNewMeasurement] = useState({
    name: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    neck: "",
    sleeve: "",
    lowerBody: {
      length: "",
      waist: "",
      inseam: "",
      thigh: "",
      ankle: "",
    },
  });
  const [coupon, setCoupon] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) {
        toast.error("No order ID provided");
        navigate("/");
        return;
      }

      try {
        const [userResponse, orderResponse] = await Promise.all([
          getUserProfile(),
          getOrderById(orderId),
        ]);

        if (userResponse.success) {
          // Set addresses
          const userAddresses = userResponse.user.contactInfo?.addresses || [];
          setAddresses(userAddresses);

          // Set default address if available
          if (userResponse.user.contactInfo?.address) {
            setSelectedAddressId(userResponse.user.contactInfo.address._id);
            // If addresses array is empty but there's a default address, add it
            if (userAddresses.length === 0) {
              setAddresses([userResponse.user.contactInfo.address]);
            }
          }

          // Set measurements
          if (userResponse.user.measurements?.length > 0) {
            setExistingMeasurements(userResponse.user.measurements);
            setTempSelectedMeasurementId(userResponse.user.measurements[0]._id);
          }
        }

        console.log("orderResponse", orderResponse);

        if (orderResponse.success) {
          setOrderData(orderResponse.order);
        } else {
          toast.error("Failed to fetch order details");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load checkout data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, navigate]);

  const openMeasurementModal = () => setIsMeasurementModalOpen(true);
  const closeMeasurementModal = () => setIsMeasurementModalOpen(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleDesignImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    setDesignImages(files);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!orderData || !user || !selectedAddressId) {
      toast.error(
        selectedAddressId
          ? "Missing order data or user not logged in"
          : "Please select a shipping address"
      );
      return;
    }

    try {
      const selectedAddress = addresses.find(
        (addr) => addr._id === selectedAddressId
      );

      // First update the order with design details and shipping address
      const orderUpdateData = {
        design: {
          designImage: [], // This will be handled by file upload
          customization: {
            fabric,
            color,
            style,
            description: customDescription,
          },
          media: [], // This will be handled by file upload
        },
        shippingAddress: selectedAddress,
        measurement: selectedMeasurement,
        status: "pending_payment",
      };

      // Update order with initial details
      const response = await updateOrderStatus(orderId, orderUpdateData);

      if (response.success) {
        if (paymentMethod === "card") {
          const stripe = await stripePromise;
          const session = await createCheckoutSession(orderId, total * 100);

          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });

          if (result.error) {
            toast.error(result.error.message);
          }
        } else if (paymentMethod === "cod") {
          // For COD, directly update order to completed
          await updateOrderStatus(orderId, { status: "completed" });
          toast.success("Order placed successfully!");
          navigate("/order-placed");
        }
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  // Constants for calculations
  const shippingCost = 200.0;
  const TAX_RATE = 0.1; // 10% tax

  // Calculate totals from order data
  const calculateTotals = () => {
    const baseSubtotal = orderData?.pricing?.subtotal || 0;
    const extraServicesTotal =
      orderData.extraServices?.reduce(
        (sum, service) => sum + service.price,
        0
      ) || 0;

    const subtotal = baseSubtotal + extraServicesTotal;
    const voucherDiscount = appliedVoucher
      ? (subtotal * appliedVoucher.discount) / 100
      : 0;
    const discountedSubtotal = subtotal - voucherDiscount;
    const tax = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + shippingCost + tax;

    return {
      subtotal,
      extraServicesTotal,
      voucherDiscount,
      tax,
      total,
    };
  };

  const { subtotal, extraServicesTotal, voucherDiscount, tax, total } =
    calculateTotals();

  const handleVoucherApply = async () => {
    if (!coupon.trim()) {
      setVoucherError("Please enter a voucher code");
      return;
    }

    if (appliedVoucher) {
      setVoucherError("A voucher has already been applied");
      return;
    }

    try {
      setIsApplyingVoucher(true);
      setVoucherError("");

      const response = await verifyVoucherByTitle(coupon, orderData.tailorId);

      if (response.success) {
        const updatedOrder = await updateOrderStatus(orderId, {
          voucherId: response.voucher._id,
          status: "pending_payment",
        });

        if (updatedOrder.success) {
          setAppliedVoucher(response.voucher);
          toast.success(
            `Voucher applied successfully! ${response.voucher.discount}% discount added.`
          );

          // Calculate new totals with voucher
          const discountAmount = (subtotal * response.voucher.discount) / 100;
          const discountedSubtotal = subtotal - discountAmount;
          const newTax = discountedSubtotal * TAX_RATE;
          const newTotal = discountedSubtotal + shippingCost + newTax;

          // Update order data with new pricing
          setOrderData({
            ...orderData,
            pricing: {
              ...orderData.pricing,
              subtotal: subtotal,
              voucherDiscount: discountAmount,
              tax: newTax,
              total: newTotal,
            },
          });
        }
      }
    } catch (error) {
      setVoucherError(
        error.response?.data?.message || "Failed to apply voucher"
      );
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading checkout details...</p>
      </div>
    );
  }

  // Helper to determine step circle styling
  const getCircleStyle = (circleStep) => {
    if (step > circleStep) {
      // completed
      return "w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white";
    } else if (step === circleStep) {
      // active
      return "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-green-600 text-green-600";
    } else {
      // upcoming
      return "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-gray-400";
    }
  };

  // Helper to determine connector line color
  const getConnectorStyle = (connectorAfterStep) => {
    // If our current step is greater than the connector step, it’s completed (green)
    // otherwise it's gray
    return step > connectorAfterStep
      ? "flex-auto border-t-2 border-green-600 mx-2"
      : "flex-auto border-t-2 border-gray-300 mx-2";
  };

  // Function for measurement handling
  const handleSaveMeasurement = async () => {
    if (measurementTab === "existing" && tempSelectedMeasurementId) {
      const selected = existingMeasurements.find(
        (m) => m.id === tempSelectedMeasurementId
      );
      setSelectedMeasurement(selected);
    } else if (measurementTab === "new" && newMeasurement.name) {
      // Here you would typically save the new measurement to your backend
      const newMeasurementWithId = { ...newMeasurement, id: Date.now() };
      setSelectedMeasurement(newMeasurementWithId);
    }
    closeMeasurementModal();
  };

  const handleAddNewAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      // Create a new address object with an _id
      const newAddressWithId = {
        ...newAddress,
        _id: Date.now().toString(), // Temporary ID for demo
      };

      // Update addresses state
      setAddresses((prev) => [...prev, newAddressWithId]);

      // Update selected address
      setSelectedAddressId(newAddressWithId._id);

      // Reset form and close it
      setIsAddingNewAddress(false);
      setNewAddress({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
      });

      toast.success("Address added successfully");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Cart</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </div>

        {/* 4-Step Dynamic Progress Bar */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-center mb-6">
            {/* Step 1: Cart */}
            <div className="flex items-center">
              <div className={getCircleStyle(1)}>
                {step > 1 ? (
                  // If completed, show check icon
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  // If active or upcoming, show step number
                  1
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 1 ? "text-gray-700" : "text-gray-400"
                }`}
              >
                Cart
              </span>
            </div>

            {/* Connector after step 1 */}
            <div className={getConnectorStyle(1)} />

            {/* Step 2: Details */}
            <div className="flex items-center">
              <div className={getCircleStyle(2)}>
                {step > 2 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step === 2 ? (
                  2
                ) : (
                  2
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 2 ? "text-gray-700" : "text-gray-400"
                }`}
              >
                Details
              </span>
            </div>

            {/* Connector after step 2 */}
            <div className={getConnectorStyle(2)} />

            {/* Step 3: Payment */}
            <div className="flex items-center">
              <div className={getCircleStyle(3)}>
                {step > 3 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step === 3 ? (
                  3
                ) : (
                  3
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 3 ? "text-gray-700" : "text-gray-400"
                }`}
              >
                Payment
              </span>
            </div>

            {/* Connector after step 3 */}
            <div className={getConnectorStyle(3)} />

            {/* Step 4: Done */}
            <div className="flex items-center">
              <div className={getCircleStyle(4)}>
                {step >= 4 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  4
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 4 ? "text-gray-700" : "text-gray-400"
                }`}
              >
                Done
              </span>
            </div>
          </div>
        </div>

        {/* STEP 2: Shipping & Payment */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Delivery Method Selection */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 text-[#111827]">
                    Delivery Method
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="delivery"
                        checked={deliveryMethod === "delivery"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="form-radio"
                      />
                      <span>Home Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="form-radio"
                      />
                      <span>Pickup from Store</span>
                    </label>
                  </div>
                </div>

                {/* Shipping Address - Only show if delivery is selected */}
                {deliveryMethod === "delivery" && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Delivery Address
                    </h3>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address._id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="mt-1 mr-4"
                          />
                          <div>
                            <div className="font-medium">{address.line1}</div>
                            {address.line2 && (
                              <div className="text-gray-600">
                                {address.line2}
                              </div>
                            )}
                            <div className="text-gray-600">
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </div>
                            <div className="text-gray-600">
                              {address.country}
                            </div>
                          </div>
                        </label>
                      ))}

                      {!isAddingNewAddress ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(true)}
                          className="flex items-center space-x-2 text-[#111827] hover:underline"
                        >
                          <PlusCircle className="w-5 h-5" />
                          <span>Add New Address</span>
                        </button>
                      ) : (
                        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Full Name *"
                              value={newAddress.name}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  name: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Phone Number *"
                              value={newAddress.phone}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Address Line 1 *"
                              value={newAddress.addressLine1}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  addressLine1: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded md:col-span-2"
                            />
                            <input
                              type="text"
                              placeholder="Address Line 2"
                              value={newAddress.addressLine2}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  addressLine2: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded md:col-span-2"
                            />
                            <input
                              type="text"
                              placeholder="City *"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="State/Province *"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Postal Code *"
                              value={newAddress.postalCode}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  postalCode: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingNewAddress(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddNewAddress}
                              className="px-4 py-2 bg-[#111827] text-white rounded hover:bg-[#1f2937]"
                            >
                              Save Address
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Add Instructions (optional)
                    </span>
                    <textarea
                      placeholder="Additional details..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                      rows={3}
                    />
                  </label>
                </div>

                {/* Measurement Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Measurements</h3>
                  <div className="space-y-4">
                    {existingMeasurements.map((measurement) => (
                      <label
                        key={measurement._id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                          tempSelectedMeasurementId === measurement._id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="measurement"
                          checked={
                            tempSelectedMeasurementId === measurement._id
                          }
                          onChange={() =>
                            setTempSelectedMeasurementId(measurement._id)
                          }
                          className="mt-1 mr-4"
                        />
                        <div>
                          <div className="font-medium">{measurement.title}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                            <div>Height: {measurement.data.height} cm</div>
                            <div>Chest: {measurement.data.chest} cm</div>
                            <div>Waist: {measurement.data.waist} cm</div>
                            <div>Hips: {measurement.data.hips} cm</div>
                          </div>
                        </div>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={openMeasurementModal}
                      className="flex items-center space-x-2 text-[#111827] hover:underline"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Select / Add Measurement</span>
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 text-[#111827]">
                    Payment Method
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center px-4 py-2 border rounded-md transition ${
                        paymentMethod === "card"
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#111827] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay by Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center px-4 py-2 border rounded-md transition ${
                        paymentMethod === "cod"
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#111827] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Cash on Delivery
                    </button>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-md text-gray-700">
                      You chose to pay by Card. (Demo: No card details
                      collected.)
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-md text-gray-700">
                      You chose Cash on Delivery. Please ensure someone is
                      available to receive the package.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4 text-[#111827]">
                  Order Summary
                </h2>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Have a voucher?"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setVoucherError("");
                      }}
                      className={`w-full border ${
                        voucherError ? "border-red-300" : "border-gray-300"
                      } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]`}
                      disabled={appliedVoucher || isApplyingVoucher}
                    />
                    {voucherError && (
                      <p className="text-red-500 text-sm mt-1">
                        {voucherError}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleVoucherApply}
                    disabled={appliedVoucher || isApplyingVoucher}
                    className={`bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition ${
                      (appliedVoucher || isApplyingVoucher) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isApplyingVoucher ? "Applying..." : "Apply"}
                  </button>
                </div>
                <div className="space-y-4 max-h-64 overflow-auto">
                  {orderData?.utilizedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {service.serviceName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {service.quantity || 1}
                        </p>
                      </div>
                      <p className="font-medium text-gray-800">
                        RS{" "}
                        {(service.price * (service.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Negotiated Price Banner */}
                <div className="mb-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <span className="text-blue-700 font-medium">
                      ✓ Negotiated Price
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    This is your final negotiated price with the tailor.
                  </p>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>RS {subtotal.toFixed(2)}</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-green-600">
                      <span>Voucher Discount ({appliedVoucher.discount}%)</span>
                      <span>- RS {voucherDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>RS {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>RS {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold mt-2">
                    <span>Total</span>
                    <span>RS {total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-[#111827] text-white py-3 rounded-md hover:bg-[#1f2937] transition"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: Design, Media, and final Place Order */}
        {step === 3 && (
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#111827]">
              Optional Design &amp; Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Design Images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDesignImagesChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gray-200 file:text-gray-800
                      hover:file:bg-gray-300"
                  />
                </label>
                {designImages.length > 0 && (
                  <p className="text-sm text-green-600">
                    {designImages.length} image(s) selected.
                  </p>
                )}
              </div>
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Fabric
                  </span>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#111827] focus:ring-2 focus:ring-[#111827]"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Color
                  </span>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#111827] focus:ring-2 focus:ring-[#111827]"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Style
                  </span>
                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#111827] focus:ring-2 focus:ring-[#111827]"
                  />
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Description
                  </span>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#111827] focus:ring-2 focus:ring-[#111827]"
                    rows={3}
                  />
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="mt-6 w-full bg-[#111827] text-white py-3 rounded-md hover:bg-[#1f2937] transition"
            >
              Place Order
            </button>
          </form>
        )}

        {/* STEP 4: Done (Order Placed) */}
        {step === 4 && (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-[#111827]">
              Order Placed!
            </h2>
            <p className="text-gray-700">
              Thank you for your order. You can track your order status in your
              account dashboard.
            </p>
            <p className="text-gray-700">
              We appreciate your business! If you have any questions, feel free
              to contact us.
            </p>
          </div>
        )}
      </div>

      {/* Measurement Modal Component */}
      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onRequestClose={closeMeasurementModal}
        measurementTab={measurementTab}
        setMeasurementTab={setMeasurementTab}
        existingMeasurements={existingMeasurements}
        tempSelectedMeasurementId={tempSelectedMeasurementId}
        setTempSelectedMeasurementId={setTempSelectedMeasurementId}
        newMeasurement={newMeasurement}
        setNewMeasurement={setNewMeasurement}
        handleSaveMeasurement={handleSaveMeasurement}
      />
    </div>
  );
}

export default function Checkout() {
  return <CheckoutPage />;
}
