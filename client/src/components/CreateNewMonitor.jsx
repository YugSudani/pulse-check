import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import PhoneNumberDialog from "./staticComps/Phonenumberdialog ";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import PlayerIdVerification from "./helpers/PlayerIdVerification";

export default function CreateNewMonitor() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  // Derive subscription plan from AuthContext user
  const subscriptionPlan = user?.subscriptionPlan || "starter";

  // State for verified phone number - initialized from user data
  const [userCallNumber, setUserCallNumber] = useState("");

  // Set verified phone number from user data when available
  useEffect(() => {
    if (user?.phoneNumber.number) {
      setUserCallNumber(user.phoneNumber.number);
    }
  }, [user]);

  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [emailAlert, setEmailAlert] = useState(false);
  const [name, setName] = useState("New Monitor");
  const [pushAlert, setPushAlert] = useState(true);
  const [voiceCallAlert, setVoiceCallAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [showPlayerIdVerification, setShowPlayerIdVerification] = useState(false);

  // Predefined interval options in seconds
  const intervalOptions = [
    { value: 30 * 1000, label: "30 seconds" }, // 30000
    { value: 60 * 1000, label: "1 minute" }, // 60000
    { value: 300 * 1000, label: "5 minutes" }, // 300000
    { value: 1800 * 1000, label: "30 minutes" }, // 1800000
    { value: 3600 * 1000, label: "1 hour" }, // 3600000
    { value: 43200 * 1000, label: "12 hours" }, // 43200000
    { value: 86400 * 1000, label: "24 hours" }, // 86400000
  ];

  const [intervalIndex, setIntervalIndex] = useState(2); // default to 5 minutes (index 2)
  const interval = intervalOptions[intervalIndex].value;

  const isIntervalAllowed = (intervalValue) => {
    if (intervalValue === 30 * 1000) {
      return subscriptionPlan === "business";
    }

    if (intervalValue === 60 * 1000) {
      return subscriptionPlan === "pro" || subscriptionPlan === "business";
    }

    return true; // 5 min and above → all plans
  };

  const validateUrl = (url) => {
    if (!url) return "URL is required";
    if (url.length < 8) return "URL must be at least 8 characters";
    if (url.length > 300) return "URL must be at most 300 characters";
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
        return "URL must start with http:// or https://";
      if (!parsed.hostname.includes(".")) return "Invalid domain";
      return "";
    } catch {
      return "Invalid URL format";
    }
  };

  const handlePhoneNumberSave = (phoneNumber) => {
    // Phone number is saved in PhoneNumberDialog
    // Just update the local state
    setUserCallNumber(phoneNumber);
    setVoiceCallAlert(true);
    setPhoneDialogOpen(false);
  };

  const CreateMonitor = async () => {
    const error = validateUrl(url);
    if (error) {
      setUrlError(error);
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      if (user && !user.playerId) {
        toast.error(
          "in order to create monitor and receive alerts, please enable notifications.",
        );
        // setShowPlayerIdVerification(true);
        await checkAuth();
        setLoading(false);
        return;
      }

      const alertConfig = {
        email: { emailAlert },
        push: { pushAlert },
      };

      // Include voice call config if enabled
      if (voiceCallAlert && userCallNumber) {
        alertConfig.voiceCall = {
          voiceCallAlert,
          phoneNumber: `${userCallNumber}`,
        };
      }

      await api.post(
        "/monitor/createMonitor",
        {
          name,
          url,
          interval,
          alert: alertConfig,
        },
        { withCredentials: true },
      );
      toast.success("Monitor created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create monitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {showPlayerIdVerification && <PlayerIdVerification />}
      <button
        onClick={() => navigate("/dashboard", { replace: true })}
        className="mt-0 ml-1 md:ml-0 inline-block bg-[#121A28] px-4 py-2 rounded-lg mb-4 sm:mb-6 hover:bg-[#172235] cursor-pointer font-bold text-base sm:text-lg transition"
      >

        ← Monitoring
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Add single monitor<span className="text-green-500">.</span>
      </h1>

      <div className="bg-[#0D121C] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">
        {/* ================= MONITOR TYPE ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Monitor type
          </h2>

          <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm sm:text-base">
                HTTP / website monitoring
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Use HTTP(S) monitor to monitor your website, API endpoint, or
                anything running on HTTP.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-800" />

        {/* ================= URL INPUT ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            URL to monitor
          </h2>

          <input
            type="text"
            value={url}
            required
            placeholder="https://example.com"
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setUrlError(validateUrl(url))}
            maxLength="300"
            className={`w-full px-4 py-3 bg-[#121A28] border ${urlError ? "border-red-500" : "border-gray-700"} rounded-lg outline-none text-gray-200 text-sm sm:text-base`}
          />
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
        </section>

        {/* Tags */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Give Name to your monitor
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            Name to identify your monitor.
          </p>

          <input
            type="text"
            placeholder="Click to give name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 outline-none text-sm sm:text-base"
          />
        </div>

        <hr className="border-gray-800" />

        {/* ================= NOTIFICATIONS ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">
            How will we notify you?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Push */}
            <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                  onChange={(e) => setPushAlert(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-green-300"></div>
                Push Notification
              </label>
              <p className="text-gray-400 text-sm mb-3">Logged in browser</p>
              <p className="text-gray-500 text-xs">Instant, no repeat</p>
            </div>

            {/* Email */}
            <div className="relative bg-[#121A28] border border-gray-700 p-4 rounded-lg">
              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full
                           bg-blue-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider"
              >
                PRO
              </span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={
                    subscriptionPlan !== "pro" &&
                    subscriptionPlan !== "business"
                  }
                  className="sr-only peer disabled:color-grey-300 "
                  onChange={(e) => setEmailAlert(e.target.checked)}
                />
                <div
                  className="relative w-11 h-6 rounded-full bg-gray-600
                                peer-checked:bg-green-500
                                peer-disabled:bg-gray-700
                                peer-disabled:opacity-50
                                peer-disabled:cursor-not-allowed
                                after:content-['']
                                after:absolute after:top-[2px] after:left-[2px]
                                after:h-5 after:w-5 after:bg-white after:rounded-full
                                after:transition-all
                                peer-checked:after:translate-x-full"
                ></div>
                E-mail
              </label>
              {subscriptionPlan !== "pro" &&
                subscriptionPlan !== "business" && (
                  <div className="text-sm text-gray-400 mb-2">
                    🔒 Available only in Pro & Business plan.
                    <button
                      onClick={() => navigate("/pricing")}
                      className="text-green-500 ml-2 cursor-pointer"
                    >
                      Upgrade Now
                    </button>
                  </div>
                )}
              <p className="text-gray-400 text-sm mb-3">yourmail@gmail.com</p>
              <p className="text-gray-500 text-xs">Instant, no repeat</p>
            </div>

            {/* Voice call */}
            <div className="relative bg-[#121A28] border border-gray-700 p-4 rounded-lg transition-all hover:border-green-500/50">
              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full
                           bg-blue-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider"
              >
                BUSINESS
              </span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={subscriptionPlan !== "business"}
                  checked={voiceCallAlert}
                  onChange={(e) => {
                    if (subscriptionPlan === "business") {
                      if (e.target.checked && !userCallNumber) {
                        setPhoneDialogOpen(true);
                      } else {
                        setVoiceCallAlert(e.target.checked);
                      }
                    }
                  }}
                  className="sr-only peer"
                />
                <div
                  className="relative w-11 h-6 rounded-full bg-gray-600
                                peer-checked:bg-green-500
                                peer-disabled:bg-gray-700
                                peer-disabled:opacity-50
                                peer-disabled:cursor-not-allowed
                                after:content-['']
                                after:absolute after:top-[2px] after:left-[2px]
                                after:h-5 after:w-5 after:bg-white after:rounded-full
                                after:transition-all
                                peer-checked:after:translate-x-full"
                ></div>
                Voice call
              </label>

              {subscriptionPlan !== "business" && (
                <div className="text-sm text-gray-400 mb-2">
                  🔒 Available only in Business plan.
                  <button
                    onClick={() => navigate("/pricing")}
                    className="text-green-500 ml-2 cursor-pointer"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              {userCallNumber && (
                <div className="text-sm text-green-400 mb-2 flex items-center gap-2">
                  {user.phoneNumber.isVerified ? "✓ Verified":"Not Verified"}: {userCallNumber}
                  <button
                    onClick={() => {
                      setUserCallNumber("");
                      setVoiceCallAlert(false);
                      setPhoneDialogOpen(true);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-300 ml-auto"
                  >
                    Change
                  </button>
                </div>
              )}

              {subscriptionPlan === "business" && !userCallNumber && (
                <button
                  onClick={() => setPhoneDialogOpen(true)}
                  className="w-full text-sm text-gray-400 hover:text-green-400 transition border border-gray-700 hover:border-green-500/50 rounded py-1 px-2 mb-3"
                >
                  + Enter phone number
                </button>
              )}

              <p className="text-gray-500 text-xs">No delay, instant alerts</p>
            </div>
          </div>
        </section>

        {/* ================= PHONE NUMBER INPUT SECTION ================= */}
        {phoneDialogOpen && (
          <>
            <hr className="border-gray-800" />
            <PhoneNumberDialog
              isOpen={phoneDialogOpen}
              onClose={() => setPhoneDialogOpen(false)}
              onSave={handlePhoneNumberSave}
              loading={false}
            />
          </>
        )}

        <hr className="border-gray-800" />

        {/* ================= MONITOR INTERVAL ================= */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Monitor interval
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Your monitor will be checked every{" "}
            <span className="text-white font-semibold">
              {intervalOptions[intervalIndex].label}
            </span>
            .
          </p>

          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={intervalIndex}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              const selectedInterval = intervalOptions[newIndex].value;

              if (!isIntervalAllowed(selectedInterval)) {
                alert("Upgrade Your plan to use this features");
                return;
              }

              setIntervalIndex(newIndex);
            }}
            className="w-full accent-green-500"
          />
          {subscriptionPlan !== "pro" && (
            <div className="text-sm text-gray-400 mb-2">
              <span className="text-green-500 ml-2 cursor-pointer">
                ⚡ Faster intervals available on Pro & Business plans
              </span>
            </div>
          )}

          <div className="flex justify-between text-gray-500 text-xs mt-2">
            <span>30s</span>
            <span>1m</span>
            <span>5m</span>
            <span>30m</span>
            <span>1h</span>
            <span>12h</span>
            <span>24h</span>
          </div>
        </section>

        {/* ================= REGION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Region to monitor from</h2>

          <div className="text-sm text-gray-400 mb-2">
            🔒 Available only in Pro & Business plan.
            <button
              onClick={() => navigate("/pricing")}
              className="text-green-500 ml-2 cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>

          <select className="w-full bg-[#121A28] px-2 py-3 rounded-lg border border-gray-800 text-gray-300">
            <option>India</option>
          </select>
        </section>

        {/* ================= SUBMIT BUTTON ================= */}
        <div className="pt-6">
          <button
            onClick={CreateMonitor}
            disabled={loading}
            className="w-full bg-green-500 cursor-pointer text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-4 border-gray-400 border-t-green-700 rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Monitor"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
