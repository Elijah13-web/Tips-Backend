// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import authRoutes from './src/routes/auth.js';
import subscribeRoute from './src/routes/subscribe.js';
import applicationRoute from './src/routes/application.js';
import sendEmail from './src/utils/sendEmail.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🕒 Track every request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📡 ${req.method} ${req.originalUrl} -> ${res.statusCode} [${duration}ms]`);
  });
  next();
});

// ✅ Connect MongoDB
console.time('⏱️ MongoDB connection time');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.timeEnd('⏱️ MongoDB connection time');
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/subscribe', subscribeRoute);
app.use('/api/apply', applicationRoute);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello from Tips backend!' });
});

// 🧪 Test email endpoint
app.get('/test-email', async (req, res) => {
  try {
    console.time('⏱️ Email test duration');
    await sendEmail('your_email@gmail.com', 'Test Email', 'This is a test');
    console.timeEnd('⏱️ Email test duration');
    res.send('✅ Email sent');
  } catch (err) {
    console.error('❌ Test email error:', err);
    res.status(500).send('❌ Email failed: ' + err.message);
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
