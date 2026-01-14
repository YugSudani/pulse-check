import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Solutions() {
  const navigate = useNavigate();

  const solutions = [
    {
      category: "For Developers",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "API & Application Monitoring",
      description: "Monitor your APIs, web applications, and microservices with real-time alerts and detailed performance tracking.",
      features: [
        "Real-Time Monitoring with 60-second intervals",
        "Response Time Tracking for performance insights",
        "Smart Alerts via 20+ integrations",
        "Detailed Reports with historical data"
      ],
      useCases: ["REST APIs", "GraphQL endpoints", "Web applications", "Microservices"]
    },
    {
      category: "For DevOps Teams",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      title: "Infrastructure Monitoring",
      description: "Keep your entire infrastructure healthy with comprehensive monitoring from multiple global locations.",
      features: [
        "Global Monitoring Locations for worldwide coverage",
        "Real-Time Monitoring for instant detection",
        "Response Time Tracking across regions",
        "Smart Alerts to keep teams informed"
      ],
      useCases: ["Servers", "Load balancers", "CDNs", "Cloud infrastructure"]
    },
    {
      category: "For IT Operations",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: "Network & Service Monitoring",
      description: "Monitor all your network services and endpoints to maintain maximum uptime and performance.",
      features: [
        "Global Monitoring Locations for network coverage",
        "Response Time Tracking for latency analysis",
        "Real-Time Monitoring for quick detection",
        "Detailed Reports for compliance"
      ],
      useCases: ["DNS servers", "Mail servers", "VPN endpoints", "Internal services"]
    },
    {
      category: "For Agencies",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Multi-Client Monitoring",
      description: "Manage monitoring for multiple client websites and applications from a single dashboard.",
      features: [
        "Public Status Pages for each client",
        "Smart Alerts with custom routing",
        "Detailed Reports for client deliverables",
        "Response Time Tracking for SLA compliance"
      ],
      useCases: ["Client websites", "Hosted applications", "Managed services", "White-label solutions"]
    },
    {
      category: "For E-commerce",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "E-commerce Uptime Monitoring",
      description: "Never lose sales due to downtime. Monitor your online store, payment gateways, and checkout process 24/7.",
      features: [
        "Real-Time Monitoring for critical paths",
        "Smart Alerts for immediate action",
        "Global Monitoring Locations for customer reach",
        "Public Status Pages for customer communication"
      ],
      useCases: ["Online stores", "Payment gateways", "Checkout flows", "Inventory systems"]
    }
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
            Tailored Solutions
          </p>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Monitoring solutions for
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            every team and industry
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
          Whether you're a developer, DevOps engineer, or running an e-commerce store, we have the perfect monitoring solution for your needs.
        </p>
      </div>

      {/* SOLUTIONS GRID */}
      <div className="space-y-8 mb-20">
        {solutions.map((solution, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-[#0D121C]/60 p-6 sm:p-10 rounded-2xl border border-gray-800/50 hover:border-green-500/30 transition-all group"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT SIDE - Icon & Title */}
              <div className="lg:w-1/3">
                <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full mb-4">
                  <p className="text-green-400 text-xs font-medium">
                    {solution.category}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 mb-4 group-hover:bg-green-500/30 group-hover:scale-105 transition-all">
                  {solution.icon}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                  {solution.title}
                </h3>

                <p className="text-gray-400 text-base leading-relaxed">
                  {solution.description}
                </p>
              </div>

              {/* RIGHT SIDE - Features & Use Cases */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features */}
                <div className="backdrop-blur-sm bg-[#121A28]/40 p-6 rounded-xl border border-gray-700/30">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Key Features
                  </h4>
                  <div className="space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div className="backdrop-blur-sm bg-[#121A28]/40 p-6 rounded-xl border border-gray-700/30">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Perfect For
                  </h4>
                  <div className="space-y-2">
                    {solution.useCases.map((useCase, useCaseIndex) => (
                      <div
                        key={useCaseIndex}
                        className="backdrop-blur-sm bg-[#0B0F17]/60 px-3 py-2 rounded-lg border border-gray-700/20 text-sm text-gray-300"
                      >
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 sm:p-12 mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Why teams choose PulseCheck
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Powerful monitoring features that adapt to your specific needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Easy Setup",
              description: "Start monitoring in minutes with our intuitive interface and quick configuration"
            },
            {
              title: "Flexible Alerts",
              description: "Route alerts to the right people at the right time with 20+ integrations"
            },
            {
              title: "Global Coverage",
              description: "Monitor from 10+ locations worldwide to ensure your services are accessible everywhere"
            },
            {
              title: "Detailed Analytics",
              description: "Get deep insights with response time tracking and historical performance data"
            },
            {
              title: "Public Transparency",
              description: "Build trust with customizable status pages that keep your users informed"
            },
            {
              title: "Always Improving",
              description: "Regular updates and new features based on real user feedback"
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-[#0D121C]/40 p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all"
            >
              <h3 className="text-xl font-bold mb-2 text-green-400">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>     
    </div>
    </>
  );
}