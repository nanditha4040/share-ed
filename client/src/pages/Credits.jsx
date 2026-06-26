import { useEffect, useState } from "react";
import api from "../api";

export default function Credits() {

  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {

      // Get logged-in user credits
      const userRes = await api.get("/users/me");

      setCredits(userRes.data.user?.credits || userRes.data.credits || 0);

      // Optional transaction history
      try {
        const txRes = await api.get("/credits/transactions");
        setHistory(txRes.data.transactions || txRes.data || []);
      } catch {}

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const TYPE_LABELS = {
    session_booking:  { label: "Session Booked",    icon: "📅" },
    session_complete: { label: "Session Completed", icon: "🎓" },
    note_upload:      { label: "Notes Approved",    icon: "📚" },
    bonus:            { label: "Bonus Credits",     icon: "🎁" },
  };

  const earned = history.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const spent  = history.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);

  return (
    <div className="max-w-2xl mx-auto">

      <h2 className="text-2xl font-semibold mb-1 text-slate-700">
        My Credits
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Earn by sharing notes. Spend to book sessions.
      </p>

      {/* Balance Card */}

      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">

        <p className="text-gray-400 text-sm mb-1">
          Current Balance
        </p>

        <h2 className="text-5xl font-bold text-slate-700 mb-4">
          {loading ? "—" : credits}
          <span className="text-xl font-normal text-gray-400 ml-2">
            credits
          </span>
        </h2>

        <div className="flex gap-4">

          <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              +{earned}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Total Earned
            </div>
          </div>

          <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-500">
              -{spent}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Total Spent
            </div>
          </div>

        </div>
      </div>

      {/* Credit Rules */}

      <div className="bg-white shadow-sm rounded-2xl p-5 mb-6 border border-slate-100">

        <h3 className="font-semibold text-slate-700 mb-3 text-sm">
          How Credits Work
        </h3>

        <div className="space-y-2">

          <div className="flex justify-between text-sm">
            <span>📚 Upload & get notes approved</span>
            <span className="text-green-600 font-bold">+10</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>🎁 Daily Login</span>
            <span className="text-green-600 font-bold">+5</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>📅 Book a session</span>
            <span className="text-red-500 font-bold">-10</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>🎓 Complete session (mentor)</span>
            <span className="text-green-600 font-bold">+10</span>
          </div>

        </div>

      </div>

      {/* Transaction History */}

      <div className="bg-white shadow-sm rounded-2xl p-5 border border-slate-100">

        <h3 className="font-semibold text-slate-700 mb-4">
          Transaction History
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No transactions yet.
          </p>
        ) : (
          <div className="space-y-2">

            {history.map((item, index) => {

              const typeInfo =
                TYPE_LABELS[item.type] ||
                { label: "Transaction", icon: "💳" };

              const isPositive = item.amount > 0;

              return (
                <div key={index} className="flex justify-between py-2">

                  <span>
                    {typeInfo.icon} {typeInfo.label}
                  </span>

                  <span className={isPositive ? "text-green-600" : "text-red-500"}>
                    {isPositive ? "+" : ""}{item.amount}
                  </span>

                </div>
              );

            })}

          </div>
        )}

      </div>

    </div>
  );
}