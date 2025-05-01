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

  // Address state
  const [addresses, setAddresses] = useState([]);

  // Order & flow state
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(2);

  // Delivery & address
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

  // Measurement & payment
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [existingMeasurements, setExistingMeasurements] = useState([]);
  const [tempSelectedMeasurementId, setTempSelectedMeasurementId] =
    useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [measurementTab, setMeasurementTab] = useState("new");
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
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Design, voucher & pricing
  const [designImages, setDesignImages] = useState([]);
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  // Fetch user & order data
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

        // addresses
        if (userResponse.success) {
          const userAddresses = userResponse.user.contactInfo?.addresses || [];
          setAddresses(userAddresses);

          if (userResponse.user.contactInfo?.address) {
            const addr = userResponse.user.contactInfo.address;
            setSelectedAddressId(addr._id);
            if (userAddresses.length === 0) {
              setAddresses([addr]);
            }
          }

          // measurements
          if (userResponse.user.measurements?.length > 0) {
            setExistingMeasurements(userResponse.user.measurements);
            setSelectedMeasurement(userResponse.user.measurements[0]);
          }
        }

        // order
        if (orderResponse.success) {
          setOrderData(orderResponse.order);
        } else {
          toast.error("Failed to fetch order details");
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load checkout data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, navigate]);

  // Helpers: next step, open/close modal, design files
  const handleNextStep = (e) => {
    e.preventDefault();

    // Step 2 validation: when adding new address, require saving first
    if (step === 2) {
      if (isAddingNewAddress) {
        toast.error(
          "Please fill in and save the new address before proceeding."
        );
        return;
      }
      if (!selectedAddressId) {
        toast.error("Please select a shipping address before proceeding.");
        return;
      }
    }

    setStep((s) => s + 1);
  };
  const openMeasurementModal = () => setIsMeasurementModalOpen(true);
  const closeMeasurementModal = () => setIsMeasurementModalOpen(false);
  const handleDesignImagesChange = (e) =>
    setDesignImages(Array.from(e.target.files));

  // Place order / create Stripe session / COD
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderData || !user || !selectedAddressId) {
      toast.error(
        selectedAddressId
          ? "Missing data or not logged in"
          : "Please select a shipping address"
      );
      return;
    }

    try {
      const addr = addresses.find((a) => a._id === selectedAddressId);
      const payload = {
        design: {
          designImage: [],
          customization: {
            fabric,
            color,
            style,
            description: customDescription,
          },
          media: [],
        },
        shippingAddress: addr,
        measurement: selectedMeasurement,
        status: "pending_payment",
      };

      console.log("payment method", paymentMethod);
      console.log("payload", payload);

      const resp = await updateOrderStatus(orderId, payload);
      if (resp.success) {
        if (paymentMethod === "card") {
          const stripe = await stripePromise;
          const session = await createCheckoutSession(orderId, total * 100);
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          console.log("Checkout result:", result);
          if (result.error) toast.error(result.error.message);
        } else {
          await updateOrderStatus(orderId, {
            status: "completed",
            paymentMethod: "cod",
          });
          toast.success("Order placed successfully!");
          navigate(`/order-placed?order_id=${orderId}`);
        }
      } else {
        toast.error(resp.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order");
    }
  };

  // Pricing calc
  const SHIPPING_COST = 200;
  const TAX_RATE = 0.1;
  const { subtotal, extraServicesTotal, voucherDiscount, tax, total } = (() => {
    const base = orderData?.pricing?.subtotal || 0;
    const extra =
      orderData?.extraServices?.reduce((s, x) => s + x.price, 0) || 0;
    const sub = base + extra;
    const vDisc = appliedVoucher ? (sub * appliedVoucher.discount) / 100 : 0;
    const discSub = sub - vDisc;
    const t = discSub * TAX_RATE;
    const tot = discSub + SHIPPING_COST + t;
    return {
      subtotal: sub,
      extraServicesTotal: extra,
      voucherDiscount: vDisc,
      tax: t,
      total: tot,
    };
  })();

  // Apply voucher
  const handleVoucherApply = async () => {
    if (!coupon.trim()) {
      setVoucherError("Please enter a voucher code");
      return;
    }
    if (appliedVoucher) {
      setVoucherError("Voucher already applied");
      return;
    }
    try {
      setIsApplyingVoucher(true);
      setVoucherError("");
      const resp = await verifyVoucherByTitle(coupon, orderData.tailorId);
      console.log("Voucher response:", resp);
      if (resp.success) {
        const updated = await updateOrderStatus(orderId, {
          voucherId: resp.voucher._id,
          status: "pending_payment",
        });
        if (updated.success) {
          setAppliedVoucher(resp.voucher);
          toast.success(`Voucher applied: ${resp.voucher.discount}% discount`);
          // recompute new pricing
          const disc = (subtotal * resp.voucher.discount) / 100;
          const newSub = subtotal - disc;
          const newTax = newSub * TAX_RATE;
          setOrderData((o) => ({
            ...o,
            pricing: {
              ...o.pricing,
              subtotal,
              voucherDiscount: disc,
              tax: newTax,
              total: newSub + SHIPPING_COST + newTax,
            },
          }));
        }
      } else {
        setVoucherError(resp.message || "Invalid voucher code");
      }
    } catch (err) {
      toast.error();
      setVoucherError(err.response?.data?.message || "Failed to apply voucher");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  // Save measurement (modal)
  const handleSaveMeasurement = () => {
    if (measurementTab === "existing" && selectedMeasurement) {
      // nothing
    } else if (measurementTab === "new" && newMeasurement.name) {
      const newMeas = {
        ...newMeasurement,
        _id: Date.now().toString(),
      };
      setSelectedMeasurement(newMeas);
    }
    closeMeasurementModal();
  };

  // Add address
  const handleAddNewAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      toast.error("Fill all required address fields");
      return;
    }
    const addr = {
      ...newAddress,
      _id: Date.now().toString(),
    };
    setAddresses((a) => [...a, addr]);
    setSelectedAddressId(addr._id);
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
    toast.success("Address added");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading checkout details...</p>
      </div>
    );
  }

  // Progress bar helpers
  const getCircleStyle = (i) =>
    step > i
      ? "w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white"
      : step === i
      ? "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-green-600 text-green-600"
      : "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-gray-400";
  const getConnectorStyle = (i) =>
    step > i
      ? "flex-auto border-t-2 border-green-600 mx-2"
      : "flex-auto border-t-2 border-gray-300 mx-2";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Cart</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </div>

        {/* Progress Bar */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-center mb-6">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={getCircleStyle(1)}>
                {step > 1 ? (
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
            <div className={getConnectorStyle(1)} />

            {/* Step 2 */}
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
            <div className={getConnectorStyle(2)} />

            {/* Step 3 */}
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
            <div className={getConnectorStyle(3)} />

            {/* Step 4 */}
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

        {/* STEP 2: Details */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Delivery Method */}
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

                {/* Shipping Address */}
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
                            value={address._id}
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
                          selectedMeasurement?._id === measurement._id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="measurement"
                          checked={selectedMeasurement?._id === measurement._id}
                          onChange={() => setSelectedMeasurement(measurement)}
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
                    {measurementTab === "new" && newMeasurement.name && (
                      <label
                        key={newMeasurement._id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedMeasurement?._id === newMeasurement._id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="newMeasurement"
                          checked={
                            measurementTab === "new" && newMeasurement.name
                          }
                          onChange={() =>
                            setSelectedMeasurement(newMeasurement)
                          }
                          className="mt-1 mr-4"
                        />
                        <div>
                          <div className="font-medium">
                            {newMeasurement.title}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                            <div>Height: {newMeasurement.height} cm</div>
                            <div>Chest: {newMeasurement.chest} cm</div>
                            <div>Waist: {newMeasurement.waist} cm</div>
                            <div>Hips: {newMeasurement.hips} cm</div>
                          </div>
                        </div>
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={openMeasurementModal}
                      className="flex items-center space-x-2 text-[#111827] hover:underline"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Checkout with New Measurement</span>
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
                      disabled={!!appliedVoucher || isApplyingVoucher}
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
                    disabled={!!appliedVoucher || isApplyingVoucher}
                    className={`bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition ${
                      (appliedVoucher || isApplyingVoucher) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isApplyingVoucher ? "Applying..." : "Apply"}
                  </button>
                </div>

                <div className="space-y-4 max-h-64 overflow-auto">
                  {orderData?.utilizedServices.map((s) => (
                    <div key={s.id} className="flex items-center space-x-4">
                      <img
                        src={s.image || "/placeholder.svg"}
                        alt={s.serviceName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {s.serviceName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {s.quantity || 1}
                        </p>
                      </div>
                      <p className="font-medium text-gray-800">
                        RS {(s.price * (s.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

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
                    <span>RS {SHIPPING_COST.toFixed(2)}</span>
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

        {/* STEP 3: Optional Design & Place Order */}
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

            <button
              type="submit"
              className="mt-6 w-full bg-[#111827] text-white py-3 rounded-md hover:bg-[#1f2937] transition"
            >
              Place Order
            </button>
          </form>
        )}

        {/* STEP 4: Confirmation */}
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

      {/* Measurement Modal */}
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
