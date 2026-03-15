import express from 'express';
import Stripe from 'stripe';
import Order from '../../../models/Order.js'; 
import Product from '../../../models/Product.js'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Handles POST to http://localhost:5000/external-api/checkout
router.post('/', async (req, res) => {
  try {
    const { cartItems, checkoutData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 1. Prepare Line Items
    const line_items = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item._id || item.id);
      
      // Use DB price for security, fallback to request body
      const actualPrice = product ? (product.newPrice || product.price) : (item.newPrice || item.price);
      
      const itemImage = item.image || (item.images && item.images[0]);
      const validImages = (itemImage && itemImage.startsWith('http')) ? [itemImage] : [];

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: validImages,
            metadata: {
              productId: item._id || item.id,
              size: item.selectedSize || 'Standard',
            },
          },
          unit_amount: Math.round(actualPrice * 100), 
        },
        quantity: item.quantity || 1,
      };
    }));

    // 2. Add Shipping & Tax (Matches your 10% Frontend logic)
    const subtotal = cartItems.reduce((acc, item) => 
      acc + (parseFloat(item.newPrice || item.price) * (item.quantity || 1)), 0
    );
    const taxAmount = subtotal * 0.1;

    // Add Shipping Item
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: `Shipping: ${checkoutData.deliveryType.toUpperCase()}` },
        unit_amount: Math.round(checkoutData.shippingCost * 100),
      },
      quantity: 1,
    });

    // Add Tax Item
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: "Estimated Tax (10%)" },
        unit_amount: Math.round(taxAmount * 100),
      },
      quantity: 1,
    });

    // 3. Create Stripe Checkout Session
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], 
      line_items,
      mode: 'payment',
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      customer_email: checkoutData.email || undefined,
      // Metadata allows us to recover this data in webhooks
      metadata: {
        fullName: checkoutData.fullName,
        orderId: `ORD-${Date.now()}`
      }
    });

    // 4. Create "Pending" Order in DB
    const newOrder = await Order.create({
      items: cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.newPrice || item.price,
        selectedSize: item.selectedSize,
        image: item.image || (item.images && item.images[0])
      })),
      shippingDetails: {
        fullName: checkoutData.fullName,
        address: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.postcode,
        phone: checkoutData.phone,
      },
      deliveryType: checkoutData.deliveryType,
      subtotal: subtotal,
      tax: taxAmount,
      shipping: checkoutData.shippingCost || 0,
      total: session.amount_total / 100,
      paymentMethod: checkoutData.paymentMethod,
      stripeSessionId: session.id,
      status: 'pending'
    });

    // Send Stripe URL to trigger the redirect on frontend
    res.status(200).json({ url: session.url, orderId: newOrder._id });

  } catch (error) {
    console.error('❌ Stripe Session Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
});

export default router;