import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  discount: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Voucher', VoucherSchema);
