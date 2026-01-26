import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import setOneSignalPlayerId from "./helpers/setOneSignalPlayerId";
import Otp_manager from "./helpers/Otp_manager";
import { toast } from "sonner";
import GoogleLoginButton from "./Google.jsx/GoogleLoginButton";

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [loginMethod, setLoginMethod] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const handleNotificationToggle = async () => {
    if (notificationLoading) return;
    setNotificationLoading(true);

    if (notificationsEnabled) {
      // User wants to disable notifications
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.User.PushSubscription.optOut();
          setNotificationsEnabled(false);
          setPlayerId(null);
          //console.log("Notifications disabled");
        } catch (err) {
          console.error("Error disabling notifications:", err);
        } finally {
          setNotificationLoading(false);
        }
      });
    } else {
      // User wants to enable notifications
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          // Listen for subscription changes
          const handleSubscriptionChange = async (event) => {
            if (event.current.id) {
              setPlayerId(event.current.id);
              setNotificationsEnabled(true);
              //console.log("OneSignal Player ID:", event.current.id);
              setNotificationLoading(false);
              // Remove listener after getting the ID
              OneSignal.User.PushSubscription.removeEventListener(
                "change",
                handleSubscriptionChange,
              );
            }
          };

          // Add event listener before opting in
          OneSignal.User.PushSubscription.addEventListener(
            "change",
            handleSubscriptionChange,
          );

          // Opt in to push notifications
          await OneSignal.User.PushSubscription.optIn();

          // Also check immediately in case ID is already available
          const id = await OneSignal.User.PushSubscription.id;
          if (id) {
            setPlayerId(id);
            setNotificationsEnabled(true);
            setNotificationLoading(false);
            OneSignal.User.PushSubscription.removeEventListener(
              "change",
              handleSubscriptionChange,
            );
          }
        } catch (err) {
          console.error("Notification prompt error:", err);
          setNotificationLoading(false);
        }
      });
    }
  };

  const [form, setForm] = useState({
    email: "",
    pwd: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/user/genOTP", {
        ...form,
        isForSignup: false,
      });

      if (response.data.success) {
        setShowOtpField(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
        setShowOtpField(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setShowOtpField(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notificationsEnabled) {
      toast.error("in order to create monitor and receive alerts, please enable notifications.");
      return;
    }

    setIsLoading(true);
    const finalOtp = otp.join("");

    const payload = {
      ...form,
      otp: finalOtp,
    };
    try {
      // Login
      await api.post("/user/login", payload, { withCredentials: true });

      await checkAuth();

      // Send player ID to backend if user enabled notifications
      await setOneSignalPlayerId(playerId);

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          toast.error("User not found");
        } else if (status === 401) {
          toast.error(error.response.data.message);
        } else if (status === 400) {
          toast.error(error.response.data.message);
        } else if (status === 403) {
          toast.error(error.response.data.message);
          await api.post(`/user/genOTP`, form);
          navigate(`/otpVerification/${form.email}`, { replace: true });
        } else if (status === 500) {
          toast.error("Server error, try again");
        }
      } else {
        toast.error("Network error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-sm bg-[#0D121C]/80 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-800/50">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL FIELD */}
            <div>
              <label className="text-gray-300 block mb-2 text-sm sm:text-base font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg
                    className="w-5 h-5 text-gray-400 peer-focus:text-green-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="peer w-full pl-12 pr-4 py-3.5 bg-[#121A28]/60 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:bg-[#121A28] focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-sm sm:text-base min-h-[48px]"
                />
              </div>
            </div>

            {/* LOGIN METHOD TOGGLE */}
            <div>
              <div className="flex gap-2 p-1 bg-[#121A28]/60 rounded-xl border border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setShowOtpField(false);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    loginMethod === "password"
                      ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Password
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("otp")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    loginMethod === "otp"
                      ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    OTP
                  </div>
                </button>
              </div>
            </div>

            {/* PASSWORD OR OTP FIELDS */}
            {loginMethod == "password" ? (
              <div>
                <label className="text-gray-300 block mb-2 text-sm sm:text-base font-medium">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-5 h-5 text-gray-400 peer-focus:text-green-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pwd"
                    placeholder="Enter password"
                    value={form.pwd}
                    onChange={handleChange}
                    className="peer w-full pl-12 pr-12 py-3.5 bg-[#121A28]/60 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:bg-[#121A28] focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-sm sm:text-base min-h-[48px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 text-sm sm:text-base font-medium">
                    One-Time Password
                  </label>
                  {!showOtpField && (
                    <button
                      type="button"
                      disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
                      onClick={handleSendOtp}
                      className="disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 bg-green-500 hover:bg-green-400 font-semibold cursor-pointer px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all"
                    >
                      Send OTP
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="w-8 h-8 text-green-500 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : showOtpField ? (
                  <div>
                    <Otp_manager otp={otp} setOtp={setOtp} />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-green-500 hover:text-green-400 text-xs mt-3 mx-auto block transition-colors"
                    >
                      Resend OTP
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Click "Send OTP" to receive your code
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TOGGLE */}
            <div
              onClick={handleNotificationToggle}
              className={`relative cursor-pointer p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                notificationLoading ? "opacity-75 cursor-wait" : ""
              } ${
                notificationsEnabled
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-[#121A28]/60 border-gray-700/50 hover:bg-[#121A28] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      notificationsEnabled
                        ? "bg-green-500/20"
                        : "bg-gray-700/50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors duration-300 ${
                        notificationsEnabled
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                        notificationsEnabled
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      Push Notifications
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {notificationsEnabled
                        ? "Enabled - Click to disable"
                        : "Click to enable notifications"}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    notificationsEnabled ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                      notificationsEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  >
                    {notificationLoading ? (
                      <svg
                        className="w-3 h-3 text-gray-600 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      notificationsEnabled && (
                        <svg
                          className="w-3 h-3 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isLoading && <span className="loader block my-10 mx-auto"></span>}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-green-500 py-3.5 rounded-xl text-black font-semibold text-base sm:text-lg hover:bg-green-400 active:scale-[0.98] transition-all min-h-[52px] shadow-lg shadow-green-500/20"
            >
              Login
            </button>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Don't have an account?{" "}
              <button
                className="text-green-500 font-medium hover:text-green-400 hover:underline transition-colors"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
              <div className="mt-2">
                <GoogleLoginButton />
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
