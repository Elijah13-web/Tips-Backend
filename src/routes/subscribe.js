import express from 'express';
import Subscriber from '../models/Subscriber.js'; // your Mongoose model
import sendEmail from '../utils/sendEmail.js';   // your function to send email

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already subscribed" });
    }

    // Save to DB
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send confirmation email
    await sendEmail(
      email,
      "Thanks for subscribing!",
      "You have successfully subscribed to our newsletter."
    );

    res.json({ success: true, message: "Subscription successful" });
  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
