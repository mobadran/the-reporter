import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/lib/models/Incident";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const body = await req.json();
  const { id } = await params;

  const updated = await Incident.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  await Incident.findByIdAndDelete(id);
  return NextResponse.json({ message: "Incident deleted successfully" });
}
