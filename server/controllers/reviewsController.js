import Review from "../models/Review.js";
import TailorProfile from "../models/TailorProfile.js";
import Order from "../models/Order.js";



export const addReview = async (req, res) => {
  try {
    const { orderId, tailorId, rating, comment } = req.body;
    const customerId = req.user._id;

    // Check if the customer has an order with the particular tailor
    const order = await Order.findOne({ _id: orderId, customerId, tailorId });
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review a tailor if you have an order with them.",
      });
    }

    // Ensure rating is a valid number before proceeding
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating. Please provide a rating between 1 and 5.",
      });
    }

    // Create a new review
    const review = new Review({
      orderId,
      customerId,
      tailorId,
      rating,
      comment,
    });
    const savedReview = await review.save();

    // Update tailor profile with the new review
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    // Ensure the profile rating calculation is valid
    const totalReviews = tailorProfile.reviews.length + 1;
    
    const newRating = (
      (tailorProfile.rating * tailorProfile.reviews.length + rating) /
      totalReviews
    ).toFixed(2); // Keep the rating to 2 decimal places


    console.log("New rating calculated:", newRating);

    tailorProfile.reviews.push(savedReview._id);
    tailorProfile.rating = Number(newRating); // Ensure rating is a number


    await tailorProfile.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    if (review.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this review.",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { tailorId } = req.query;
    const reviews = tailorId
      ? await Review.find({ tailorId }).populate("customerId", "name email")
      : await Review.find().populate("customerId", "name email");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting review with ID:", id);

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    if (review.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review.",
      });
    }

    const tailorProfile = await TailorProfile.findOne({
      tailorId: review.tailorId,
    });
    if (tailorProfile) {
      tailorProfile.reviews = tailorProfile.reviews.filter(
        (reviewId) => reviewId.toString() !== id.toString()
      );
      if (tailorProfile.reviews.length === 0) {
        tailorProfile.rating = 0;
      } else {
        const remainingReviews = await Review.find({
          _id: { $in: tailorProfile.reviews },
        });
        const totalRating = remainingReviews.reduce(
          (sum, rev) => sum + rev.rating,
          0
        );
        tailorProfile.rating = (totalRating / remainingReviews.length).toFixed(
          2
        );
      }
      await tailorProfile.save();
    }

    await review.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};
