import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📩 /subscribe hit with body:", req.body);
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    await sendEmail(
      email,
      "🎉 Welcome to TIPS Newsletter",
      `<h2>Hi there!</h2><p>Thank you for subscribing to the TIPS Newsletter.</p><p>You’ll now receive the latest news and updates.</p>`
    );

    console.log("✅ Subscription email sent to:", email);
    res.json({ success: true, message: "Subscribed successfully." });
  } catch (error) {
    console.error("🔥 Subscribe route error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again later.",
    });
  }
});

export default router;
