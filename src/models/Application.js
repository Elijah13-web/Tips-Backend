import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  fileUrl: { type: String }, // optional: store file URL if you later upload to cloud
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', ApplicationSchema);
