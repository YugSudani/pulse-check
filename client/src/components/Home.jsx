import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/getMe", { withCredentials: true });
      setUser(response.data.success);
    } catch (error) {
      // console.log(error)
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-20 py-6">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center gap-4 sm:gap-0 mb-9 sm:mb-9 backdrop-blur-sm bg-[#0D121C]/30 px-6 py-4 rounded-2xl border border-gray-800/50">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-bold">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <button
            onClick={() => navigate("/")}
            className="hover:text-green-400 transition"
          >
            PulseCheck
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-300 font-medium text-sm lg:text-base">
          <button
            onClick={() => navigate("/features")}
            className="hover:text-green-400 transition-colors relative group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
          </button>
          <button
            onClick={() => navigate("/solutions")}
            className="hover:text-green-400 transition-colors relative group"
          >
            Solutions
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
          </button>
          <button
            onClick={() => navigate("/enterprise")}
            className="hover:text-green-400 transition-colors relative group"
          >
            Enterprise
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
          </button>
          <button
            onClick={() => navigate("/resources")}
            className="hover:text-green-400 transition-colors relative group"
          >
            Resources
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="hover:text-green-400 transition-colors relative group"
          >
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
          </button>
        </div>

        {user ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="backdrop-blur-sm bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-green-500/20 hover:border-green-500/50 cursor-pointer transition-all flex items-center gap-2"
          >
            Dashboard
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="backdrop-blur-sm bg-white/5 border border-gray-700/50 text-gray-300 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-white/10 hover:border-gray-600 hover:text-white cursor-pointer transition-all"
          >
            Login
          </button>
        )}
      </nav>

      {/* MAIN HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* LEFT SIDE */}
        <div>
          <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
            <p className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Real-time Server Monitoring
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            The world's leading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Server monitoring
            </span>{" "}
            service.
          </h1>

          <div className="mt-8 sm:mt-12 space-y-4 text-base sm:text-lg">
            {[
              "50 monitors for free",
              "20+ integrations",
              "Real-time alerts, web & mobile",
              "Public status pages",
              "Instant setup",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 backdrop-blur-sm bg-[#121A28]/30 px-4 py-3 rounded-xl border border-gray-800/50 hover:border-green-500/30 hover:bg-[#121A28]/50 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="bg-green-500 text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-green-400 active:scale-[0.98] transition-all shadow-lg shadow-green-500/20 text-base sm:text-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="backdrop-blur-sm bg-white/5 border border-gray-700/50 text-gray-300 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-gray-600 hover:text-white transition-all text-base sm:text-lg"
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* RIGHT DASHBOARD PREVIEW */}
        <div className="backdrop-blur-sm bg-[#0D121C]/60 p-6 sm:p-8 rounded-2xl border border-gray-800/50 shadow-2xl hover:border-gray-700/50 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Monitoring Dashboard
            </h2>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          <div className="backdrop-blur-sm bg-[#121A28]/40 p-5 sm:p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <p className="text-lg sm:text-xl font-semibold">website.com</p>
                <p className="text-sm text-gray-400">
                  HTTPS monitor for http://example.com
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
              {[
                {
                  label: "Current status",
                  value: "Up",
                  color: "text-green-400",
                },
                {
                  label: "Last check",
                  value: "26 seconds ago",
                  color: "text-white",
                },
                { label: "Last 24 hours", value: "100%", color: "text-white" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm bg-[#0B0F17]/60 p-4 rounded-lg border border-gray-700/30"
                >
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`${stat.color} font-semibold text-sm sm:text-base`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 backdrop-blur-sm bg-[#0B0F17]/40 p-4 rounded-lg border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-3 font-medium">
                Pulse stats
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                {[
                  { period: "Last 7 days", uptime: "100%" },
                  { period: "Last 30 days", uptime: "99.99%" },
                  { period: "Last 365 days", uptime: "99.98%" },
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {stat.period}
                    </p>
                    <p className="text-green-400 font-semibold text-base sm:text-lg">
                      {stat.uptime}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
