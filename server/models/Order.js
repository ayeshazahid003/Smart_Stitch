import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in progress', 'completed', 'refunded'], required: true },
  design: {
    designImage: [{ type: String }],
    customization: {
      fabric: { type: String },
      color: { type: String },
      style: { type: String }
    }
  },
  measurement: {
    height: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number }
  },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
