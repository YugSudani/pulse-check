import { useState } from "react";
import api from "../../lib/api";

export default function PhoneNumberDialog({
  isOpen,
  onClose,
  onSave,
  loading = false,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saving, setSaving] = useState(false);

  const validatePhoneNumber = (number) => {
    // Indian phone number format: 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number.replace(/\D/g, ""));
  };

  const handlePhoneSubmit = async () => {
    setPhoneError("");

    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid 10-digit Indian phone number");
      return;
    }

    try {
      setSaving(true);
      // Save phone number to backend
      const response = await api.post("/user/saveCallNumber", {
        phoneNumber: `+91${phoneNumber}`,
      });

      if (response.status !== 200) {
        const data = response.data;
        setPhoneError(data.message || "Failed to save phone number");
        return;
      }

      // Phone saved successfully, call parent's save function
      onSave(phoneNumber);
    } catch (error) {
      console.error("Error saving phone number:", error);
      setPhoneError("Failed to save phone number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setPhoneError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mb-6 bg-[#121A28] border border-gray-700 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Enter Phone Number</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-200 transition text-sm font-medium"
        >
          ✕ Cancel
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          Enter your phone number for voice call alerts.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Phone Number
          </label>
          <div className="flex items-center">
            <span className="bg-[#0D121C] border border-gray-700 border-r-0 rounded-l-lg px-3 py-3 text-gray-400 font-medium text-sm">
              +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhoneNumber(value);
                setPhoneError("");
              }}
              placeholder="XXXXXXXXXX"
              className="flex-1 px-4 py-3 bg-[#0D121C] border border-gray-700 border-l-0 rounded-r-lg outline-none text-gray-200 text-sm placeholder-gray-500 focus:border-green-500 transition"
              maxLength="10"
            />
          </div>

          {phoneError && (
            <p className="text-red-500 text-xs mt-2">{phoneError}</p>
          )}

          <p className="text-gray-500 text-xs mt-2">
            This number will be used for voice call alerts when your monitor
            goes down.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePhoneSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-600 border-t-black rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Number"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
