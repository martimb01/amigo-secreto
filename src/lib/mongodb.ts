import mongoose from "mongoose";

declare global {
  // extend NodeJS.Global
  var mongooseCache: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}
let DB_URL: string;
if (process.env.MONGODB_URL) {
  DB_URL = process.env.MONGODB_URL;
} else {
  throw new Error("Please define a MongoDB URL env variable");
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (global.mongooseCache.conn) return global.mongooseCache.conn;

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(DB_URL).then((m) => m);
  }

  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}
