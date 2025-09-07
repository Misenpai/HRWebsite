// Similar to PI's page.tsx - redirect logic
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("hr_user");
    if (!storedUser) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-600">Redirecting...</p>
    </div>
  );
}