// src/pages/UserDashboard/UserDashboard.tsx
import { useEffect, useState } from "react";
// NOTE: from UserDashboard file we need to go up two levels to reach src/context and src/api
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

interface Bill {
  _id: string;
  month: string;
  unitsUsed: number;
  amount: number;
  status: string;
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError("");
      try {
        // make request to backend
        const res = await axiosClient.get("/user/bills?status=Unpaid");

        // Be defensive: some endpoints return { success:true, data: [] }
        // others return { success:true, data: { bills: [...] } }
        const payload =
          res?.data?.data?.bills ?? // { data: { bills: [...] } }
          res?.data?.data ??         // { data: [...] } or data: {...}
          [];

        // If payload is an object with keys, try to find an array inside
        // (very defensive) — but usually one of the above will work.
        const finalArray = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.bills)
          ? payload.bills
          : [];

        setBills(finalArray);
      } catch (err: any) {
        console.error("Failed to fetch bills:", err);
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Unable to fetch bills. Check server or network."
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user exists (token present)
    if (user) fetchBills();
  }, [user]); // re-run when user changes (login/logout)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-700">E-Bijilee – User Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Unpaid Bills</h2>

        {loading ? (
          <p className="text-gray-600">Loading bills...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : bills.length === 0 ? (
          <p className="text-gray-600">No unpaid bills.</p>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill._id}
                className="bg-white rounded shadow p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">Month: {bill.month}</p>
                  <p className="text-sm text-gray-600">
                    Units: {bill.unitsUsed} | Amount: ₹{bill.amount}
                  </p>
                </div>
                <span className="text-red-600 font-semibold">{bill.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
