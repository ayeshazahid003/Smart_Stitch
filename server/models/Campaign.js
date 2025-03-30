import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["seasonal", "special", "holiday"],
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  applicableServices: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "serviceType",
      },
      serviceType: {
        type: String,
        enum: ["TailorProfile.serviceRates", "TailorProfile.extraServices"],
        required: true,
      },
      originalPrice: Number,
      discountedPrice: Number,
    },
  ],
  minimumOrderValue: { type: Number },
  maximumDiscount: { type: Number },
  termsAndConditions: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Campaign", CampaignSchema);
