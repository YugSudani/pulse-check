import api from "../lib/api";
import { useState } from "react";
import Otp_manager from "./helpers/Otp_manager";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function OtpVerification() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setErrors({ otp: "Enter complete OTP" });
      return;
    }

    const payload = {
      email,
      otp: finalOtp,
    };

    try {
      const response = await api.post(`/user/verifyOtp`, payload);
      if (!response.data.success) {
        toast.error("Failed to verify OTP");
      } else {
        toast.success("Email verified successfully!");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4 sm:px-6">
      {/* Glass Card */}
      <div className="w-full max-w-md">
        {/* Main Card with subtle glass effect */}
        <div className="relative backdrop-blur-sm bg-[#0D121C]/80 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-800/50">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              We Have sent you OTP on below email
            </p>
            <h3 className="text-green-600">{email}</h3>
            <span className="text-sm text-white">
              ( Check Spam section if needed )
            </span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --------- OTP FIELD --------- */}
            <div>
              <Otp_manager otp={otp} setOtp={setOtp} />
              {errors.otp && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.otp}
                </p>
              )}
            </div>
            {isLoading && <span className="loader block my-10 mx-auto"></span>}

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-500 py-3.5 rounded-xl text-black font-semibold text-base sm:text-lg hover:bg-green-400 active:scale-[0.98] transition-all min-h-[52px] shadow-lg shadow-green-500/20"
            >
              Verify OTP
            </button>
          </form>

          {/* Bottom text */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Didn't Received Email ?{" "}
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="text-green-500 font-medium hover:text-green-400 hover:underline transition-colors cursor-pointer"
              >
                Resend OTP
              </button>
            </p>
          </div>
          <div className="mt-2 text-center">
            <button
              onClick={() => navigate("/register", { replace: true })}
              className="text-green-500 font-medium hover:text-green-400 hover:underline transition-colors cursor-pointer"
            >
              Go Back & Change Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
