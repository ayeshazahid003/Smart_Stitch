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
