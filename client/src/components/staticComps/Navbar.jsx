import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useEffect, useState } from "react";

export default function Navbar()
{
    const navigate = useNavigate();

    const [user, setUser] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user/getMe", { withCredentials: true });
            setUser(response.data.success);
        } catch (error) {
            setUser(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="bg-[#0B0F17] h-[14vh] text-white px-4 sm:px-6 lg:px-20 py-4 ">
            <nav className="flex justify-between items-center gap-4 sm:gap-0 mb-9 sm:mb-9 backdrop-blur-sm bg-[#0D121C]/30 px-6 py-4 rounded-2xl border border-gray-800/50">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-green-400 transition"
                    >
                        PulseCheck
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-300 font-medium text-sm lg:text-base">
                     <button
                        onClick={() => navigate("/")}
                        className="hover:text-green-400 transition-colors relative group cursor-pointer"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
                    </button>
                    <button
                        onClick={() => navigate("/features")}
                        className="hover:text-green-400 transition-colors relative group cursor-pointer"
                    >
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
                    </button>
                    <button
                        onClick={() => navigate("/solutions")}
                        className="hover:text-green-400 transition-colors relative group cursor-pointer"
                    >
                        Solutions
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
                    </button>
                    <button
                        onClick={() => navigate("/resources")}
                        className="hover:text-green-400 transition-colors relative group cursor-pointer"
                    >
                        Resources
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
                    </button>
                    <button
                        onClick={() => navigate("/pricing")}
                        className="hover:text-green-400 transition-colors relative group cursor-pointer"
                    >
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all"></span>
                    </button>
                </div>

                {user ? (
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="backdrop-blur-sm bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-green-500/20 hover:border-green-500/50 cursor-pointer transition-all flex items-center gap-2"
                    >
                        Dashboard
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
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="backdrop-blur-sm bg-white/5 border border-gray-700/50 text-gray-300 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-white/10 hover:border-gray-600 hover:text-white cursor-pointer transition-all"
                    >
                        Login
                    </button>
                )}
            </nav>
        </div>
    )
}