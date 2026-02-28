"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold tracking-wide">The Reporter</h1>

      <button
        onClick={logout}
        className="bg-white text-indigo-600 px-4 py-1 rounded-md font-medium hover:bg-gray-200 transition"
      >
        Logout
      </button>
    </nav>
  );
}
