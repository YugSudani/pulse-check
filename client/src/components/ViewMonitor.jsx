import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ResponseTimeChart from "./ResponseTimeChart";

export default function ViewMonitor() {

    const { id } = useParams();
    const [monitor, setMonitor] = useState(null);
    const [monitorStatusBtn, setMonitorStatusBtn] = useState(true);
    const [logData, setLogData] = useState([]);
    const [stats, setStats] = useState({ min: null, max: null, avg: null });
    const [range, setRange] = useState('15m');
    const [upDownTime, setUpDownTime] = useState(null);

    const fetchLogData = async (range) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/monitor/${id}/response-history?range=${range}`,
                { withCredentials: true }
            );
            const data = response.data;
            // console.log(data);
            setLogData(data.data);
            setStats(data.stats || { min: null, max: null, avg: null });
        } catch (error) {
            alert('failed to load log data');
            console.error('Error fetching log data:', error);
        }
    }

    const fetchMonitor = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/monitor/${id}`,
            { withCredentials: true }
        );
        const data = response.data;
        // console.log(data.monitor);
        setMonitor(data.monitor);
        setMonitorStatusBtn(data.monitor.isActive);
    } catch (error) {
        alert('failed to load monitor data');
        console.error('Error fetching monitor data:', error);
    }
};

useEffect(() => {
    fetchMonitor();

    const interval = setInterval(fetchMonitor, 15000);
    return () => clearInterval(interval);
}, [id]);

useEffect(() => {
    if (!monitor?.isActive) return;

    fetchLogData(range);
    const interval2 = setInterval(() => fetchLogData(range), 15000);
    return () => clearInterval(interval2);
}, [monitor?.isActive, range]);


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

 const updateUpDownTime = () => {
        const past = new Date(monitor?.currentUpDownTimeStart);
        const now = new Date();
        const diffMs = now - past;
        const diffHoursTime =
            diffMs / 1000 / 60 / 60 > 0.99
                ? (diffMs / 1000 / 60 / 60).toFixed(2) + " hours"
                : diffMs / 1000 / 60 > 0.99
                ? (diffMs / 1000 / 60).toFixed(0) + " min"
                : Math.floor(diffMs / 1000) + " sec";
        setUpDownTime(diffHoursTime.trim());
    }
// Live updating time ago
const [timeAgo, setTimeAgo] = useState('');

useEffect(() => {
    const updateTimeAgo = () => {
        if (!monitor?.lastCheckedAt) {
            ('Never checked');
            return;
        }

        const date = new Date(monitor.lastCheckedAt);
        const diff = Math.floor((Date.now() - date) / 1000);

        const time =
            diff < 60 ? `${diff}s` :
                diff < 3600 ? `${Math.floor(diff / 60)}m` :
                    diff < 86400 ? `${Math.floor(diff / 3600)}h` :
                        `${Math.floor(diff / 86400)}d`;

        setTimeAgo(time);
    };

    updateUpDownTime()

    updateTimeAgo(); // Initial update
    const interval = setInterval(updateTimeAgo, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
}, [monitor]);


return (
    <div className="overflow-y-auto h-[100vh] bg-[#101724] text-white p-8 md:p-12 flex gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 space-y-5">

            {/* BACK + TITLE */}
            <div className="">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-4 bg-[#131e30] px-8 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]"
                >
                    ← Monitoring
                </Link>

                <div className="flex w-[100%] p-3  items-center justify-between ">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {monitor?.name}
                        </h1>

                        <p className="text-gray-400 w-120 text-sm">
                            HTTPS monitor for{" "}
                            <a target="_blank" href={monitor?.url} className="text-green-500">
                                {monitor?.url}
                            </a>
                        </p>
                    </div>
                    <div className="p-2 flex items-center  justify-between gap-6">
                        <button className="bg-[#131e30] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]">Edit</button>
                        <button className="bg-[#131e30] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]" onClick={() => handlePause(monitor._id)}>{monitorStatusBtn ? "Pause" : "Resume"}</button>
                        <button className="bg-[#131e30] px-4 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333]">Test Notification</button>
                    </div>
                </div>
            </div>

            {/* ================= STATUS CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Current status</p>
                    <p className="font-bold text-xl leading-12 tracking-wider">{monitor?.lastStatus ? <p className={`text-${monitor?.lastStatus === "UP" ? "green-400" : "red-400"}`}>{monitor?.lastStatus}</p> : <p> - - </p>}</p>
                    <p className="text-gray-400 text-xs mt-1">
                        Currently {monitor?.lastStatus === "UP" ? "up" : "down"} for {upDownTime}
                    </p>
                </div>

                <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Last check</p>
                    <p className="font-semibold">{timeAgo} ago</p>
                    <p className="text-gray-400 text-md mt-1">
                        Checked every {monitor?.interval / 1000 / 60 > 0.99 ? monitor?.interval / 1000 / 60 + " min" : monitor?.interval / 1000 + " sec"}
                    </p>
                    <p className="text-green-500 text-md mt-1 ">Net Pulse Count : {monitor?.totalChecks}</p>
                </div>

                <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Last 24 hours</p>
                    <p className="font-semibold">100%</p>
                    <p className="text-gray-400 text-xs mt-1">
                        {monitor?.totalDown} incidents , 5m down
                    </p>
                </div>

            </div>

            {/* ================= UPTIME SUMMARY ================= */}
            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

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
            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Response time.</h2>
                    <select name="time" id="" onChange={(e) => setRange(e.target.value)} className="bg-[#2d3747] rounded-lg px-2 py-1 border-none outline-none focus:outline-none focus:ring-0">
                        <option value="5m">5m</option>
                        <option value="15m" selected>15m</option>
                        <option value="30m">30m</option>
                        <option value="2h">2h</option>
                        <option value="6h">6h</option>
                        <option value="12h">12h</option>
                        <option value="24h">24h</option>
                    </select>
                </div>

                {/* Fake graph placeholder */}
                <div className="h-55 bg-[#0D121C] rounded-lg p-2 mb-4">
                    <ResponseTimeChart data={logData} range={range} />
                </div>


                <div className="grid grid-cols-3 text-center text-sm">
                    <div>
                        <p className="text-gray-400">Average</p>
                        <p className="font-semibold">{stats.avg !== null ? `${stats.avg} ms` : '-- ms'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Minimum</p>
                        <p className="text-green-400 font-semibold">{stats.min !== null ? `${stats.min} ms` : '-- ms'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Maximum</p>
                        <p className="text-red-400 font-semibold">{stats.max !== null ? `${stats.max} ms` : '-- ms'}</p>
                    </div>
                </div>
            </div>

            {/* ================= LATEST INCIDENTS ================= */}
            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 ">
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

            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
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

            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Next maintenance.</h3>
                <p className="text-gray-400 text-sm mb-3">
                    No maintenance planned.
                </p>
                <button className="w-full bg-[#1A2333] py-2 rounded-lg">
                    Set up maintenance
                </button>
            </div>

            <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Regions.</h3>
                <p className="text-gray-400 text-sm">North America</p>
            </div>

        </aside>
    </div>
);
}
