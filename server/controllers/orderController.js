import Order from '../models/Order.js';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create a new order and return Stripe Checkout URL
 * @route   POST /external-api/checkout (or wherever your route points)
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { cartItems, checkoutData } = req.body;

    // 1️⃣ Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: "No items in cart" });
    }

    const userId = req.user?._id || req.user?.id; 

    // 2️⃣ Prepare Stripe Line Items (The "Money" Part)
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          // Stripe requires absolute URLs for images. Using fallback if missing.
          images: item.image ? [item.image] : [], 
        },
        // Stripe uses cents (e.g., $10.00 must be 1000)
        unit_amount: Math.round((item.newPrice || item.price) * 100), 
      },
      quantity: item.quantity || 1,
    }));

    // Add Shipping as a line item if applicable
    if (checkoutData.shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Shipping: ${checkoutData.deliveryType || 'Standard'}` },
          unit_amount: Math.round(checkoutData.shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // 3️⃣ Create the Stripe Checkout Session
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Add "paypal" here if set up in Stripe Dash
      mode: "payment",
      line_items,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      customer_email: checkoutData.email,
      metadata: {
        userId: userId?.toString(),
      }
    });

    // 4️⃣ Map data for your MongoDB Order
    const formattedItems = cartItems.map((item) => ({
      productId: item._id || item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.newPrice || item.price, 
      image: item.image || (item.images && item.images[0]),
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
      subtotal: checkoutData.subtotal || 0,
      tax: checkoutData.tax || 0,
      shipping: checkoutData.shippingCost || 0,
      total: checkoutData.total || 0,
      deliveryType: checkoutData.deliveryType || 'standard',
      stripeSessionId: session.id, // Save this to verify payment later
      status: 'pending' 
    });

    const savedOrder = await order.save();

    // 5️⃣ THE CRITICAL FIX: Send the session.url to the frontend
    // This breaks the loop and sends the user to the payment screen
    res.status(201).json({ 
      success: true, 
      orderId: savedOrder._id,
      url: session.url, 
      message: "Payment session created successfully" 
    });

  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get logged-in user's orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id || req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/**
 * @desc    Track order status
 */
export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};