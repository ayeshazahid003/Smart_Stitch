import stripePackage from "stripe";
import Order from "../models/Order.js";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, amount, currency = "usd" } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
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
      success_url: `${process.env.CLIENT_URL}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
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
