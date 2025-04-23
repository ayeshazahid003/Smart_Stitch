import stripePackage from "stripe";
import Order from "../models/Order.js";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, amount, currency = "pkr" } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: amount, // amount should be in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        orderId: orderId, // Store orderId in metadata for webhook processing
      },
      success_url: `${process.env.CLIENT_URL}/order-placed?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/order-cancelled`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Get the order ID from metadata
      const orderId = session.metadata.orderId;

      // Update the order status to completed
      const order = await Order.findByIdAndUpdate(orderId, {
        status: "completed",
        paymentStatus: "paid",
        paymentDetails: {
          stripeSessionId: session.id,
          paymentIntent: session.payment_intent,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency,
        },
      });
      console.error(order);
    } catch (error) {
      console.error("Error processing payment completion:", error);
      return res.status(500).send("Error updating order status");
    }
  }

  res.json({ received: true });
};

export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if payment was successful
    const isPaymentSuccessful = session.payment_status === "paid";

    if (isPaymentSuccessful) {
      // You might want to update order status here if it wasn't already updated by webhook
      if (session.metadata.orderId) {
        const order = await Order.findById(session.metadata.orderId);
        if (order && order.status !== "paid") {
          await Order.findByIdAndUpdate(session.metadata.orderId, {
            status: "paid",
            paymentStatus: "paid",
            paymentDetails: {
              stripeSessionId: session.id,
              paymentIntent: session.payment_intent,
              paymentStatus: session.payment_status,
              amountTotal: session.amount_total,
              currency: session.currency,
            },
          });
        }
      }

      return res.json({
        success: true,
        message: "Payment verified successfully",
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
        },
      });
    }

    return res.json({
      success: false,
      message: "Payment not completed",
      session: {
        id: session.id,
        payment_status: session.payment_status,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment session",
      error: error.message,
    });
  }
};
