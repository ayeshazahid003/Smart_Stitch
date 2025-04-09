import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "in progress",
      "completed",
      "refunded",
      "pending_payment",
      "placed",
      "cancelled",
      "on hold",
      "returned",
      "failed",
      "disputed",
      "stiched",
      "picked up",
      "out for delivery",
      "delivered",
      "ready for pickup",
      "awaiting pickup",
    ],
    required: true,
  },
  shippingAddress: AddressSchema,
  design: {
    designImage: [{ type: String }],
    customization: {
      fabric: { type: String },
      color: { type: String },
      style: { type: String },
      description: { type: String },
    },
    media: [
      {
        type: { type: String, enum: ["video", "voicenote"], required: true },
        url: { type: String, required: true },
        description: { type: String },
      },
    ],
  },
  measurement: {
    height: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    shoulder: { type: Number },
    wrist: { type: Number },
    sleeves: { type: Number },
    neck: { type: Number },
    lowerBody: {
      length: { type: Number },
      waist: { type: Number },
      inseam: { type: Number },
      thigh: { type: Number },
      ankle: { type: Number },
    },
  },
  utilizedServices: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TailorProfile.serviceRates",
      },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  extraServices: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TailorProfile.extraServices",
      },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  discounts: {
    campaignDiscount: {
      type: Number,
      default: 0,
    },
    voucherDiscount: {
      type: Number,
      default: 0,
    },
  },
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number },
    campaignDiscount: { type: Number, default: 0 },
    voucherDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
