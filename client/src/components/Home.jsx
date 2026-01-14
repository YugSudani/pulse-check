import Footer from "./staticComps/Footer";
import Navbar from "./staticComps/Navbar";

export default function Home() {

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-20 py-6">
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
    </>
  );
}
