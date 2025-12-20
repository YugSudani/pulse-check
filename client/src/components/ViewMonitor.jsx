import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewMonitor() {

    const { id } = useParams();
    const [monitor, setMonitor] = useState(null);
    const [monitorStatusBtn, setMonitorStatusBtn] = useState(true);

    useEffect(() => {
        const fetchMonitor = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/monitor/${id}`,
                    { withCredentials: true }
                );
                const data = response.data;
                console.log(data);
                setMonitor(data.monitor);
                setMonitorStatusBtn(data.monitor.isActive);
            } catch (error) {
                alert('failed to load monitor data');
                console.error('Error fetching monitor data:', error);
            }
        };
        fetchMonitor();
    }, []);

    const handlePause = async (monitorId) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/monitor/pause/${monitorId}`, {},
                { withCredentials: true }
            );
            setMonitorStatusBtn(!monitorStatusBtn);
        } catch (error) {
            alert('failed to pause monitor');
            console.error('Error pausing monitor:', error);
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#0B0F17] text-white p-8 md:p-12 flex gap-6">

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 space-y-5">

                {/* BACK + TITLE */}
                <div className="">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-4 bg-[#121A28] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]"
                    >
                        ← Monitoring
                    </Link>

                    <div className="flex w-[100%] p-3  items-center justify-between ">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {monitor?.name}
                            </h1>

                            <p className="text-gray-400 text-sm">
                                HTTPS monitor for{" "}
                                <a target="_blank" href={monitor?.url} className="text-green-500">
                                    {monitor?.url}
                                </a>
                            </p>
                        </div>
                        <div className="p-2 flex items-center  justify-between gap-6">
                            <button className="bg-[#121A28] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]">Edit</button>
                            <button className="bg-[#121A28] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]" onClick={() => handlePause(monitor._id)}>{monitorStatusBtn ? "Pause" : "Resume"}</button>
                            <button className="bg-[#121A28] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]">Test Notification</button>
                        </div>
                    </div>
                </div>

                {/* ================= STATUS CARDS ================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-1">Current status</p>
                        <p>Total checks : {monitor?.totalChecks}</p>
                        <p className="text-green-400 font-bold text-lg">{monitor?.lastStatus}Up</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Currently up for 12d 19h 57m
                        </p>
                    </div>

                    <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-1">Last check</p>
                        <p className="font-semibold">{monitor?.lastCheckedAt} ago</p>
                        <p className="text-gray-400 text-md mt-1">
                            Checked every {monitor?.interval / 1000 / 60}min
                        </p>
                    </div>

                    <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-1">Last 24 hours</p>
                        <p className="font-semibold">100%</p>
                        <p className="text-gray-400 text-xs mt-1">
                            {monitor?.totalDown} incidents , 5m down
                        </p>
                    </div>

                </div>

                {/* ================= UPTIME SUMMARY ================= */}
                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <p className="text-gray-400 text-sm">Last 7 days</p>
                        <p className="text-green-400 font-semibold text-lg">100%</p>
                        <p className="text-gray-400 text-xs">0 incidents</p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Last 30 days</p>
                        <p className="text-red-400 font-semibold text-lg">81.099%</p>
                        <p className="text-gray-400 text-xs">6 incidents</p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Last 365 days</p>
                        <p className="font-semibold text-lg">--.--%</p>
                        <p className="text-gray-400 text-xs">Unlock with paid plans</p>
                    </div>

                </div>

                {/* ================= RESPONSE TIME ================= */}
                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Response time.</h2>
                        <span className="text-sm text-gray-400">Last hour</span>
                    </div>

                    {/* Fake graph placeholder */}
                    <div className="h-40 bg-[#0D121C] rounded-lg mb-4" />

                    <div className="grid grid-cols-3 text-center text-sm">
                        <div>
                            <p className="text-gray-400">Average</p>
                            <p className="font-semibold">357 ms</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Minimum</p>
                            <p className="text-green-400 font-semibold">281 ms</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Maximum</p>
                            <p className="text-red-400 font-semibold">432 ms</p>
                        </div>
                    </div>
                </div>

                {/* ================= LATEST INCIDENTS ================= */}
                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Latest incidents.</h2>
                        <button className="text-sm bg-[#1A2333] px-3 py-1 rounded-lg">
                            Export logs
                        </button>
                    </div>

                    <div className="space-y-3 text-sm">

                        {[
                            {
                                code: "500",
                                cause: "Internal Server Error",
                                date: "Dec 5, 2025, 14:20",
                                duration: "0h 25m 39s",
                            },
                            {
                                code: "503",
                                cause: "Service Unavailable",
                                date: "Dec 4, 2025, 07:46",
                                duration: "1d 0h 19m",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-800 pb-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✔ Resolved</span>
                                    <span className="bg-red-500 text-xs px-2 rounded">
                                        {item.code}
                                    </span>
                                    <span>{item.cause}</span>
                                </div>

                                <div className="text-gray-400 text-xs md:text-sm">
                                    {item.date} · {item.duration}
                                </div>
                            </div>
                        ))}

                        <button className="w-full bg-[#1A2333] py-2 rounded-lg mt-2">
                            Load more incidents
                        </button>
                    </div>
                </div>

            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="hidden lg:block w-80 mt-20 space-y-5">

                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Domain & SSL.</h3>
                    <p className="text-gray-400 text-sm mb-2">
                        Domain valid until
                    </p>
                    <p className="font-semibold">Unlock</p>

                    <p className="text-gray-400 text-sm mt-4 mb-2">
                        SSL certificate valid until
                    </p>
                    <p className="font-semibold">Unlock</p>
                </div>

                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Next maintenance.</h3>
                    <p className="text-gray-400 text-sm mb-3">
                        No maintenance planned.
                    </p>
                    <button className="w-full bg-[#1A2333] py-2 rounded-lg">
                        Set up maintenance
                    </button>
                </div>

                <div className="bg-[#121A28] border border-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Regions.</h3>
                    <p className="text-gray-400 text-sm">North America</p>
                </div>

            </aside>
        </div>
    );
}
