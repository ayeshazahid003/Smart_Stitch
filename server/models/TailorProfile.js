import mongoose from "mongoose";

const TailorProfileSchema = new mongoose.Schema({
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopName: { type: String, required: true }, // Name of the shop
  phoneNumber: { type: String, required: true }, // Phone number of the tailor
  portfolio: [
    {
      name: { type: String, required: true }, // Name of the portfolio entry
      images: [{ type: String, required: true }], // Array of image URLs
      description: { type: String }, // Description of the portfolio entry
      date: { type: Date, required: true }, // Date when the portfolio was added
    },
  ],
  serviceRates: [
    {
      type: { type: String, required: true }, // Service type
      description: { type: String, required: true }, // Description of the service
      minPrice: { type: Number, required: true },
      maxPrice: { type: Number, required: true },
      image: { type: String, required: true }, // Image URL for the service
    },
  ],
  extraServices: [
    {
      serviceName: { type: String, required: true }, // Name of the extra service
      description: { type: String, required: true }, // Description of the extra service
      minPrice: { type: Number, required: true },
      maxPrice: { type: Number, required: true },
    },
  ],
  shopLocation: {
    address: { type: String }, // Address of the shop
    coordinates: [{ type: Number }], // [longitude, latitude]
  },
  shopImages: [{ type: String }], // Array of shop image URLs
  bio: { type: String }, // Tailor's biography
  experience: { type: Number, required: true }, // Tailor's years of experience
  isVerified: { type: Boolean, default: false }, // Verification status of the tailor
  verificationToken: { type: String }, // Token for email verification
  rating: { type: Number }, // Tailor's overall rating
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to reviews
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("TailorProfile", TailorProfileSchema);
