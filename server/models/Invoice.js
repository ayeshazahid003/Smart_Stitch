import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  details: {
    serviceCost: { type: Number },
    customizationCost: { type: Number },
    extraServicesCost: { type: Number },
    deliveryCost: { type: Number }
  },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', InvoiceSchema);
