import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'tailor'], required: true },
  profilePicture: { type: String },
  contactInfo: {
    phone: { type: String },
    address: { type: String }
  },
  measurements: {
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
