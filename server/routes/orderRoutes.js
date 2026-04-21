import express from 'express';
import { 
  getOrderTracking, 
  getMyOrders, 
  createOrder 
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

/**
 * @route   POST /api/orders/checkout (or /external-api/checkout)
 * @desc    Process information, create Stripe session, and send email
 * @access  Private
 */
router.post('/checkout', protect, createOrder);

/**
 * @route   GET /api/orders/myorders
 * @desc    Get order history for logged-in user
 * @access  Private
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @route   GET /api/orders/track/:orderId
 * @desc    Track order status (Public)
 * @access  Public
 */
router.get('/track/:orderId', getOrderTracking);

export default router;