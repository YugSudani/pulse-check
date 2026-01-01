import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useEffect,useState } from "react";


export default function Home() {
    const navigate = useNavigate();

    const[user,setUser]=useState(false);

    const fetchUser=async()=>{
       try {
        const response = await api.get("/user/getMe",
            {withCredentials:true}
        );
        // console.log(response.data);
        setUser(response.data.success)
       } catch (error) {
        // console.log(error)
       }
    }
    useEffect(()=>{
        fetchUser();
    },[])
    
    return (
        <div className="min-h-screen bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-20 py-6">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center gap-4 sm:gap-0 mb-16 sm:mb-24">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                    <span className="text-green-500">⬤</span>
                    <button onClick={() => navigate("/", { replace: true })}>PulseCheck</button>
                </div>

                <div className="hidden md:flex items-center gap-6 lg:gap-10 text-gray-200 font-medium text-base lg:text-xl">
                    <button onClick={() => navigate("/features", { replace: true })} className="hover:text-green-400 transition">Features</button>
                    <button onClick={() => navigate("/solutions", { replace: true })} className="hover:text-green-400 transition">Solutions</button>
                    <button onClick={() => navigate("/enterprise", { replace: true })} className="hover:text-green-400 transition">Enterprise</button>
                    <button onClick={() => navigate("/resources", { replace: true })} className="hover:text-green-400 transition">Resources</button>
                    <button onClick={() => navigate("/pricing", { replace: true })} className="hover:text-green-400 transition">Pricing</button>
                </div>

{ user?
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-gray-300 font-bold text-base sm:text-lg md:text-xl px-4 py-2 rounded-md hover:text-green-400 cursor-pointer transition"
                >
                    Go to Dashboard →
                </button>
                :
                <button
                    onClick={() => navigate("/login", { replace: true })}
                    className="text-gray-300 font-bold text-base sm:text-lg md:text-xl px-4 py-2 rounded-md hover:text-green-400 cursor-pointer transition"
                >
                    Login
                </button>
}
            </nav>

            {/* MAIN HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

                {/* LEFT SIDE */}
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                        The world&apos;s leading <br />
                        <span className="text-green-500">Server monitoring</span> service.
                    </h1>

                    <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-300">
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-lg sm:text-xl">✔</span>
                            50 monitors for free
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-lg sm:text-xl">✔</span>
                            20+ integrations
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-lg sm:text-xl">✔</span>
                            Real-time alerts, web & mobile
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-lg sm:text-xl">✔</span>
                            Public status pages
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-lg sm:text-xl">✔</span>
                            Instant setup
                        </p>
                    </div>


                </div>

                {/* RIGHT DASHBOARD PREVIEW — NO LINK HERE NOW */}
                <div
                    className="bg-[#0F1522] p-4 sm:p-6 rounded-xl border border-gray-800 shadow-lg block hover:scale-[1.01] transition"
                >
                    <h2 className="text-lg sm:text-xl mb-4 font-semibold">Monitoring Dashboard</h2>

                    <div className="bg-[#131B2E] p-4 sm:p-5 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 flex items-center justify-center text-sm sm:text-base">
                                ✓
                            </div>

                            <div>
                                <p className="text-base sm:text-lg font-semibold">website.com</p>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    HTTPS monitor for http://example.com
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                            <div className="bg-[#0B101C] p-3 sm:p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-xs sm:text-sm">Current status</p>
                                <p className="text-green-400 font-semibold text-sm sm:text-base">Up</p>
                            </div>

                            <div className="bg-[#0B101C] p-3 sm:p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-xs sm:text-sm">Last check</p>
                                <p className="font-semibold text-sm sm:text-base">26 seconds ago</p>
                            </div>

                            <div className="bg-[#0B101C] p-3 sm:p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-xs sm:text-sm">Last 24 hours</p>
                                <p className="font-semibold text-sm sm:text-base">100%</p>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <p className="text-gray-400 text-xs sm:text-sm">Pulse stats</p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 text-xs sm:text-sm">
                                <div>
                                    <p>Last 7 days</p>
                                    <p className="text-green-400 font-semibold">100%</p>
                                </div>
                                <div>
                                    <p>Last 30 days</p>
                                    <p className="text-green-400 font-semibold">99.99%</p>
                                </div>
                                <div>
                                    <p>Last 365 days</p>
                                    <p className="text-green-400 font-semibold">99.98%</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
