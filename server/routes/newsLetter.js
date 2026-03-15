import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    
    res.status(201).json({ 
      message: "Welcome to the squad! 15% discount code: WELCOME15" 
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "You're already on the list!" });
    }
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;