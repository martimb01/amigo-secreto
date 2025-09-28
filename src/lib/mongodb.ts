import mongoose from "mongoose";

const DB_URL = process.env.MONGODB_URL;

if (!DB_URL) throw new Error("Please define a MongoDB URL env variable");
