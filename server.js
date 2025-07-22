// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Import routes
import authRoutes from './src/routes/auth.js';
import subscribeRoute from './src/routes/subscribe.js';

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);           
app.use('/subscribe', subscribeRoute);      

// Simple health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello from Tips backend!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
