import Order from '../models/Order.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';

// ✅ FIX 1: Provide a fallback string to prevent the "Neither apiKey..." crash on boot
// This allows the server to start even if the .env hasn't loaded yet.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Helper: Convert any price input into a clean number
 */
const cleanPrice = (priceInput) => {
  if (typeof priceInput === 'number') return priceInput;
  const cleaned = String(priceInput).replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
};

/**
 * @desc    Create a new order and return Stripe Checkout URL
 */
export const createOrder = async (req, res) => {
  // ✅ FIX 2: Check for the key INSIDE the function before calling Stripe
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "") {
    console.error("❌ ERROR: STRIPE_SECRET_KEY is missing from .env");
    return res.status(500).json({ 
      success: false, 
      error: "Payment gateway not configured. Please check server .env" 
    });
  }

  // DEBUG LINE
  console.log("DEBUG: Stripe Key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 7));

  try {
    const { cartItems, checkoutData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: "Your cart is empty" });
    }

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "User authentication failed" });
    }

    const line_items = cartItems.map((item) => {
      const price = cleanPrice(item.newPrice || item.price);
      
      // Stripe crashes if images are not absolute URLs (http/https)
      const isValidImageUrl = typeof item.image === 'string' && item.image.startsWith('http');
      const stripeImages = isValidImageUrl ? [item.image] : [];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: stripeImages,
          },
          unit_amount: Math.round(price * 100), 
        },
        quantity: item.quantity || 1,
      };
    });

    const shippingAmount = cleanPrice(checkoutData.shippingCost);
    if (shippingAmount > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: `Shipping: ${checkoutData.deliveryType?.toUpperCase() || 'STANDARD'}` 
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      customer_email: checkoutData.email || req.user?.email,
      metadata: {
        userId: userId.toString(),
      }
    });

    const formattedItems = cartItems.map((item) => ({
      productId: String(item.id || item._id),
      name: item.name,
      quantity: item.quantity || 1,
      price: cleanPrice(item.newPrice || item.price),
      image: item.image,
      size: item.selectedSize || 'Standard'
    }));

    const order = new Order({
      userId: userId,
      items: formattedItems,
      shippingDetails: {
        fullName: checkoutData.fullName,
        address: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.postcode,
        phone: checkoutData.phone,
      },
      subtotal: cleanPrice(checkoutData.subtotal),
      tax: cleanPrice(checkoutData.tax),
      shipping: shippingAmount,
      total: cleanPrice(checkoutData.total),
      deliveryType: checkoutData.deliveryType || 'standard',
      stripeSessionId: session.id,
      status: 'pending'
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      url: session.url,
      message: "Checkout session created"
    });

  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    });
  }
};

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

export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("❌ Track Order Error:", error);
    res.status(500).json({ success: false, message: "Server error while tracking order" });
  }
};