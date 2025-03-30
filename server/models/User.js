import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const MeasurementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  data: {
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
      ankle: { type: Number },
    },
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "tailor"], required: true },
  profilePicture: { type: String },
  contactInfo: {
    phone: { type: String },
    address: AddressSchema,
  },
  measurements: [MeasurementSchema],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
