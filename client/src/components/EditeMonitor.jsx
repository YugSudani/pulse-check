import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CreateNewMonitor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [subscriptionPlan, setSubscriptionPlan] = useState("starter");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setSubscriptionPlan(user.subscriptionPlan);
    }
  }, [user]);

  const intervalOptions = [
    { value: 30 * 1000, label: "30 seconds" }, // 30000
    { value: 60 * 1000, label: "1 minute" }, // 60000
    { value: 300 * 1000, label: "5 minutes" }, // 300000
    { value: 1800 * 1000, label: "30 minutes" }, // 1800000
    { value: 3600 * 1000, label: "1 hour" }, // 3600000
    { value: 43200 * 1000, label: "12 hours" }, // 43200000
    { value: 86400 * 1000, label: "24 hours" }, // 86400000
  ];

  const [intervalIndex, setIntervalIndex] = useState(2); // default to 5 minutes (index 2)

  const isIntervalAllowed = (intervalValue) => {
    if (intervalValue === 30 * 1000) {
      return subscriptionPlan === "business";
    }

    if (intervalValue === 60 * 1000) {
      return subscriptionPlan === "pro" || subscriptionPlan === "business";
    }

    return true; // 5 min and above → all plans
  };

  const { id } = useParams();
  const [newMonitor, setNewMonitor] = useState({
    name: "",
    url: "",
    alert: {
      email: true,
      push: true,
    },
  });

  // Predefined interval options in seconds

  const getMonitor = async () => {
    try {
      const response = await api.get(`/monitor/${id}`, {
        withCredentials: true,
      });
      // console.log(response.data);
      setNewMonitor({
        name: response.data.monitor.name || "",
        url: response.data.monitor.url || "",
        alert: {
          email: response.data.monitor.alert?.email ?? true,
          push: response.data.monitor.alert?.push ?? true,
        },
      });

      const idx = intervalOptions.findIndex(
        (opt) => opt.value === response.data.monitor.interval
      );
      setIntervalIndex(idx === -1 ? 2 : idx);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMonitor();
  }, []);

  const handleEditMonitor = async () => {
    const payload = {
      name: newMonitor.name,
      url: newMonitor.url,
      alert: {
        email: newMonitor.alert.email,
        push: newMonitor.alert.push,
      },
      interval: intervalOptions[intervalIndex].value,
    };

    // console.log(payload);

    try {
      setLoading(true);
      const response = await api.put(`/monitor/editeMonitor/${id}`, payload, {
        withCredentials: true,
      });
      console.log(response.data);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-y-auto flex-1 min-h-0 h-full p-3 sm:p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        onClick={() => navigate("/dashboard", { replace: true })}
        className="mt-14 ml-1 md:ml-0 md:mt-0 inline-block bg-[#121A28] px-4 py-2 rounded-lg mb-4 sm:mb-6 hover:bg-[#172235] cursor-pointer font-bold text-base sm:text-lg transition"
      >
        ← Monitoring
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Edit Monitor<span className="text-green-500">.</span>
      </h1>

      <div className="bg-[#0D121C] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">
        <hr className="border-gray-800" />

        {/* ================= URL INPUT ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            URL to monitor
          </h2>

          <input
            type="text"
            value={newMonitor.url}
            onChange={(e) =>
              setNewMonitor({ ...newMonitor, url: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg outline-none text-gray-200 text-sm sm:text-base"
          />
        </section>

        {/* ================= GROUP + TAGS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Tags */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              Give Name to your monitor
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Name to identify your monitor.
            </p>

            <input
              type="text"
              placeholder="Click to give name..."
              value={newMonitor.name}
              onChange={(e) =>
                setNewMonitor({ ...newMonitor, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 outline-none text-sm sm:text-base"
            />
          </div>
        </section>

        <hr className="border-gray-800" />

        {/* ================= NOTIFICATIONS ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">
            How will we notify you?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Push */}
            <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={newMonitor.alert.push}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({
                      ...prev,
                      alert: {
                        ...prev.alert,
                        push: e.target.checked,
                      },
                    }))
                  }
                />
                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-green-300"></div>
                Push Notification
              </label>
              <p className="text-gray-400 text-sm mb-3">Loged in browser</p>
              <p className="text-gray-500 text-xs">Instant, no repeat</p>
            </div>

            {/* Email */}
            <div className="relative bg-[#121A28] border border-gray-700 p-4 rounded-lg">
              {/* PRO badge */}
              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full
                           bg-blue-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider"
              >
                PRO
              </span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled={
                    subscriptionPlan !== "pro" &&
                    subscriptionPlan !== "business"
                  }
                  checked={newMonitor.alert.email}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({
                      ...prev,
                      alert: {
                        ...prev.alert,
                        email: e.target.checked,
                      },
                    }))
                  }
                />
                <div
                  className="relative w-11 h-6 rounded-full bg-gray-600
                                peer-checked:bg-green-500
                                peer-disabled:bg-gray-700
                                peer-disabled:opacity-50
                                peer-disabled:cursor-not-allowed
                                after:content-['']
                                after:absolute after:top-[2px] after:left-[2px]
                                after:h-5 after:w-5 after:bg-white after:rounded-full
                                after:transition-all
                                peer-checked:after:translate-x-full"
                ></div>
                E-mail
              </label>
              {subscriptionPlan !== "pro" &&
                subscriptionPlan !== "business" && (
                  <div className="text-sm text-gray-400 mb-2">
                    🔒 Available only in Pro & Bussiness plan.
                    <button
                      onClick={() => navigate("/pricing")}
                      className="text-green-500 ml-2 cursor-pointer"
                    >
                      Upgrade Now
                    </button>
                  </div>
                )}
              <p className="text-gray-400 text-sm mb-3">yourmail@gmail.com</p>
              <p className="text-gray-500 text-xs">Instant, no repeat</p>
            </div>

            {/* Voice call */}
            <div className="relative bg-[#121A28] border border-gray-700 p-4 rounded-lg">
              {/* PRO badge */}
              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full
                           bg-blue-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider"
              >
                PRO
              </span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={subscriptionPlan !== "business"}
                  className="sr-only peer"
                />
                <div
                  className="relative w-11 h-6 rounded-full bg-gray-600
                                peer-checked:bg-green-500
                                peer-disabled:bg-gray-700
                                peer-disabled:opacity-50
                                peer-disabled:cursor-not-allowed
                                after:content-['']
                                after:absolute after:top-[2px] after:left-[2px]
                                after:h-5 after:w-5 after:bg-white after:rounded-full
                                after:transition-all
                                peer-checked:after:translate-x-full"
                ></div>
                Voice call
              </label>
              {subscriptionPlan !== "business" && (
                <div className="text-sm text-gray-400 mb-2">
                  🔒 Available only in Bussiness plan.
                  <button
                    onClick={() => navigate("/pricing")}
                    className="text-green-500 ml-2 cursor-pointer"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
              <p className="text-gray-400 text-sm mb-3">+91******2422</p>
              <p className="text-gray-500 text-xs">No delay, no repeat</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-800" />

        {/* ================= MONITOR INTERVAL ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Monitor interval
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Your monitor will be checked every{" "}
            <span className="text-white font-semibold">
              {intervalOptions[intervalIndex].label}
            </span>
            .
          </p>

          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={intervalIndex}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              const selectedInterval = intervalOptions[newIndex].value;

              if (!isIntervalAllowed(selectedInterval)) {
                alert("Upgrade Your plan to use this features");
                return;
              }

              setIntervalIndex(newIndex);
            }}
            className="w-full accent-green-500"
          />
          {subscriptionPlan !== "pro" && (
            <div className="text-sm text-gray-400 mb-2">
              <span className="text-green-500 ml-2 cursor-pointer">
                ⚡ Faster intervals available on Pro & Business plans
              </span>
            </div>
          )}

          <div className="flex justify-between text-gray-500 text-xs mt-2">
            <span>30s</span>
            <span>1m</span>
            <span>5m</span>
            <span>30m</span>
            <span>1h</span>
            <span>12h</span>
            <span>24h</span>
          </div>
        </section>

        {/* ================= REGION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Region to monitor from</h2>

          <div className="text-sm text-gray-400 mb-2">
            🔒 Available only in Solo, Team, and Enterprise.
            <span className="text-green-500 ml-2 cursor-pointer">
              Upgrade now
            </span>
          </div>

          <select className="w-full bg-[#121A28] px-2 py-3 rounded-lg border border-gray-800 text-gray-300">
            <option>India</option>
          </select>
        </section>

        {/* ================= SUBMIT BUTTON ================= */}
        <div className="pt-6">
          <button
            onClick={handleEditMonitor}
            disabled={loading}
            className="w-full bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-4 border-gray-400 border-t-green-700 rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update Monitor"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
