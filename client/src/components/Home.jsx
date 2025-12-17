import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {

    
    return (
        <div className="min-h-screen bg-[#0B0F17] text-white px-6 lg:px-20 py-6">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center mb-24">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <span className="text-green-500">⬤</span>
                    <Link to="/">UptimeRobot</Link>
                </div>

                <div className="hidden md:flex items-center gap-10 text-gray-200 font-medium text-xl">
                    <Link to="/features">Features</Link>
                    <Link to="/solutions">Solutions</Link>
                    <Link to="/enterprise">Enterprise</Link>
                    <Link to="/resources">Resources</Link>
                    <Link to="/pricing">Pricing</Link>
                </div>

                <Link
                    to="/dashboard"
                    className="text-gray-300 font-bold text-lg md:text-xl px-4 py-2 rounded-md hover:text-green-400"
                >
                    Go to Dashboard →
                </Link>
            </nav>

            {/* MAIN HERO SECTION */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT SIDE */}
                <div>
                    <h1 className="text-5xl font-bold leading-tight">
                        The world&apos;s leading <br />
                        <span className="text-green-500">uptime monitoring</span> service.
                    </h1>

                    <div className="mt-10 space-y-4 text-lg text-gray-300">
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">✔</span>
                            50 monitors for free
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">✔</span>
                            20+ integrations
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">✔</span>
                            Real-time alerts, web & mobile
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">✔</span>
                            Public status pages
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-green-500 text-xl">✔</span>
                            Instant setup
                        </p>
                    </div>


                </div>

                {/* RIGHT DASHBOARD PREVIEW — NO LINK HERE NOW */}
                <div
                    className="bg-[#0F1522] p-6 rounded-xl border border-gray-800 shadow-lg block hover:scale-[1.01] transition"
                >
                    <h2 className="text-xl mb-4 font-semibold">Monitoring Dashboard</h2>

                    <div className="bg-[#131B2E] p-5 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                ✓
                            </div>

                            <div>
                                <p className="text-lg font-semibold">website.com</p>
                                <p className="text-sm text-gray-400">
                                    HTTPS monitor for http://example.com
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-[#0B101C] p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-sm">Current status</p>
                                <p className="text-green-400 font-semibold">Up</p>
                            </div>

                            <div className="bg-[#0B101C] p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-sm">Last check</p>
                                <p className="font-semibold">26 seconds ago</p>
                            </div>

                            <div className="bg-[#0B101C] p-4 rounded-md border border-gray-700">
                                <p className="text-gray-400 text-sm">Last 24 hours</p>
                                <p className="font-semibold">100%</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-gray-400 text-sm">Uptime stats</p>

                            <div className="flex gap-6 mt-2 text-sm">
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
