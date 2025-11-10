import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
