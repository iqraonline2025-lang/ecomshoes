import express from 'express';
import { Order } from '../../../models/Order.js'; // Adjust path based on your folder
import { Product } from '../../../models/Product.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { cartItems, checkoutData } = req.body;
    const promoCode = checkoutData?.promoCode || "";

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    let subtotal = 0;
    const validatedItems = await Promise.all(
      cartItems.map(async (item) => {
        const dbProduct = await Product.findById(item._id || item.id);
        if (!dbProduct) throw new Error(`Product ${item.name} not found`);

        // Use the actual DB price (Security Check)
        const price = dbProduct.newPrice || dbProduct.price;
        subtotal += price * item.quantity;

        return {
          productId: dbProduct._id,
          name: dbProduct.name,
          quantity: item.quantity,
          price: price,
          selectedSize: item.selectedSize,
          image: dbProduct.image || (dbProduct.images && dbProduct.images[0])
        };
      })
    );

    // Calculate Costs (Matching your Frontend logic)
    const tax = subtotal * 0.08;
    const shipping = checkoutData.shippingCost || (subtotal > 150 ? 0 : 15);
    const discount = promoCode.toUpperCase() === 'WELCOME10' ? subtotal * 0.1 : 0;
    const total = subtotal + tax + shipping - discount;

    // Create the Order in MongoDB
    const newOrder = await Order.create({
      items: validatedItems,
      shippingDetails: {
        fullName: checkoutData.fullName,
        address: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.postcode,
        phone: checkoutData.phone,
      },
      deliveryType: checkoutData.deliveryType,
      paymentMethod: checkoutData.paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending' // Moves to 'paid' via the Webhook later
    });

    res.status(200).json({ 
      success: true, 
      orderId: newOrder._id,
      totalAmount: total 
    });

  } catch (error) {
    console.error("❌ Validation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;