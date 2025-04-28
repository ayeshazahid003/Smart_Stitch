import mongoose from "mongoose";

const TailorProfileSchema = new mongoose.Schema({
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Keeping this required as it seems essential
  },
  shopName: { type: String }, // Optional
  phoneNumber: { type: String }, // Optional
  portfolio: [
    {
      name: { type: String }, // Optional
      images: [{ type: String }], // Optional
      description: { type: String }, // Optional
      date: { type: Date }, // Optional
    },
  ],
  serviceRates: [
    {
      type: { type: String }, // Optional
      description: { type: String }, // Optional
      minPrice: { type: Number }, // Optional
      maxPrice: { type: Number }, // Optional
      image: { type: String }, // Optional
    },
  ],
  extraServices: [
    {
      serviceName: { type: String }, // Optional
      description: { type: String }, // Optional
      minPrice: { type: Number }, // Optional
      maxPrice: { type: Number }, // Optional
    },
  ],
  shopLocation: {
    address: { type: String }, // Optional
    coordinates: {
      lat: { type: Number }, // Optional
      lng: { type: Number }, // Optional
    },
  },
  shopImages: [{ type: String }], // Optional
  bio: { type: String }, // Optional
  experience: { type: Number }, // Optional
  isVerified: { type: Boolean, default: false }, // Optional
  verificationToken: { type: String }, // Optional
  rating: { type: Number, default:0 }, // Optional
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("TailorProfile", TailorProfileSchema);
