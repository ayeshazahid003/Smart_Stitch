import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import { MessageCircle, Plus, X } from "lucide-react";
import { getTailorById } from "../../hooks/TailorHooks";
import { getOrdersByUser } from "../../hooks/orderHooks";
import {
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../../hooks/reviewHooks";
import { useParams, useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

export default function TailorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // State to store tailor data fetched from API
  const [tailor, setTailor] = useState(null);
  // State for reviews
  const [reviews, setReviews] = useState([]);
  // State to check if user can add a review (has a delivered order)
  const [canAddReview, setCanAddReview] = useState(false);
  // State to track if user has already submitted a review
  const [userReview, setUserReview] = useState(null);
  // State to track which order can be reviewed
  const [reviewableOrderId, setReviewableOrderId] = useState(null);

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state to filter items in the profile
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tailor data when `id` changes
  useEffect(() => {
    if (!id) return;

    async function fetchTailor() {
      const response = await getTailorById(id);
      console.log("Tailor API response:", response);

      // If API returns success, store it in state
      if (response.success && response.tailorData) {
        setTailor(response.tailorData);
      }
    }

    fetchTailor();
  }, [id]);

  // Fetch all reviews for this tailor
  useEffect(() => {
    if (!id) return;

    async function fetchReviews() {
      const response = await getAllReviews(id);
      if (response.success && response.reviews) {
        setReviews(response.reviews);

        // Check if user has already submitted a review
        if (user) {
          const existingReview = response.reviews.find(
            (review) => review.customerId._id === user._id
          );

          if (existingReview) {
            setUserReview(existingReview);
          }
        }
      }
    }

    fetchReviews();
  }, [id, user]);

  // Check if user has any delivered orders with this tailor
  useEffect(() => {
    if (!user || !id) return;

    async function checkUserOrders() {
      const response = await getOrdersByUser();
      if (response.success && response.orders) {
        // Find orders with this tailor that have status "delivered"
        const deliveredOrder = response.orders.find(
          (order) => order.tailorId._id === id && order.status === "delivered"
        );

        if (deliveredOrder) {
          setCanAddReview(true);
          setReviewableOrderId(deliveredOrder._id);
        }
      }
    }

    checkUserOrders();
  }, [user, id]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reviewData = {
        orderId: reviewableOrderId,
        tailorId: id,
        rating: reviewRating,
        comment: reviewComment,
      };

      let response;
      if (isEditMode && userReview) {
        response = await updateReview(userReview._id, reviewData);
      } else {
        response = await addReview(reviewData);
      }

      if (response.success) {
        toast.success(
          isEditMode
            ? "Review updated successfully"
            : "Review added successfully"
        );

        // Refresh reviews
        const updatedReviews = await getAllReviews(id);
        if (updatedReviews.success) {
          setReviews(updatedReviews.reviews);

          // Update user review reference
          if (user) {
            const newUserReview = updatedReviews.reviews.find(
              (review) => review.customerId._id === user._id
            );
            setUserReview(newUserReview);
          }
        }

        // Close form and reset
        setShowReviewForm(false);
        setReviewRating(5);
        setReviewComment("");
        setIsEditMode(false);
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a review
  const handleEditReview = () => {
    if (userReview) {
      setReviewRating(userReview.rating);
      setReviewComment(userReview.comment);
      setIsEditMode(true);
      setShowReviewForm(true);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async () => {
    if (!userReview) return;

    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        const response = await deleteReview(userReview._id);
        if (response.success) {
          toast.success("Review deleted successfully");

          // Refresh reviews
          const updatedReviews = await getAllReviews(id);
          if (updatedReviews.success) {
            setReviews(updatedReviews.reviews);
            setUserReview(null); // User no longer has a review
          }
        } else {
          toast.error(response.message || "Failed to delete review");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the review");
      }
    }
  };

  // Rating stars component
  const RatingStars = ({ rating, setRating, editable = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${
              star <= (editable ? rating : rating)
                ? "text-yellow-500"
                : "text-gray-300"
            } text-xl cursor-${editable ? "pointer" : "default"} mr-1`}
            onClick={() => editable && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const handleChatClick = () => {
    // Navigate with state
    navigate("/chats", {
      state: {
        id: id,
        name: tailor.name,
        avatar: tailor.profilePicture,
      },
    });
  };

  // If data has not yet loaded, show a loading indicator
  if (!tailor) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading tailor profile...</p>
      </div>
    );
  }

  // Make sure these properties exist on `tailor` or default them to empty arrays:
  const portfolio = tailor.portfolio || [];
  const serviceRates = tailor.serviceRates || [];

  // ----- SEARCH FILTERS -----
  // Filter portfolio items based on name or description
  const filteredPortfolio = portfolio.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter services based on type or description
  const filteredServices = serviceRates.filter(
    (service) =>
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter reviews based on comment or user name
  const filteredReviews = reviews.filter(
    (review) =>
      (review.customerId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (review.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----- RENDER -----
  return (
    <motion.div
      className="bg-gray-50 min-h-screen relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${tailor.shopImages?.[0] || ""})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold">{tailor.shopName}</h1>
          {/* Show the tailor's name in a nice subheading */}
          <p className="mt-2 text-xl italic font-light">
            Owned by {tailor.name}
          </p>
          <p className="text-lg mt-2 flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" />
            {tailor.shopLocation}
          </p>
          <p className="text-lg mt-4 max-w-2xl mx-auto">{tailor.bio}</p>
        </div>

        {/* Profile Picture with absolute positioning */}
        <img
          src={tailor.profilePicture}
          alt="Profile"
          className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search in profile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Portfolio Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Portfolio
          </h2>
          {filteredPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolio.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.images?.[0] || ""}
                    alt={item.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No portfolio items found.
            </p>
          )}
        </section>

        {/* Services & Pricing Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Services & Rates
          </h2>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={service.image || ""}
                    alt={service.type}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">
                      {service.type}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-indigo-600 font-bold text-xl">
                      {/* Showing the min - max in PKR */}
                      PKR {service.minPrice} - {service.maxPrice}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No services found.</p>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800">
              Customer Reviews
            </h2>

            {/* Add Review Button - Only show if user can review */}
            {canAddReview && !userReview && !showReviewForm && user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReviewForm(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Review
              </motion.button>
            )}

            {/* User's review management buttons */}
            {userReview && !showReviewForm && user && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditReview}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Review
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteReview}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete Review
                </motion.button>
              </div>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {isEditMode ? "Edit Your Review" : "Add a Review"}
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <RatingStars
                    rating={reviewRating}
                    setRating={setReviewRating}
                    editable={true}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Share your experience with this tailor..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEditMode
                    ? "Update Review"
                    : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}

          {/* Overall Rating */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-4xl font-bold text-gray-800">
                    {(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-lg text-gray-600">/5</span>
                </div>
                <div>
                  <RatingStars
                    rating={Math.round(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length
                    )}
                  />
                  <p className="text-gray-600 mt-1">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Display */}
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review._id}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 ${
                    user && review.customerId._id === user._id
                      ? "border-2 border-indigo-500"
                      : ""
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <RatingStars rating={review.rating} />
                      <span className="ml-2 text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user && review.customerId._id === user._id && (
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        Your Review
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">"{review.comment}"</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold mr-2">
                      {review.customerId.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {review.customerId.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No reviews found. Be the first to review!
            </p>
          )}
        </section>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleChatClick}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
}
