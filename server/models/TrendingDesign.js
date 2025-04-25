import mongoose from "mongoose";

const TrendingDesignSchema = new mongoose.Schema({
  designImage: [{ type: String }],
  description: { type: String },
  popularityScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  feature: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
  numberOfLikes: { type: Number, default: 0 },
  numberOfDownloads: { type: Number, default: 0 },
  displayOrder: { type: Number, default: 0 },
});

export default mongoose.model("TrendingDesign", TrendingDesignSchema);
