import mongoose from 'mongoose';

const TailorProfileSchema = new mongoose.Schema({
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolio: [
    {
      images: [{ type: String, required: true }], // Array of image URLs
      description: { type: String }, // Description of the portfolio entry
      date: { type: Date, required: true } // Date when the portfolio was added
    }
  ],
  serviceRates: [
    {
      type: { type: String, required: true }, // Service type
      description: { type: String, required: true }, // Description of the service
      price: { type: Number, required: true }, // Price of the service
      image: { type: String, required: true } // Image URL for the service
    }
  ],
  extraServices: [
    {
      serviceName: { type: String, required: true }, // Name of the extra service
      description: { type: String, required: true }, // Description of the extra service
      price: { type: Number, required: true } // Price of the extra service
    }
  ],
  shopLocation: {
    address: { type: String }, // Address of the shop
    coordinates: [{ type: Number }] // [longitude, latitude]
  },
  shopImages: [{ type: String }], // Array of shop image URLs
  isVerified: { type: Boolean, default: false }, // Verification status of the tailor
  rating: { type: Number }, // Tailor's overall rating
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Reference to reviews
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('TailorProfile', TailorProfileSchema);
