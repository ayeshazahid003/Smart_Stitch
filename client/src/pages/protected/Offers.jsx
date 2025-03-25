import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { useOffers, useNegotiateOffer } from "../../hooks/offerHooks";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterOffer, setCounterOffer] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const { getOffers } = useOffers();
  const { negotiateOffer, updateOfferStatus } = useNegotiateOffer();
  const navigate = useNavigate();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers();
      setOffers(response.offers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId, amount) => {
    try {
      setIsSubmitting(true);
      await negotiateOffer(offerId, amount, "I accept this offer", true);
      await loadOffers();
      //   toast.success("Offer accepted successfully!");
    } catch (err) {
      console.error(err);
      //   toast.error(err.message || "Failed to accept offer");
    } finally {
      setIsSubmitting(false);
      setSelectedOffer(null);
    }
  };

  const handleNegotiate = async (offerId) => {
    if (!counterOffer || !message) {
      setError("Please provide both amount and message");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await negotiateOffer(
        offerId,
        parseInt(counterOffer),
        message,
        false
      );
      await loadOffers();
      setSelectedOffer(null);
      setCounterOffer("");
      setMessage("");

      // If negotiation resulted in an order
      if (response.order) {
        // toast.success("Negotiation completed and order created!");
        navigate(`/order-details/${response.order._id}`);
      } else {
        // toast.success("Counter offer sent successfully!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (offerId, status) => {
    try {
      await updateOfferStatus(offerId, status);
      await loadOffers(); // Refresh offers
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {user?.role === "tailor" ? "Customer Offers" : "My Offers to Tailors"}
      </h1>

      <div className="grid gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {user?.role === "tailor"
                    ? `From: ${offer.customer.name}`
                    : `To: ${offer.tailor.shopName}`}
                </h3>
                <p className="text-gray-600">Current Amount: ₨{offer.amount}</p>
                <p
                  className={`text-gray-600 ${
                    offer.status === "accepted"
                      ? "text-green-600"
                      : offer.status.includes("accepted_by")
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  Status: {offer.status.replace(/_/g, " ")}
                </p>
                <p className="text-gray-600">
                  Created: {formatDate(offer.createdAt)}
                </p>
                <p className="mt-2">{offer.description}</p>
              </div>

              {/* Action buttons based on role and status */}
              {(offer.status === "pending" ||
                offer.status === "negotiating" ||
                offer.status.includes("accepted_by")) && (
                <div className="space-x-2">
                  {user?.role === "tailor" ? (
                    <>
                      {!offer.status.includes("accepted_by_tailor") && (
                        <button
                          onClick={() =>
                            handleAcceptOffer(offer._id, offer.amount)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          Accept
                        </button>
                      )}
                      {!offer.status.includes("accepted") && (
                        <>
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            Counter Offer
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(offer._id, "rejected")
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            disabled={isSubmitting}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!offer.status.includes("accepted_by_customer") && (
                        <button
                          onClick={() =>
                            handleAcceptOffer(offer._id, offer.amount)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          Accept
                        </button>
                      )}
                      {!offer.status.includes("accepted") && (
                        <>
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            Counter Offer
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(offer._id, "cancelled")
                            }
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Negotiation History */}
            {offer.negotiationHistory &&
              offer.negotiationHistory.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Negotiation History</h4>
                  <div className="space-y-2">
                    {offer.negotiationHistory.map((nego, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded text-sm ${
                          nego.accepted
                            ? "bg-green-50 border border-green-100"
                            : "bg-gray-50"
                        }`}
                      >
                        <p className="font-medium">
                          {nego.by.name} - ₨{nego.amount}
                          {nego.accepted && (
                            <span className="ml-2 text-green-600">
                              ✓ Accepted
                            </span>
                          )}
                        </p>
                        <p className="text-gray-600">{nego.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(nego.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Show final details if offer is accepted */}
            {offer.status === "accepted" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800">
                  Offer Accepted!
                </h4>
                <p className="text-green-700">
                  Final Amount: ₨{offer.finalAmount}
                </p>
                {offer.orderId && (
                  <button
                    onClick={() => navigate(`/order-details/${offer.orderId}`)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    View Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Negotiation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Make Counter Offer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Explain your counter offer"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleNegotiate(selectedOffer._id)}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Send Counter Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
