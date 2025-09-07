"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HRUser {
  username: string;
  piUsernames: string[]; 
}

export default function Home() {
  const [hr, setHR] = useState<HRUser | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedHR = localStorage.getItem("hr_user");
    if (!storedHR) {
      router.push("/login");
    } else {
      const hrData = JSON.parse(storedHR);
      setHR(hrData);
      console.log("Stored HR data:", hrData);
    }
  }, [router]);

  const handleRedirect = () => {
    if (hr && hr.piUsernames) {
      setRedirecting(true);

      const tokenData = {
        username: hr.username,
        piUsernames: hr.piUsernames,
        timestamp: Date.now(),
      };

      const transferToken = btoa(JSON.stringify(tokenData));

      const targetUrl = process.env.NEXT_PUBLIC_ATTENDANCE_HR_APP_URL || "http://localhost:3000";

      const redirectUrl = `${targetUrl}/hr/sso?token=${transferToken}`;

      const debugData = {
        targetUrl,
        username: hr.username,
        piUsernames: hr.piUsernames,
        piCount: hr.piUsernames.length,
        fullRedirectUrl: redirectUrl,
        transferToken: transferToken.substring(0, 50) + "...",
        tokenData,
      };

      setDebugInfo(debugData);
      console.log("Debug Info:", debugData);
      console.log("Full token:", transferToken);

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
  };

  if (!hr) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="text-center p-6 mt-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {hr.username}</h1>

      {hr.piUsernames && hr.piUsernames.length > 0 && (
        <div className="mb-6">
          <p className="text-lg mb-3">
            Your PIs ({hr.piUsernames.length}):
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {hr.piUsernames.map((pi, index) => (
              <span
                key={pi}
                className="bg-blue-100 px-3 py-1 rounded-lg text-sm font-medium"
              >
                {index + 1}. {pi}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleRedirect}
        disabled={redirecting}
        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
          redirecting
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {redirecting
          ? "Redirecting to HR Attendance Dashboard..."
          : "Go to HR Attendance Dashboard"}
      </button>

      {debugInfo && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg text-left">
          <h2 className="text-lg font-bold mb-3">Transfer Information:</h2>

          <div className="space-y-3">
            <div>
              <strong>Username:</strong>
              <p className="text-sm bg-white p-2 rounded border">
                {debugInfo.username}
              </p>
            </div>

            <div>
              <strong>
                PIs Being Transferred ({debugInfo.piCount}):
              </strong>
              <div className="text-sm bg-white p-2 rounded border">
                {debugInfo.piUsernames.map((pi: string, index: number) => (
                  <div
                    key={pi}
                    className="flex justify-between border-b py-1 last:border-b-0"
                  >
                    <span>PI {index + 1}:</span>
                    <span className="font-mono">{pi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <strong>Target URL:</strong>
              <p className="text-sm bg-white p-2 rounded border">
                {debugInfo.targetUrl}
              </p>
            </div>

            <div>
              <strong>Transfer Token (partial):</strong>
              <p className="text-xs bg-white p-2 rounded border font-mono break-all">
                {debugInfo.transferToken}
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-green-600 font-semibold animate-pulse">
                Redirecting in 2 seconds...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}