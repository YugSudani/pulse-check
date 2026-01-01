import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const [form, setForm] = useState({
        email: "",
        pwd: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/user/login",
                form,
                { withCredentials: true }
            );
            await checkAuth();  // refresh auth state
            // SUCCESS (200)
            // alert(response.data.message);
            navigate("/dashboard" , {replace : true});

        } catch (error) {
            // If backend sent a response (e.g. 404, 401, 500)
            if (error.response) {
                const status = error.response.status;

                if (status === 404) {
                    alert("User not found");
                }
                else if (status === 401) {
                    alert("Wrong password");
                }
                else if (status === 500) {
                    alert("Server error, try again");
                }
            }
            else {
                // Network error (CORS, no internet, server down)
                alert("Network error");
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4 sm:px-6">

            <div className="w-full max-w-md bg-[#0D121C] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-800">

                {/* Title */}
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-6">
                    Welcome Back<span className="text-green-500">.</span>
                </h2>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-gray-300 block mb-1 text-sm sm:text-base">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base min-h-[44px]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-300 block mb-1 text-sm sm:text-base">Password</label>
                        <input
                            type="password"
                            name="pwd"
                            placeholder="Enter password"
                            value={form.pwd}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base min-h-[44px]"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 py-3 rounded-lg text-black font-semibold text-base sm:text-lg hover:bg-green-400 transition min-h-[44px]"
                    >
                        Login
                    </button>
                </form>

                {/* Bottom text */}
                <p className="text-center text-gray-400 mt-6 text-xs sm:text-sm">
                    Don't have an account?{" "}
                    <button onClick={() => navigate("/register", { replace: true })} className="text-green-500 cursor-pointer hover:underline">
                        Sign up
                    </button>
                </p>

            </div>
        </div>
    );
}
