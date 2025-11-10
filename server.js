import fs from 'fs';
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import subscribeRoute from './src/routes/subscribe.js';
import applicationRoute from './src/routes/application.js';
import sendEmail from './src/utils/sendEmail.js';

dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// 🕒 Log requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`📡 ${req.method} ${req.originalUrl} -> ${res.statusCode} [${Date.now() - start}ms]`);
  });
  next();
});

// ✅ MongoDB Connection
console.time('⏱️ MongoDB connection time');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.timeEnd('⏱️ MongoDB connection time');
    console.log('✅ MongoDB connected');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/subscribe', subscribeRoute);
app.use('/api/apply', applicationRoute);

// Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello from Tips backend!' });
});

// 🧪 Email test endpoint
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail(process.env.ADMIN_EMAIL, 'Test Email', '<p>This is a test email from Tips backend.</p>');
    res.send('✅ Email sent successfully');
  } catch (err) {
    console.error('❌ Email test failed:', err);
    res.status(500).send('❌ Email failed: ' + err.message);
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
