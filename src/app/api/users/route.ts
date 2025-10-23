import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoDbAdvanced";
import { User } from "@/models/User";
import {
  validateUserData,
  validationTypes,
} from "../../../lib/userDataValidation";

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

    await User.create({ name, email, password });
    return NextResponse.json(`User created, ${name}, ${email} `, {
      status: 201,
    });
  } catch (error) {
    console.error("!", error);
    return NextResponse.json(
      { error: "Failed to connect to mongoDB" },
      { status: 500 },
    );
  }
}
