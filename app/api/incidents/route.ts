import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/lib/models/Incident";

export async function GET() {
  await connectDB();
  const incidents = await Incident.find().sort({ createdAt: -1 });
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const incident = await Incident.create(body);

  return NextResponse.json(incident);
}
