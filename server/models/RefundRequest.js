import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processed"],
      default: "pending",
    },
    adminNotes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    refundId: String, // Stripe refund ID when processed
  },
  { timestamps: true }
);

export default mongoose.model("RefundRequest", refundRequestSchema);
