import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    selectedServices: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        serviceName: String,
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    extraServices: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        serviceName: String,
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalItems: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "negotiating",
        "accepted_by_tailor",
        "accepted_by_customer",
        "accepted",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
    finalAmount: {
      type: Number,
    },
    negotiationHistory: [
      {
        amount: Number,
        message: String,
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        accepted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    convertedToOrder: {
      type: Boolean,
      default: false,
    },
    requiredDate: {
      type: Date,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);
