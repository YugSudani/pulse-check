import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function CreateNewMonitor() {
    const navigate = useNavigate();
    const intervalOptions = [
        { value: 30 * 1000, label: "30 seconds" },      // 30000
        { value: 60 * 1000, label: "1 minute" },        // 60000
        { value: 300 * 1000, label: "5 minutes" },      // 300000
        { value: 1800 * 1000, label: "30 minutes" },    // 1800000
        { value: 3600 * 1000, label: "1 hour" },        // 3600000
        { value: 43200 * 1000, label: "12 hours" },     // 43200000
        { value: 86400 * 1000, label: "24 hours" }      // 86400000
    ];
    
    const [intervalIndex, setIntervalIndex] = useState(2); // default to 5 minutes (index 2)
    
    const { id } = useParams();
    const [newMonitor, setNewMonitor] = useState({
        name: "",
        url: "",
        });

    // Predefined interval options in seconds

    const getMonitor = async () => {
        try {
            const response = await api.get(
                `/monitor/${id}`,
                { withCredentials: true }
            );
            // console.log(response.data);
            setNewMonitor(response.data.monitor);

             const idx = intervalOptions.findIndex(
                opt => opt.value === response.data.monitor.interval
            );
            setIntervalIndex(idx === -1 ? 2 : idx);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getMonitor();
    },[])


    const handleEditMonitor = async () => {
        const payload = {
            ...newMonitor,
            interval: intervalOptions[intervalIndex].value,
        };
        // console.log(payload); 

        try {
            const response = await api.put(
                `/monitor/editeMonitor/${id}`,
                payload,
                { withCredentials: true }
            );
            // console.log(response.data);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.log(error);
        }
        
    }


    return (
        <div className="overflow-y-auto h-[100vh] flex-1 p-3 sm:p-6 md:p-10">
            <button
                onClick={() => navigate("/dashboard", { replace: true })}
                className="mt-14 ml-1 md:ml-0 md:mt-0 inline-block bg-[#121A28] px-4 py-2 rounded-lg mb-4 sm:mb-6 hover:bg-[#172235] cursor-pointer font-bold text-base sm:text-lg transition"
            >
                ← Monitoring
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Edit Monitor<span className="text-green-500">.</span>
            </h1>

            <div className="bg-[#0D121C] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">

                <hr className="border-gray-800" />

                {/* ================= URL INPUT ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3">URL to monitor</h2>

                    <input
                        type="text"
                        value={newMonitor.url}
                        onChange={(e) => setNewMonitor({ ...newMonitor, url: e.target.value })}
                        className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg outline-none text-gray-200 text-sm sm:text-base"
                    />
                </section>

                {/* ================= GROUP + TAGS ================= */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                  
                    {/* Tags */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold mb-3">Give Name to your monitor</h2>

                        <p className="text-gray-400 text-xs sm:text-sm mb-2">
                            Name to identify your monitor.
                        </p>

                        <input
                            type="text"
                            placeholder="Click to give name..."
                            value={newMonitor.name}
                            onChange={(e) => setNewMonitor({ ...newMonitor, name: e.target.value })}
                            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 outline-none text-sm sm:text-base"
                        />
                    </div>

                </section>

                <hr className="border-gray-800" />

                {/* ================= NOTIFICATIONS ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">How will we notify you?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {/* Email */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" defaultChecked />
                                E-mail
                            </label>
                            <p className="text-gray-400 text-sm mb-3">yourmail@gmail.com</p>
                            <p className="text-gray-500 text-xs">No delay, no repeat</p>
                        </div>

                        {/* SMS */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" defaultChecked />
                                SMS message
                            </label>
                            <p className="text-gray-400 text-sm mb-3">919510502422 ⚠️</p>
                            <p className="text-gray-500 text-xs">No delay, no repeat</p>
                        </div>

                        {/* Voice call */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" defaultChecked />
                                Voice call
                            </label>
                            <p className="text-gray-400 text-sm mb-3">919510502422 ⚠️</p>
                            <p className="text-gray-500 text-xs">No delay, no repeat</p>
                        </div>

                    </div>

                    <p className="text-gray-400 text-sm mt-4">
                        You can set up notifications for Integrations & Team in their specific pages.
                    </p>
                </section>  

                <hr className="border-gray-800" />

                {/* ================= MONITOR INTERVAL ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3">Monitor interval</h2>

                    <p className="text-gray-400 text-xs sm:text-sm mb-4">
                        Your monitor will be checked every <span className="text-white font-semibold">{intervalOptions[intervalIndex].label}</span>.
                    </p>

                    <input
                        type="range"
                        min="0"
                        max={intervalOptions?.length - 1}
                        step="1"
                        value={intervalIndex}
                        onChange={(e) => setIntervalIndex(Number(e.target.value))}
                        className="w-full accent-green-500"
                    />

                    <div className="flex justify-between text-gray-500 text-xs mt-2">
                        <span>30s</span>
                        <span>1m</span>
                        <span>5m</span>
                        <span>30m</span>
                        <span>1h</span>
                        <span>12h</span>
                        <span>24h</span>
                    </div>
                </section>

                {/* ================= REGION ================= */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Region to monitor from</h2>

                    <div className="text-sm text-gray-400 mb-2">
                        🔒 Available only in Solo, Team, and Enterprise.
                        <span className="text-green-500 ml-2 cursor-pointer">Upgrade now</span>
                    </div>

                    <select className="w-full bg-[#121A28] px-2 py-3 rounded-lg border border-gray-800 text-gray-300">
                        <option>India</option>
                    </select>
                </section>

                {/* ================= SUBMIT BUTTON ================= */}
                <div className="pt-6">
                    <button onClick={handleEditMonitor} className="w-full bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition">
                        Update Monitor
                    </button>
                </div>

            </div>
        </div>
    );
}
