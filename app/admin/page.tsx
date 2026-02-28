"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchIncidents();
  };

  const deleteIncident = async (id: string) => {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    await fetch(`/api/incidents/${id}`, {
      method: "DELETE",
    });
    fetchIncidents();
  };

  const filteredIncidents = incidents.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesRole = roleFilter === "all" || i.reporterRole === roleFilter;
    return matchesStatus && matchesRole;
  });

  if (loading) return <div className="p-10">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

          <div className="flex gap-4">
            <select
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Student Incidents</option>
              <option value="instructor">Instructor Incidents</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredIncidents.map((i) => (
            <div
              key={i._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-lg text-gray-800">{i.title}</p>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        i.reporterRole === "instructor"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {i.reporterRole}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    Reported by{" "}
                    <span className="font-medium text-gray-700">
                      {i.reporterName}
                    </span>
                  </p>
                  <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
                    {i.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                      {i.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg border border-gray-100">
                      {i.location}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        i.priority === "high"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : i.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                            : "bg-green-50 text-green-700 border-green-100"
                      }`}
                    >
                      {i.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      i.status === "resolved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : i.status === "in-progress"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                    }`}
                  >
                    {i.status}
                  </span>

                  <div className="flex gap-2">
                    {i.status !== "in-progress" && i.status !== "resolved" && (
                      <button
                        onClick={() =>
                          updateIncident(i._id, { status: "in-progress" })
                        }
                        className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition"
                      >
                        Start Work
                      </button>
                    )}
                    {i.status !== "resolved" && (
                      <button
                        onClick={() =>
                          updateIncident(i._id, { status: "resolved" })
                        }
                        className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => deleteIncident(i._id)}
                      className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                No incidents found matching these criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
