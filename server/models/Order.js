import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }, // Reference to the applied voucher
  status: { type: String, enum: ['pending', 'in progress', 'completed', 'refunded'], required: true },
  design: {
    designImage: [{ type: String }], 
    customization: {
      fabric: { type: String },
      color: { type: String },
      style: { type: String },
      description: { type: String },
    },
    media: [
      {
        type: { type: String, enum: ['video', 'voicenote'], required: true },
        url: { type: String, required: true },
        description: { type: String }
      }
    ]
  },
  measurement: {
    height: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    shoulder: { type: Number },
    wrist: { type: Number },
    sleeves: { type: Number },
    neck: { type: Number },
    lowerBody: {
      length: { type: Number },
      waist: { type: Number },
      inseam: { type: Number },
      thigh: { type: Number },
      ankle: { type: Number }
    }
  },
  utilizedServices: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'TailorProfile.serviceRates', required: true },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  extraServices: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'TailorProfile.extraServices', required: true },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
