import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  items: [{
    // Ensure this matches the controller's 'formattedItems'
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: String, default: 'Standard' }, // Renamed from selectedSize to size to match controller
    image: { type: String }
  }],
  shippingDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  deliveryType: { 
    type: String, 
    enum: ['standard', 'express'], 
    default: 'standard' 
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  },
  paymentMethod: { type: String, default: 'Stripe' },
  stripeSessionId: { type: String, unique: true, sparse: true },
  customerEmail: { type: String },
  paidAt: { type: Date }
}, { 
  timestamps: true 
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;