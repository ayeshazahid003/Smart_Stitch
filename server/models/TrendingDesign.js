import mongoose from 'mongoose';

const TrendingDesignSchema = new mongoose.Schema({
  designImage: [{ type: String }],
  description: { type: String },
  popularityScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TrendingDesign', TrendingDesignSchema);
