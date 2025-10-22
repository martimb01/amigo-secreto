import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodbSecondAdvanced";
import { User } from "@/models/User";
import { validateUserData, validationTypes } from "./service";

//To create/register new users
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      console.log("USERS POST -- Cannot have empty fields");

      return NextResponse.json(
        { error: "Cannot have empty fields" },
        { status: 400 },
      );
    }

    //Running data validation checks
    const passwordError = validateUserData(password, validationTypes.Password);
    const emailError = validateUserData(email, validationTypes.Email);

    if (passwordError || emailError) {
      console.log("USERS POST -- Invalid password or email");
      console.log({ passwordError, emailError });
      return NextResponse.json(
        { error: { passwordError, emailError } },
        { status: 400 },
      );
    }

    const newUser = await User.create({ name, email, password });
    console.log("user created");
    return NextResponse.json(newUser + "created!", { status: 201 });
  } catch (error) {
    console.error("!", error);
    return NextResponse.json(
      { error: "Server error creating user" },
      { status: 500 },
    );
  }
}
