import Offer from "../models/Offer.js";
import User from "../models/User.js";

// Create a new offer
const createOffer = async (req, res) => {
  try {
    const { tailorId, amount, description } = req.body;
    const customerId = req.user._id; // From auth middleware

    // Verify tailor exists and is actually a tailor
    console.log("Tailor ID:", tailorId);
    const tailor = await User.findOne({ _id: tailorId, role: "tailor" });
    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    const offer = new Offer({
      customer: customerId,
      tailor: tailorId,
      amount: parseFloat(amount),
      description,
      createdAt: new Date(),
    });

    await offer.save();

    console.log("Offer created:", offer);

    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get offers for a user (either as customer or tailor)
const getOffers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    const query = role === "tailor" ? { tailor: userId } : { customer: userId };
    const offers = await Offer.find(query)
      .populate("customer", "name email")
      .populate("tailor", "name email shopName")
      .sort("-createdAt");

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOffer, getOffers };
