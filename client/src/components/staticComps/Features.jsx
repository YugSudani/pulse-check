import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-Time Monitoring",
      description: "Get instant notifications when your servers go down. Monitor uptime with 60-second intervals.",
      stats: ["60-second checks", "Instant alerts", "99.9% accuracy"]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "Smart Alerts",
      description: "Receive notifications via Email, SMS, Slack, Discord, Telegram, Webhook and 20+ integrations.",
      stats: ["20+ integrations", "Custom alert rules", "Alert scheduling"]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Response Time Tracking",
      description: "Track and analyze your server response times with detailed charts and historical data.",
      stats: ["Detailed graphs", "Historical data", "Performance insights"]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Public Status Pages",
      description: "Create beautiful, customizable status pages to keep your users informed about your services.",
      stats: ["Custom branding", "Incident history", "Subscribe to updates"]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: "Global Monitoring Locations",
      description: "Monitor your services from multiple locations worldwide to ensure global availability.",
      stats: ["10+ locations", "Geographic coverage", "Regional insights"]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Detailed Reports",
      description: "Generate comprehensive uptime reports with customizable date ranges and export options.",
      stats: ["PDF exports", "Custom ranges", "Automated delivery"]
    },
  ];

  return (
    <>
          <Navbar/>
    <div className="min-h-screen bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-20 py-6">
      {/* HERO SECTION */}
      <div className="text-center mb-16 sm:mb-20">
        <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
          <p className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Powerful Features
          </p>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Everything you need to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            monitor your infrastructure
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
          Comprehensive monitoring tools designed to keep your services running smoothly and your team informed.
        </p>
      </div>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-[#0D121C]/60 p-6 sm:p-8 rounded-2xl border border-gray-800/50 hover:border-green-500/30 hover:bg-[#0D121C]/80 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mb-5 group-hover:bg-green-500/30 group-hover:scale-110 transition-all">
              {feature.icon}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
              {feature.title}
            </h3>

            <p className="text-gray-400 text-base mb-6 leading-relaxed">
              {feature.description}
            </p>

            <div className="space-y-2">
              {feature.stats.map((stat, statIndex) => (
                <div
                  key={statIndex}
                  className="flex items-center gap-2 text-sm text-gray-500"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>{stat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* STATS SECTION */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 sm:p-12 mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Trusted by thousands of companies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "50+", label: "Free monitors per account" },
            { value: "99.9%", label: "Platform uptime" },
            { value: "60s", label: "Check interval" },
            { value: "20+", label: "Integrations available" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
}