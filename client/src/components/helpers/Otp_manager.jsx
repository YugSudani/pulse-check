import { useRef } from "react";

export default function Otp_manager({ otp, setOtp, errors = {} }) {
  const OTP_LENGTH = 6;
  const inputsRef = useRef([]);

  // Handle typing
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      }

      setOtp(newOtp);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newOtp = [...otp];
    pasted
      .split("")
      .slice(0, OTP_LENGTH)
      .forEach((char, i) => {
        newOtp[i] = char;
      });

    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  return (
    <div>
      <div className="flex gap-1 pt-2  md:gap-[13px]" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-[20%] md:w-12.5 h-12 text-center text-lg rounded-lg 
              bg-[#121A28] text-gray-200 border
              focus:outline-none focus:ring-0 focus:border-gray-600
              ${errors?.otp ? "border-red-500" : "border-gray-700"}`}
          />
        ))}
      </div>

      {errors?.otp && <p className="text-red-400 text-sm mt-1">{errors.otp}</p>}
    </div>
  );
}
