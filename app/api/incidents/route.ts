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
  console.log({ body });
  // throw new Error("s");

  const priority = await getPriority(body);
  // const priority = "low";

  const incident = await Incident.create({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    priority,
    reporterName: body.reporterName,
    reporterRole: body.reporterRole,
  });

  return NextResponse.json(incident);
}

type IncidentBody = {
  title: string;
  description: string;
  category: string;
  location: string;
};

export async function getPriority(body: IncidentBody) {
  const prompt = `
Based on the following data, assign a priority level (low, medium, high) to the incident.
Respond with only one word: low, medium, or high.

Title: ${body.title}
Description: ${body.description}
Category: ${body.category}
Location: ${body.location}
  `;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it:free", // choose any chat model
        messages: [
          {
            role: "user",
            content:
              "You are an assistant that categorizes incident priorities.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0, // deterministic output
      }),
    });

    const data = await res.json();
    console.log({ data });

    // Extract text from response
    const priority = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    console.log({ priority });

    // Validate and fallback
    if (["low", "medium", "high"].includes(priority)) return priority;
    throw new Error("Invalid priority level");
  } catch (err) {
    console.error("Error getting priority:", err);
    throw new Error("Failed to get priority");
  }
}
