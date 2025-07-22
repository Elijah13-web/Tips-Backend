import express from 'express';
import Application from '../models/Application.js';
// import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { phone, email } = req.body;
  if (!phone || !email) {
    return res.status(400).json({ success: false, message: "Phone and email are required" });
  }
  try {
    const newApp = new Application({ phone, email });
    await newApp.save();

    // await sendEmail(...) if you want

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error('Application submit error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
