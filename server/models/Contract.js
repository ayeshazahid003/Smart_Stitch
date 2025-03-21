import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'TailorProfile.serviceRates', required: true },
      serviceName: { type: String, required: true },
      customerProposedPrice: { type: Number, required: true },
      tailorProposedPrice: { type: Number, required: true },
      finalAgreedPrice: { type: Number }
    }
  ],
  extraServices: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'TailorProfile.extraServices', required: true },
      serviceName: { type: String, required: true },
      customerProposedPrice: { type: Number, required: true },
      tailorProposedPrice: { type: Number, required: true },
      finalAgreedPrice: { type: Number }
    }
  ],
  negotiation: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['pending', 'negotiating', 'agreed', 'rejected', 'converted-to-order'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contract', ContractSchema);
