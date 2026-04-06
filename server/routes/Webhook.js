import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ FIX: Initialize Stripe inside a helper or check for the key immediately
// This prevents the "Neither apiKey nor config.authenticator provided" crash
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ CRITICAL: STRIPE_SECRET_KEY is missing in .env");
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/", async (req, res) => {
  const stripe = getStripe();
  
  if (!stripe) {
    return res.status(500).json({ error: "Stripe configuration missing" });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ⚠️ IMPORTANT: req.body must be the RAW buffer for signature verification
    // In your server.js, ensure you use express.raw() for this specific route
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Stripe events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(`💰 Payment successful for session: ${session.id}`);

      try {
        const updatedOrder = await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            status: "paid",
            customerEmail: session.customer_details?.email,
            paidAt: new Date(),
          },
          { new: true }
        );

        if (!updatedOrder) {
          console.warn(`⚠️ Order with session ${session.id} not found`);
        } else {
          console.log(`✅ Order ${updatedOrder._id} marked as PAID`);
        }
      } catch (dbError) {
        console.error("❌ Database update failed:", dbError);
        return res.status(500).json({ error: "Database update failed" });
      }
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

export default router;