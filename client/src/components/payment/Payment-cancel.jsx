import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaymentCancel() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const reason = params.get("reason") || "unknown";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getReason = () => {
    switch (reason) {
      case "user_cancelled":
        return "You cancelled the payment process";
      case "insufficient_funds":
        return "Payment failed due to insufficient funds";
      case "card_declined":
        return "Your card was declined";
      case "expired_card":
        return "Your card has expired";
      case "processing_error":
        return "A processing error occurred";
      default:
        return "Payment was not completed";
    }
  };

  const getReasonIcon = () => {
    switch (reason) {
      case "user_cancelled":
        return "ℹ️";
      case "insufficient_funds":
      case "card_declined":
      case "expired_card":
        return "💳";
      case "processing_error":
        return "⚠️";
      default:
        return "❌";
    }
  };

  return (
    <div className="min-h-screen flex-1 overflow-y-auto p-3 sm:p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{
      background: "#0D121C",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard", { replace: true })}
        className="mt-0 ml-1 md:ml-0 inline-block px-4 py-2 rounded-lg mb-4 sm:mb-6 cursor-pointer font-bold  sm:text-lg transition text-white"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
          Payment Cancelled<span className="text-red-500">.</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          Your subscription payment was not completed
        </p>

        {/* Main content card */}
        <div className={`bg-[#0D121C] border border-gray-800 rounded-xl p-6 sm:p-8 md:p-10 space-y-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          
          {/* Error indicator */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/20">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Payment Not Completed</h2>
              <p className="text-gray-400 text-sm">{getReason()}</p>
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Session ID section */}
          {sessionId && (
            <>
              <section>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Session ID</h3>
                <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                  <p className="text-sm font-mono text-gray-300 break-all select-all">
                    {sessionId}
                  </p>
                </div>
              </section>

              <hr className="border-gray-800" />
            </>
          )}

          {/* Reason details */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">What Happened</h3>
            <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg space-y-3">
              {reason === "user_cancelled" && (
                <>
                  <p className="text-gray-300 text-sm">
                    You cancelled the payment process. Your subscription was not activated.
                  </p>
                  <p className="text-gray-400 text-xs">
                    No charges have been made to your account.
                  </p>
                </>
              )}
              
              {(reason === "insufficient_funds" || reason === "card_declined" || reason === "expired_card") && (
                <>
                  <p className="text-gray-300 text-sm">
                    There was an issue with your payment method:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 text-xs space-y-1">
                    {reason === "insufficient_funds" && (
                      <>
                        <li>Your account has insufficient funds</li>
                        <li>Please ensure you have enough balance available</li>
                      </>
                    )}
                    {reason === "card_declined" && (
                      <>
                        <li>Your card was declined by the payment processor</li>
                        <li>Try a different card or contact your bank</li>
                      </>
                    )}
                    {reason === "expired_card" && (
                      <>
                        <li>Your card has expired</li>
                        <li>Please update your card details</li>
                      </>
                    )}
                  </ul>
                </>
              )}

              {reason === "processing_error" && (
                <>
                  <p className="text-gray-300 text-sm">
                    A temporary error occurred while processing your payment.
                  </p>
                  <p className="text-gray-400 text-xs">
                    Please try again. If the issue persists, contact our support team.
                  </p>
                </>
              )}

              {reason === "unknown" && (
                <>
                  <p className="text-gray-300 text-sm">
                    Your payment could not be completed.
                  </p>
                  <p className="text-gray-400 text-xs">
                    Please check your payment details and try again.
                  </p>
                </>
              )}
            </div>
          </section>

          <hr className="border-gray-800" />

          {/* Troubleshooting tips */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Next Steps</h3>
            <div className="space-y-3">
              <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Try Again</h4>
                <p className="text-gray-400 text-sm mb-3">Return to the pricing page and attempt your subscription again with valid payment information.</p>
                <button
                  onClick={() => navigate("/pricing", { replace: true })}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-4 rounded transition text-sm"
                >
                  Go to Pricing
                </button>
              </div>

              <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Check Your Card</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Verify that your card details are correct, not expired, and has sufficient funds.
                </p>
              </div>

              <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Contact Support</h4>
                <p className="text-gray-400 text-sm mb-3">
                  If you continue to experience issues, our support team is here to help.
                </p>
                <button
                  onClick={() => navigate("/contact", { replace: true })}
                  className="w-full bg-[#172235] hover:bg-[#1e2a3f] text-white font-semibold py-2 px-4 rounded transition text-sm border border-gray-700"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </section>

          <hr className="border-gray-800" />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="flex-1 bg-[#121A28] border border-gray-700 hover:border-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
              </svg>
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/pricing", { replace: true })}
              className="flex-1 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Retry Payment
            </button>
          </div>
        </div>

        {/* Additional help section */}
        <div className="mt-8 bg-[#121A28] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Why was my payment declined?</h4>
              <p className="text-gray-400 text-sm">
                Payments can be declined for various reasons including insufficient funds, expired cards, incorrect billing information, or security concerns. Contact your bank for more details.
              </p>
            </div>

            <hr className="border-gray-800" />

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Will I be charged if my payment fails?</h4>
              <p className="text-gray-400 text-sm">
                No, you will only be charged if your payment is successfully processed. Failed payment attempts do not result in any charges.
              </p>
            </div>

            <hr className="border-gray-800" />

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Can I still use the free features?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can continue to use our platform with the free plan. Your subscription was simply not activated due to the payment not being completed.
              </p>
            </div>

            <hr className="border-gray-800" />

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">What if the issue persists?</h4>
              <p className="text-gray-400 text-sm">
                If you continue to experience payment issues, please don't hesitate to reach out to our support team. We're here to help resolve any problems.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>Need immediate assistance? <button onClick={() => navigate("/contact")} className="text-green-500 hover:text-green-400 transition">Contact our support team</button></p>
        </div>
      </div>
    </div>
  );
}