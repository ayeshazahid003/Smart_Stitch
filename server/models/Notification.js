import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "new_offer",
      "offer_accepted",
      "offer_rejected",
      "new_order",
      "order_update",
      "promotion",
      "reminder",
      "ORDER_PAID",
      "ORDER_PLACED",
      "ORDER_REJECTED",
      "ORDER_ACCEPTED",

    ],
    required: true,
  },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
  onModel: { type: String, enum: ["Order", "Offer"] },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
