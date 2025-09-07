// hr-login.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HRLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [debugResponse, setDebugResponse] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HR_API_URL}/api/login`,
        { username, password }
      );

      console.log("HR Login response:", res.data);
      setDebugResponse(res.data);

      if (res.data.success) {
        localStorage.setItem("hr_user", JSON.stringify(res.data));

        console.log("HR data stored in localStorage:", res.data);

        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("HR Login error:", err);
      setError("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">HR Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {debugResponse && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-bold">Backend Response:</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(debugResponse, null, 2)}
          </pre>
          <p className="text-sm text-green-600 mt-2">
            Redirecting to HR home in 2 seconds...
          </p>
        </div>
      )}
    </div>
  );
}
