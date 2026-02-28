"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [incidents, setIncidents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch admin incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const updateIncident = async (id: string, body: any) => {
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    fetchIncidents();
  };

  if (loading) return <div className="p-10">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {incidents.map((i) => (
          <div key={i._id} className="bg-white rounded-xl shadow-md p-5 mb-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">{i.title}</p>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  i.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : i.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                }`}
              >
                {i.status}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updateIncident(i._id, { status: "in-progress" })}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
              >
                In Progress
              </button>

              <button
                onClick={() => updateIncident(i._id, { status: "resolved" })}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
