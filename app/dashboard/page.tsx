"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount (Client-side only)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchIncidents = async (currentUserName: string) => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      setIncidents(data.filter((i: any) => i.reporterName === currentUserName));
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.name) {
      fetchIncidents(user.name);
    } else if (user === null && typeof window !== "undefined") {
      // If we checked and still no user, stop loading
      setLoading(false);
    }
  }, [user]);

  const submitIncident = async () => {
    if (!user?.name) return;

    await fetch("/api/incidents", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        category: "General",
        location: "School",
        reporterName: user.name,
      }),
    });

    setTitle("");
    setDescription("");
    fetchIncidents(user.name);
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user)
    return (
      <div className="p-10 text-red-500">
        Please login to view your dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Submit Incident</h1>

        {/* LEFT SIDE – FORM */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              New Incident
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       outline-none transition"
                  placeholder="Broken chair in classroom..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       outline-none transition resize-none"
                  placeholder="Describe what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                onClick={submitIncident}
                className="w-full bg-indigo-600 hover:bg-indigo-700 
                     text-white font-medium py-2.5 rounded-lg 
                     transition active:scale-[0.98]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold my-3">My Incidents</h2>
        {incidents.map((i) => (
          <div key={i._id} className="bg-white rounded-lg shadow-sm p-4 mb-3">
            <p className="font-semibold text-lg">{i.title}</p>
            <p className="text-sm text-gray-500">Status: {i.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
