import Order from '../models/Order.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// --- Email Configuration ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// --- Helper: Clean Prices ---
const cleanPrice = (priceInput) => {
  if (typeof priceInput === 'number') return priceInput;
  const cleaned = String(priceInput).replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
};

/**
 * 1. Create Order & Send Email
 */
export const createOrder = async (req, res) => {
  try {
    const { cartItems, checkoutData } = req.body;
    const userId = req.user?._id || req.user?.id;

    // Use NEXT_PUBLIC_FRONTEND_URL for Stripe redirects
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    // Prepare Stripe Line Items
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(cleanPrice(item.newPrice || item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      customer_email: checkoutData.email || req.user?.email,
    });

    // --- SAVE TO MONGODB (Matched to your OrderSchema) ---
    const order = new Order({
      userId,
      items: cartItems.map(item => ({
        productId: String(item.id || item._id),
        name: item.name,
        quantity: item.quantity || 1,
        price: cleanPrice(item.newPrice || item.price),
        size: item.size || 'Standard',
        image: item.image || ''
      })),
      shippingDetails: {
        fullName: checkoutData.fullName,
        address: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.postcode,
        phone: checkoutData.phone,
      },
      deliveryType: checkoutData.deliveryType || 'standard',
      subtotal: cleanPrice(checkoutData.subtotal || checkoutData.total), 
      shipping: cleanPrice(checkoutData.shippingCost || 0),             
      total: cleanPrice(checkoutData.total),                            
      tax: cleanPrice(checkoutData.tax || 0),
      stripeSessionId: session.id,
      customerEmail: checkoutData.email || req.user?.email,
      status: 'pending',
      paymentMethod: 'Stripe'
    });

    const savedOrder = await order.save();

    // Send Confirmation Email
    const targetEmail = checkoutData.email || req.user?.email;
    if (targetEmail) {
      try {
        await transporter.sendMail({
          from: `"Road Kicks" <${process.env.EMAIL_USER}>`,
          to: targetEmail,
          subject: `Order Confirmed - #${savedOrder._id.toString().toUpperCase().slice(-6)}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #000;">THANK YOU FOR YOUR ORDER</h2>
              <p>Hi ${checkoutData.fullName || 'Customer'},</p>
              <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000;">
                <p><strong>Estimated Delivery:</strong> Your order will be received in <strong>3 weeks</strong>.</p>
              </div>
              <p>Order ID: #${savedOrder._id}</p>
            </div>
          `
        });
      } catch (err) {
        console.error("⚠️ Email failed to send.");
      }
    }

    res.status(201).json({ url: session.url });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 2. Get User's Order History
 */
export const getMyOrders = async (req, res) => {
  try {
    const id = req.user?._id || req.user?.id;
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/**
 * 3. Track Specific Order
 * Supports both MongoDB ObjectId and Stripe Session ID (cs_test_...)
 */
export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    let order;

    // First: Try searching by MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }

    // Second: If not found, try searching by Stripe Session ID
    if (!order) {
      order = await Order.findOne({ stripeSessionId: orderId });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("❌ Tracking Error:", error);
    res.status(500).json({ success: false, message: "Tracking error" });
  }
};