import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

function UpgradeButton({ plan, buttonText, isPopular }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const { user } = useAuth();


  const handleUpgrade = async () => {
    // Handle Starter plan - show toast and redirect to dashboard
    if (plan === "starter") {
      toast.success("🎉 Enjoy your free plan!");
      navigate("/dashboard");
      return;
    }else if(plan === "starter" && user.subscriptionPlan !== "starter")
    {
      toast.error("You are already on a higher plan!");
      navigate("/dashboard");
      return;
    }

    if (plan === "pro" && user.subscriptionPlan === "pro")
    {
      toast.success("You Alredy have Pro plan!");
      navigate("/dashboard");
      return;
    }else if(plan === "pro" && user.subscriptionPlan === "business")
    {
      toast.error("You are already on a higher plan!");
      navigate("/dashboard");
      return;
    }

    if (plan === "business" && user.subscriptionPlan === "business")
    {
      toast.success("You Alredy have Business plan!");
      navigate("/dashboard");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/stripe/create-checkout-session", {
        plan,
      });

      window.location.href = data.url;
    } catch (e) {
      toast.error(e?.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
        ${
          isPopular
            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25"
            : "bg-[#1A202C] hover:bg-gray-700 text-white border border-gray-700"
        }
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        buttonText
      )}
    </button>
  );
}

export default UpgradeButton;
