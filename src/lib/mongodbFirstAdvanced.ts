import mongoose from "mongoose";

declare global {
  // Avoid re-declaration errors during Next.js hot reloads
  var mongooseCache:
    | {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
      }
    | undefined;
}

// ✅ Narrow the type safely (DB_URL will always be a string after this)
const DB_URL = process.env.MONGODB_URL as string;

if (!DB_URL) {
  throw new Error(
    "❌ Please define the MONGODB_URL environment variable inside .env.local",
  );
}

// ✅ Ensure the cache object always exists
const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};
global.mongooseCache = globalCache;

export async function connectDB() {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    const opts = { bufferCommands: false };

    globalCache.promise = mongoose.connect(DB_URL, opts).then((m) => {
      console.log("✅ MongoDB connected");
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
