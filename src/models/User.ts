import mongoose, { Schema, models } from "mongoose";

//Document adds all the properties and methods that a MongoDB document has (.save(), .toJSON(), etc...)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export const User = models.User || mongoose.model("User", userSchema);
