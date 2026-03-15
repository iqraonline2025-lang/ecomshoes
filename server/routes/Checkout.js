import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", protect, async (req, res) => {
  try {
    const { cartItems, checkoutData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 1️⃣ Prepare Line Items
    const line_items = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id || item.id).catch(() => null);
        const actualPrice = product?.newPrice || product?.price || item.newPrice || item.price || 0;
        const image = item.image || (Array.isArray(item.images) ? item.images[0] : null);
        const validImages = image && image.startsWith("http") ? [image] : [];

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: validImages,
              metadata: {
                productId: (item._id || item.id).toString(),
                size: item.selectedSize || "Standard",
              },
            },
            unit_amount: Math.round(actualPrice * 100),
          },
          quantity: item.quantity || 1,
        };
      })
    );

    // 2️⃣ Shipping & Tax Calculation
    const subtotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.newPrice || item.price || 0);
      return acc + (price * (item.quantity || 1));
    }, 0);

    const taxAmount = subtotal * 0.08; // Matched your 8% from frontend
    const shippingCost = parseFloat(checkoutData.shippingCost || 0);

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Shipping: ${checkoutData.deliveryType || "Standard"}` },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Sales Tax" },
        unit_amount: Math.round(taxAmount * 100),
      },
      quantity: 1,
    });

    // 3️⃣ Create Stripe Session with ALL Payment Methods
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      // 🚨 FIX: Using automatic_payment_methods instead of payment_method_types: ["card"]
      // This enables Card, Apple Pay, Google Pay, and PayPal (if enabled in dashboard)
      automatic_payment_methods: {
        enabled: true,
      },
      mode: "payment",
      line_items,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      customer_email: checkoutData.email || req.user?.email,
      metadata: {
        fullName: checkoutData.fullName,
        userId: req.user?._id?.toString() || "guest",
      },
    });

    // 4️⃣ Save Order in Database
    const total = subtotal + taxAmount + shippingCost;

    const newOrder = await Order.create({
      userId: req.user?._id || null,
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.newPrice || item.price,
        selectedSize: item.selectedSize,
        image: item.image || (item.images && item.images[0]),
      })),
      shippingDetails: {
        fullName: checkoutData.fullName,
        address: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.postcode,
        phone: checkoutData.phone,
      },
      deliveryType: checkoutData.deliveryType,
      subtotal,
      tax: taxAmount,
      shipping: shippingCost,
      total,
      paymentMethod: checkoutData.paymentMethod || "stripe",
      stripeSessionId: session.id,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      url: session.url, 
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("❌ Stripe Session Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;