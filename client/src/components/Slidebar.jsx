import { useState } from "react";
import { Link } from "react-router-dom";

export default function Slidebar() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <>
            {/* ================ MOBILE SIDEBAR TOGGLE ================ */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[linear-gradient(0deg,_rgba(59,215,113,0.05)_0%,_rgb(20,32,45)_75%)] px-3 py-2 rounded-lg"
                onClick={() => setOpenSidebar(!openSidebar)}
            >
                ☰
            </button>

            {/* ================ LEFT SIDEBAR ================ */}
            <aside
                className={`
                    fixed md:static top-0 left-0 z-40
                    h-[100vh] w-67 bg-[linear-gradient(0deg,_rgba(59,215,113,0.05)_0%,_rgb(20,32,45)_75%)] border-r border-gray-800 p-6
                    flex flex-col justify-between
                    transform transition-transform duration-300
                    ${openSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >

                {/* Top Section */}
                <div>
                    <div className="pl-10 md:pl-0 flex items-center gap-2 text-2xl font-semibold mb-10">
                        <span className="text-green-500 text-xl">⬤</span>
                        PulseCheck
                    </div>

                    {/* Menu Items */}
                    <nav className="space-y-3 text-gray-300">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 p-3 bg-[#121A28] rounded-lg"
                        >
                            <span className="text-green-500">🟢</span> Monitoring
                        </Link>

                        <Link to="/incidents" className="flex items-center gap-3 p-3 hover:bg-[#121A28] rounded-lg transition">
                            🛡️ Incidents
                        </Link>

                        <Link to="/status-pages" className="flex items-center gap-3 p-3 hover:bg-[#121A28] rounded-lg transition">
                            📡 Status pages
                        </Link>

                        <Link to="/maintenance" className="flex items-center gap-3 p-3 hover:bg-[#121A28] rounded-lg transition">
                            🛠️ Maintenance
                        </Link>

                        <Link to="/team" className="flex items-center gap-3 p-3 hover:bg-[#121A28] rounded-lg transition">
                            👤 Team members
                        </Link>

                        <Link to="/integrations" className="flex items-center gap-3 p-3 hover:bg-[#121A28] rounded-lg transition">
                            🔗 Integrations & API
                        </Link>
                    </nav>
                </div>

                {/* User Bottom Section */}
                <div className="mt-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            YS
                        </div>
                        <p className="font-semibold">Yug Sudani</p>
                    </div>

                    <button className="w-full bg-green-500 text-black py-2 rounded-full font-semibold hover:bg-green-400 transition">
                        Upgrade now
                    </button>
                </div>

            </aside>
        </>
    );
}