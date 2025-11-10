import express from 'express';
import multer from 'multer';
import path from 'path';
import Application from '../models/Application.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// ✅ Multer setup — handles file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/* ===========================================================
   📨  APPLICATION SUBMISSION ROUTE
   Handles: phone, email, and optional file upload
   Saves to MongoDB and sends an admin email
=========================================================== */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone and email are required',
      });
    }

    // Save uploaded file path (if exists)
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Save application in MongoDB
    const newApp = new Application({ phone, email, file: filePath });
    await newApp.save();

    // ✅ Build email content
    const emailBody = `
      <h3>📩 New Application Received</h3>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      ${filePath ? `<p><b>Uploaded File:</b> <a href="${filePath}">${filePath}</a></p>` : ''}
    `;

    // ✅ Send admin notification email (with file if available)
    const absoluteFilePath = filePath ? path.resolve(`.${filePath}`) : null;
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Application Received',
      emailBody,
      absoluteFilePath
    );

    res.json({
      success: true,
      message: 'Application submitted successfully',
      file: filePath,
    });
  } catch (error) {
    console.error('❌ Application submit error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* ===========================================================
   👀  ADMIN ROUTE TO VIEW ALL APPLICATIONS
   Access: /api/apply/all?adminKey=YOUR_KEY
   Protects route using ADMIN_KEY in .env
=========================================================== */
router.get('/all', async (req, res) => {
  try {
    const { adminKey } = req.query;

    // 🔐 Security check
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('❌ Fetch applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
