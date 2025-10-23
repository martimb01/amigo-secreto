import mongoose from "mongoose";

declare global {
  // Prevent "Cannot redeclare block-scoped variable" errors in dev
  var mongooseCache:
    | {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
      }
    | undefined;
}

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error(
    "❌ Please define the MONGODB_URL environment variable in .env.local",
  );
}

// Use a global cache that persists between hot reloads and serverless invocations
const globalCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectDB() {
  if (globalCache.conn) {
    // ✅ Reuse existing connection if available
    console.log("♻️ Using cached MongoDB connection");
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    // First time: start connecting and store the promise
    const opts = { bufferCommands: false };

    globalCache.promise = mongoose.connect(MONGODB_URL, opts).then((m) => {
      console.log("✅ New MongoDB connection established");
      return m;
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (err) {
    globalCache.promise = null;
    throw err;
  }

  return globalCache.conn;
}
