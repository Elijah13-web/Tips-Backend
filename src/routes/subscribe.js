import express from 'express';
import nodemailer from 'nodemailer';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ajiboyeelijah242@gmail.com',
    pass: 'ajiboye'
  }
});

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    // Save to MongoDB (ignore duplicate)
    const existing = await Subscriber.findOne({ email });
    if (!existing) {
      await Subscriber.create({ email });
      console.log(`✅ Saved to DB: ${email}`);
    }

    // Send notification to you
    await transporter.sendMail({
      from: '"Newsletter Bot" <YOUR_EMAIL@gmail.com>',
      to: 'YOUR_EMAIL@gmail.com',
      subject: 'New Newsletter Subscriber!',
      html: `<p>New subscriber: <strong>${email}</strong></p>`
    });

    // Send thank you email to user
    await transporter.sendMail({
      from: '"Triumphant Newsletter" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: 'Thank you for subscribing!',
      html: `<p>Hi there! 👋<br/>Thank you for subscribing to our newsletter. We'll keep you updated!</p>`
    });

    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.json({ success: false, message: 'Failed to subscribe' });
  }
});

export default router;
