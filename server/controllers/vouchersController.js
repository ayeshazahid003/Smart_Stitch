import Voucher from "../models/Voucher.js";
import User from "../models/User.js";

export const getAllVouchers = async (req, res) => {
  try {
    const tailorId = req.user._id;

    const vouchers = await Voucher.find({ tailorId });
    res.status(200).json({ success: true, vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const createVoucher = async (req, res) => {
  try {
    const { title, description, discount, validFrom, validUntil } = req.body;
    const tailorId = req.user._id;

    const user = await User.findById(tailorId);
    if (!user || user.role !== "tailor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only valid tailors can create vouchers.",
      });
    }

    const newVoucher = new Voucher({
      tailorId,
      title,
      description,
      discount,
      validFrom,
      validUntil,
    });
    const savedVoucher = await newVoucher.save();

    res.status(201).json({
      success: true,
      message: "Voucher created successfully.",
      voucher: savedVoucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tailorId = req.user._id;

    const voucher = await Voucher.findById(id);
    if (!voucher || voucher.tailorId.toString() !== tailorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only update your vouchers.",
      });
    }

    Object.assign(voucher, updates);
    const updatedVoucher = await voucher.save();

    res.status(200).json({
      success: true,
      message: "Voucher updated successfully.",
      voucher: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const tailorId = req.user._id;

    const voucher = await Voucher.findById(id);
    if (!voucher || voucher.tailorId.toString() !== tailorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete your vouchers.",
      });
    }

    await voucher.remove();

    res
      .status(200)
      .json({ success: true, message: "Voucher deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const checkVoucherIsApplicable = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found." });
    }

    const now = new Date();
    if (
      now < new Date(voucher.validFrom) ||
      now > new Date(voucher.validUntil)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Voucher is not applicable." });
    }

    res
      .status(200)
      .json({ success: true, message: "Voucher is applicable.", voucher });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getSingleVoucherDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found." });
    }

    res.status(200).json({ success: true, voucher });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const verifyVoucherByTitle = async (req, res) => {
  try {
    const { title, tailorId } = req.body;

    const voucher = await Voucher.findOne({
      title: title,
      tailorId: tailorId,
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found.",
      });
    }

    // Check if voucher is valid
    const now = new Date();
    if (
      now < new Date(voucher.validFrom) ||
      now > new Date(voucher.validUntil)
    ) {
      return res.status(400).json({
        success: false,
        message: "Voucher is not valid at this time.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Voucher is valid.",
      voucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};
