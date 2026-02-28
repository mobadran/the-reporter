import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const user = await User.create(body);

  return NextResponse.json(user);
}
