import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoDbAdvanced";
import { User } from "@/models/User";
import {
  validateUserData,
  validationTypes,
} from "../../../lib/userDataValidation";
import bcrypt from "bcrypt";

//To create/register new users
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Cannot have empty fields" },
        { status: 400 },
      );
    }

    //Running data validation checks
    const passwordError = validateUserData(password, validationTypes.Password);
    const emailError = validateUserData(email, validationTypes.Email);
    if (passwordError || emailError) {
      return NextResponse.json(
        { error: { passwordError, emailError } },
        { status: 400 },
      );
    }

    // Prevent duplicate emails early (still race-safe via catch below)
    const alreadyExistingEmail = await User.exists({ email });
    if (alreadyExistingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Creating the user on the DB
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(`User created, ${name}, ${email} `, {
      status: 201,
    });
  } catch (error: any) {
    console.error("!", error);

    // Handle Mongo duplicate key (unique index) violations
    if (
      error?.code === 11000 &&
      (error?.keyPattern?.email || error?.keyValue?.email)
    ) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Fallback to original 500 for other errors (incl. connect failures)
    return NextResponse.json(
      { error: "Failed to connect to mongoDB" },
      { status: 500 },
    );
  }
}
