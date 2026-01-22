import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UpgradeButton from "../payment/UpgradeBtn";

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'

  const plans = [
    {
      name: "Starter",
      description: "Perfect for personal projects and small prototypes.",
      price: { monthly: "0", yearly: "0" },
      popular: false,
      features: [
        "Up to 50 monitors",
        "30 sec check interval",
        "Push Notification alert",
        "Email alerts",
        "24-hour data retention",
        "Community support",
      ],
      cta: "Start for Free",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      name: "Pro",
      description: "For growing businesses that need reliable monitoring.",
      price: { monthly: "850", yearly: "780" }, // Yearly price represents monthly cost when billed yearly
      popular: true,
      features: [
        "Up to 150 monitors",
        "10-second check interval",
        "SMS & Voice with email & push alert",
        "30-day data retention",
        "SSL Expiry monitoring",
        "Priority email support",
      ],
      cta: "Get Started",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      name: "Business",
      description: "Advanced features for large scale applications.",
      price: { monthly: "2250", yearly: "2050" },
      popular: false,
      features: [
        "Unlimited monitors",
        "custom check interval",
        "Advanced integrations (Slack, etc)",
        "1-year data retention",
        "Status pages (Public & Private)",
        "Dedicated account manager",
        "SSO Authentication",
      ],
      cta: "Get Started",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied automatically.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards & UPI. For enterprise plans, we support invoicing.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer:
        "Yes, both Pro and Business plans come with a 7-day free trial. card required to start.",
    },
    {
      question: "What happens if I exceed my monitor limit?",
      answer:
        "We'll notify you when you're close to your limit. You won't be charged extra, but you won't be able to add new monitors until you upgrade.",
    },
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
              Simple Pricing
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Choose the plan that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              fits your scale
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>

          {/* BILLING TOGGLE */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm ${
                billingCycle === "monthly"
                  ? "text-white font-medium"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className="w-14 h-7 bg-gray-800 rounded-full p-1 relative transition-colors duration-300 focus:outline-none border border-gray-700"
            >
              <div
                className={`w-5 h-5 bg-green-500 rounded-full shadow-md transform transition-transform duration-300 ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span
              className={`text-sm ${
                billingCycle === "yearly"
                  ? "text-white font-medium"
                  : "text-gray-500"
              }`}
            >
              Yearly{" "}
              <span className="text-green-400 text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative backdrop-blur-sm p-8 rounded-2xl border transition-all duration-300 flex flex-col
                ${
                  plan.popular
                    ? "bg-[#0D121C]/80 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] scale-100 md:scale-105 z-10"
                    : "bg-[#0D121C]/60 border-gray-800/50 hover:border-green-500/30"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    plan.popular
                      ? "bg-green-500 text-white"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm h-10">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">
                    ₹
                    {billingCycle === "monthly"
                      ? plan.price.monthly
                      : plan.price.yearly}
                  </span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-xs text-green-400 mt-2">
                    Billed ₹{Number(plan.price.yearly) * 12} yearly
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="flex-grow mb-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? "text-green-400" : "text-gray-500"
                      }`}
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
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <UpgradeButton
                plan={plan.name.toLowerCase()}
                buttonText={
                  plan.name === "Starter"
                    ? "Start for Free"
                    : plan.name === "Pro"
                      ? "Get Started with Pro"
                      : "Get Started with Business"
                }
                isPopular={plan.popular}
              />
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3 justify-center">
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-[#0D121C]/60 p-6 rounded-2xl border border-gray-800/50 hover:border-green-500/30 transition-all"
              >
                <h3 className="text-lg font-bold mb-3 text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
