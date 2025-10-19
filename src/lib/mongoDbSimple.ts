import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error(
    "❌ Please define the MONGODB_URL environment variable in .env.local",
  );
}

// Global cache so we don’t open multiple connections
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("🟢 Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, { bufferCommands: false });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
