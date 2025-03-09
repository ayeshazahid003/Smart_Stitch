"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, DollarSign, Edit3, PlusCircle } from "lucide-react"
import MeasurementModal from "../../components/client/MeasurementModal"

// Mock data and helper functions
const existingAddresses = [
  { id: 1, name: "John Doe", addressLine1: "123 Main St", addressLine2: "Apt 1" },
  { id: 2, name: "Jane Doe", addressLine1: "456 Oak Ave", addressLine2: "" },
]

const existingMeasurements = [
  { id: 1, name: "Standard", height: 175, chest: 90, waist: 80, hips: 95 },
  { id: 2, name: "Custom", height: 180, chest: 100, waist: 85, hips: 100 },
]

const cartProducts = [
  { id: 1, title: "Product 1", image: "/product1.jpg", price: 25, quantity: 2 },
  { id: 2, title: "Product 2", image: "/product2.jpg", price: 50, quantity: 1 },
]

function CheckoutPage() {
  // We start at step=2 because "Cart" (step=1) is already completed.
  const [step, setStep] = useState(2)

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [instructions, setInstructions] = useState("")
  const [selectedMeasurement, setSelectedMeasurement] = useState(null)
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [coupon, setCoupon] = useState("")
  const [designImages, setDesignImages] = useState([])
  const [fabric, setFabric] = useState("")
  const [color, setColor] = useState("")
  const [style, setStyle] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [selectedAudioMethod, setSelectedAudioMethod] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [media, setMedia] = useState([])
  const [measurementTab, setMeasurementTab] = useState("existing")
  const [tempSelectedMeasurementId, setTempSelectedMeasurementId] = useState(null)
  const [newMeasurement, setNewMeasurement] = useState({
    name: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
  })

  const openMeasurementModal = () => setIsMeasurementModalOpen(true)
  const closeMeasurementModal = () => setIsMeasurementModalOpen(false)

  const handleNextStep = (e) => {
    e.preventDefault()
    // Move from step=2 to step=3, or step=3 to step=4, etc.
    setStep((prev) => prev + 1)
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    // Handle place order logic here
    console.log("Place Order")
    setStep(4) // Go to "Done" step
  }

  const handleDesignImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setDesignImages(files)
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      setMedia([...media, { type: "video", url: event.target.result }])
    }
    reader.readAsDataURL(file)
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      setMedia([...media, { type: "voicenote", url: event.target.result }])
    }
    reader.readAsDataURL(file)
  }

  const handleRecordAudio = () => {
    setIsRecording(!isRecording)
    // Add recording logic here using the MediaRecorder API
  }

  const handleSaveMeasurement = () => {
    // Handle saving measurement logic here
    console.log("Save Measurement", newMeasurement)
    closeMeasurementModal()
  }

  const subtotal = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const shippingCost = 10
  const tax = subtotal * 0.05
  const total = subtotal + shippingCost + tax

  // Helper to determine step circle styling
  const getCircleStyle = (circleStep) => {
    if (step > circleStep) {
      // completed
      return "w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white"
    } else if (step === circleStep) {
      // active
      return "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-green-600 text-green-600"
    } else {
      // upcoming
      return "w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-gray-400"
    }
  }

  // Helper to determine connector line color
  const getConnectorStyle = (connectorAfterStep) => {
    // If our current step is greater than the connector step, it’s completed (green)
    // otherwise it's gray
    return step > connectorAfterStep
      ? "flex-auto border-t-2 border-green-600 mx-2"
      : "flex-auto border-t-2 border-gray-300 mx-2"
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
              {/* Left Column: Shipping Address, Instructions, Measurement & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 text-[#111827]">Shipping Address</h2>
                  <div className="space-y-4">
                    {existingAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-[#111827] bg-gray-50"
                            : "border-gray-200 bg-white hover:shadow-md"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{addr.name}</p>
                          <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                          <p className="text-sm text-gray-600">{addr.addressLine2}</p>
                          <div className="flex items-center space-x-3 mt-2 text-[#111827]">
                            <button type="button" className="flex items-center space-x-1 hover:underline">
                              <Edit3 className="w-4 h-4" />
                              <span className="text-sm">Edit</span>
                            </button>
                            <button type="button" className="hover:underline text-sm">
                              Add Instructions
                            </button>
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
                        {/* New address form fields remain unchanged */}
                        <p className="text-sm text-gray-600">New address form goes here.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Add Instructions (optional)</span>
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
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 text-[#111827]">Measurement</h2>
                  <div className="space-y-4">
                    {selectedMeasurement ? (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="font-medium text-gray-800">{selectedMeasurement.name}</p>
                        <p className="text-sm text-gray-600">Height: {selectedMeasurement.height} cm</p>
                        <p className="text-sm text-gray-600">Chest: {selectedMeasurement.chest} cm</p>
                        <p className="text-sm text-gray-600">Waist: {selectedMeasurement.waist} cm</p>
                        <p className="text-sm text-gray-600">Hips: {selectedMeasurement.hips} cm</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No measurement selected.</p>
                    )}
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
                  <h2 className="text-xl font-semibold mb-4 text-[#111827]">Payment Method</h2>
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
                      You chose to pay by Card. (Demo: No card details collected.)
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-md text-gray-700">
                      You chose Cash on Delivery. Please ensure someone is available to receive the package.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4 text-[#111827]">Order Summary</h2>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Have a coupon?"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                  />
                  <button
                    type="button"
                    className="bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition"
                  >
                    Apply
                  </button>
                </div>
                <div className="space-y-4 max-h-64 overflow-auto">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.title}</p>
                        <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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
            <h2 className="text-2xl font-semibold mb-6 text-[#111827]">Optional Design &amp; Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Design Images</span>
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
                  <p className="text-sm text-green-600">{designImages.length} image(s) selected.</p>
                )}
              </div>
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Fabric</span>
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
                  <span className="text-sm font-medium text-gray-700">Color</span>
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
                  <span className="text-sm font-medium text-gray-700">Style</span>
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
                  <span className="text-sm font-medium text-gray-700">Description</span>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#111827] focus:ring-2 focus:ring-[#111827]"
                    rows={3}
                  />
                </label>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#111827]">Media (Video / Voice Note)</h3>
              <div className="space-y-4">
                {/* Upload Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gray-200 file:text-gray-800
                      hover:file:bg-gray-300"
                  />
                </div>

                {/* Audio Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio (Voice Note)</label>
                  {selectedAudioMethod === null && (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedAudioMethod("upload")}
                        className="bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition"
                      >
                        Upload Audio
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAudioMethod("record")}
                        className="bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition"
                      >
                        Record Audio
                      </button>
                    </div>
                  )}
                  {selectedAudioMethod === "upload" && (
                    <div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-gray-200 file:text-gray-800
                          hover:file:bg-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedAudioMethod(null)}
                        className="mt-2 text-sm text-[#111827] hover:underline"
                      >
                        Change method
                      </button>
                    </div>
                  )}
                  {selectedAudioMethod === "record" && (
                    <div>
                      <button
                        type="button"
                        onClick={handleRecordAudio}
                        className="px-4 py-2 border border-[#111827] rounded-md text-sm text-[#111827] hover:bg-gray-50 transition"
                      >
                        {isRecording ? "Stop Recording" : "Record Audio"}
                      </button>
                      {isRecording && (
                        <p className="text-sm text-red-500 mt-1">Recording... speak into your microphone.</p>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedAudioMethod(null)}
                        className="mt-2 text-sm text-[#111827] hover:underline"
                      >
                        Change method
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Display Selected/Recorded Media */}
              {media.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Media Selected:</p>
                  {media.map((m, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded-md bg-gray-50">
                      <span className="text-sm font-medium">{m.type === "video" ? "Video:" : "Voice Note:"}</span>
                      {m.type === "voicenote" && <audio controls src={m.url} className="w-40" />}
                      {m.type === "video" && <video src={m.url} width={120} height={80} controls className="rounded" />}
                    </div>
                  ))}
                </div>
              )}
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
            <h2 className="text-2xl font-semibold text-[#111827]">Order Placed!</h2>
            <p className="text-gray-700">
              Thank you for your order. You can track your order status in your account dashboard.
            </p>
            <p className="text-gray-700">
              We appreciate your business! If you have any questions, feel free to contact us.
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
  )
}

export default function Checkout() {
  return <CheckoutPage />
}
