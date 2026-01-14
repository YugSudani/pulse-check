import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Resources() {
  const navigate = useNavigate();

  const resources = [
    {
      category: "Documentation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Getting Started Guide",
      description: "Learn the basics of server monitoring and set up your first monitor in minutes.",
      items: [
        "Quick start tutorial for new users",
        "Monitor configuration best practices",
        "Alert setup and notification routing",
        "Dashboard customization guide"
      ],
      topics: ["Setup guides", "Configuration", "Best practices", "Video tutorials"]
    },
    {
      category: "API Reference",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Developer Documentation",
      description: "Integrate PulseCheck into your workflow with our comprehensive API documentation.",
      items: [
        "RESTful API endpoints and examples",
        "Authentication and security guidelines",
        "Webhook integration setup",
        "SDKs for popular languages"
      ],
      topics: ["REST API", "Webhooks", "SDKs", "Code samples"]
    },
    {
      category: "Knowledge Base",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Troubleshooting & FAQs",
      description: "Find answers to common questions and solutions to technical issues.",
      items: [
        "Common monitoring scenarios explained",
        "SSL certificate monitoring tips",
        "Response time optimization strategies",
        "Alert fatigue prevention techniques"
      ],
      topics: ["FAQs", "Troubleshooting", "Common issues", "Solutions"]
    },
    {
      category: "Integrations",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: "Integration Guides",
      description: "Connect PulseCheck with your favorite tools and services.",
      items: [
        "Slack and Microsoft Teams setup",
        "PagerDuty and Opsgenie integration",
        "Discord and Telegram notifications",
        "Custom webhook configurations"
      ],
      topics: ["Slack", "Discord", "Telegram", "Webhooks"]
    },
    {
      category: "Blog & Tutorials",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      title: "Best Practices & Tutorials",
      description: "Learn from experts and improve your monitoring strategies with in-depth articles.",
      items: [
        "Industry best practices for uptime monitoring",
        "Case studies from real customers",
        "Performance optimization techniques",
        "Advanced monitoring workflows"
      ],
      topics: ["Blog posts", "Case studies", "Tutorials", "Tips & tricks"]
    },
    {
      category: "Community",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community & Support",
      description: "Connect with other users, share experiences, and get help from the community.",
      items: [
        "Community forum and discussions",
        "Feature requests and roadmap",
        "User-generated tips and tricks",
        "Direct support channels"
      ],
      topics: ["Forum", "Support", "Feature requests", "Feedback"]
    }
  ];

  const popularGuides = [
    {
      title: "Setting Up Your First Monitor",
      description: "A step-by-step guide to creating and configuring your first monitoring check",
      readTime: "5 min read"
    },
    {
      title: "Understanding Response Time Metrics",
      description: "Learn how to interpret response time data and optimize your services",
      readTime: "8 min read"
    },
    {
      title: "Alert Configuration Best Practices",
      description: "Avoid alert fatigue with smart notification routing and scheduling",
      readTime: "6 min read"
    },
    {
      title: "Creating Effective Status Pages",
      description: "Build trust with your users through transparent status communication",
      readTime: "7 min read"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-20 py-6">
        {/* HERO SECTION */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
            <p className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Learning Resources
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Everything you need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              master server monitoring
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and documentation to help you get the most out of PulseCheck.
          </p>
        </div>

        {/* POPULAR GUIDES SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            Popular Guides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularGuides.map((guide, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-[#0D121C]/60 p-6 rounded-2xl border border-gray-800/50 hover:border-green-500/30 hover:bg-[#0D121C]/80 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                    {guide.title}
                  </h3>
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-all group-hover:translate-x-1 flex-shrink-0"
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
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{guide.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESOURCES GRID */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            Browse by Category
          </h2>

          <div className="space-y-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-[#0D121C]/60 p-6 sm:p-10 rounded-2xl border border-gray-800/50 hover:border-green-500/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* LEFT SIDE - Icon & Title */}
                  <div className="lg:w-1/3">
                    <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full mb-4">
                      <p className="text-green-400 text-xs font-medium">
                        {resource.category}
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 mb-4 group-hover:bg-green-500/30 group-hover:scale-105 transition-all">
                      {resource.icon}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-gray-400 text-base leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  {/* RIGHT SIDE - Items & Topics */}
                  <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div className="backdrop-blur-sm bg-[#121A28]/40 p-6 rounded-xl border border-gray-700/30">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        What's Included
                      </h4>
                      <div className="space-y-3">
                        {resource.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="backdrop-blur-sm bg-[#121A28]/40 p-6 rounded-xl border border-gray-700/30">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Topics Covered
                      </h4>
                      <div className="space-y-2">
                        {resource.topics.map((topic, topicIndex) => (
                          <div
                            key={topicIndex}
                            className="backdrop-blur-sm bg-[#0B0F17]/60 px-3 py-2 rounded-lg border border-gray-700/20 text-sm text-gray-300"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HELP SECTION */}
        <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 sm:p-12 mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Need additional help?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Our support team is here to help you succeed with PulseCheck
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-sm bg-[#0D121C]/40 p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm">Get help via email within 24 hours</p>
            </div>

            <div className="backdrop-blur-sm bg-[#0D121C]/40 p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm">Chat with our support team in real-time</p>
            </div>

            <div className="backdrop-blur-sm bg-[#0D121C]/40 p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-gray-400 text-sm">Explore comprehensive guides and docs</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}