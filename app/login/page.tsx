"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, role }),
    });

    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));

    if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">The Reporter</h1>
          <p className="text-sm text-gray-500 mt-1">
            Report issues. Make school better.
          </p>
        </div>

        <div className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Your Name
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     outline-none transition"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     outline-none transition bg-white"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700
                   text-white font-medium py-2.5 rounded-lg
                   transition active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
