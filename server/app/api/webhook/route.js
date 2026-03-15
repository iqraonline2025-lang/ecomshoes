import express from 'express';
import Stripe from 'stripe';
import Order from '../../../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const router = express.Router();

// NOTE: We use express.raw so Stripe can verify the payload signature accurately
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // This is where the security magic happens
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook Signature Failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the specific event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log(`💰 Payment confirmed for session: ${session.id}`);

    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        { 
          status: 'paid', 
          customerEmail: session.customer_details?.email,
          paidAt: new Date() // Record the payment time
        },
        { new: true } // Returns the updated document
      );

      if (!updatedOrder) {
        console.error(`⚠️ Order with session ${session.id} not found in DB.`);
      } else {
        console.log(`✅ Order ${updatedOrder._id} marked as PAID.`);
      }
      
    } catch (dbError) {
      console.error('❌ Database update failed:', dbError);
      return res.status(500).json({ error: 'DB Update Failed' });
    }
  }

  // Return a 200 to Stripe to let them know you received it
  res.status(200).json({ received: true });
});

export default router;