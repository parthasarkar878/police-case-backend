import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["hq", "thana"], required: true }
});

export default mongoose.model("User", userSchema);
