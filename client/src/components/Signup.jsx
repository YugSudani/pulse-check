import api from "../lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", 
    email: "",
    pwd: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ----------------- VALIDATION FUNCTION -----------------
  const validate = () => {
    let newErrors = {};

    // NAME VALIDATION
    if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Name must contain only letters.";
    }
    if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (form.name.length > 30) {
      newErrors.name = "Name cannot exceed 30 characters.";
    }

    // EMAIL VALIDATION
    if (!form.email) {
      newErrors.email = "Email is required.";
    }

    // PASSWORD VALIDATION
    if (form.pwd.length < 6) {
      newErrors.pwd = "Password must be at least 6 characters.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.pwd)) {
      newErrors.pwd = "Password must include at least one special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validate()) return;

    try {
      await api.post(`/user/genOTP`, form);
      const response = await api.post(`/user/signup`, form);
      if (!response.data.success) {
        alert("failed to register");
      } else {
        navigate(`/otpVerification/${form.email}`, { replace: true });
      }
    } catch (error) {
      alert(error.response.data.message);
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
              Create Account
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Join us today</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --------- NAME FIELD --------- */}
            <div>
              <label className="text-gray-300 block mb-2 text-sm sm:text-base font-medium">
                Full Name
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`peer w-full pl-12 pr-4 py-3.5 bg-[#121A28]/60 backdrop-blur-sm border rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:bg-[#121A28] transition-all text-sm sm:text-base min-h-[48px]
                                        ${
                                          errors.name
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            : "border-gray-700/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                        }`}
                />
              </div>
              {errors.name && (
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
                  {errors.name}
                </p>
              )}
            </div>

            {/* --------- EMAIL FIELD --------- */}
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
                  className={`peer w-full pl-12 pr-4 py-3.5 bg-[#121A28]/60 backdrop-blur-sm border rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:bg-[#121A28] transition-all text-sm sm:text-base min-h-[48px]
                                        ${
                                          errors.email
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            : "border-gray-700/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                        }`}
                />
              </div>
              {errors.email && (
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
                  {errors.email}
                </p>
              )}
            </div>

            {/* --------- PASSWORD FIELD --------- */}
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
                  type="password"
                  name="pwd"
                  placeholder="Create password"
                  value={form.pwd}
                  onChange={handleChange}
                  required
                  className={`peer w-full pl-12 pr-4 py-3.5 bg-[#121A28]/60 backdrop-blur-sm border rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:bg-[#121A28] transition-all text-sm sm:text-base min-h-[48px]
                                        ${
                                          errors.pwd
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            : "border-gray-700/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                        }`}
                />
              </div>
              {errors.pwd && (
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
                  {errors.pwd}
                </p>
              )}
            </div>
            {isLoading && <span className="loader block my-10 mx-auto"></span>}

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-500 py-3.5 rounded-xl text-black font-semibold text-base sm:text-lg hover:bg-green-400 active:scale-[0.98] transition-all min-h-[52px] shadow-lg shadow-green-500/20"
            >
              Sign Up
            </button>
          </form>

          {/* Bottom text */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="text-green-500 font-medium hover:text-green-400 hover:underline transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
