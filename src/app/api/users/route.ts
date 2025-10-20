import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodbSecondAdvanced";
import { User, type userType } from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const newUser = await User.create({ name, email });
    console.log("user created");
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("!", error);
    return NextResponse.json(
      { error: "Server error creating user" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.log("!", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
