import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateNewMonitor() {

    const navigate = useNavigate();

    const [url, setUrl] = useState(null);
    const [name, setName] = useState("New Monitor");
    const [emailAlert, setEmailAlert] = useState(true);
    const [pushAlert, setPushAlert] = useState(true);


    // Predefined interval options in seconds
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
    const interval = intervalOptions[intervalIndex].value;

    const CreateMonitor = async () => {
    //console.log(url + " | " + name + " | " + emailAlert + " | " + pushAlert);
        try {
            await api.post(
                "/monitor/createMonitor",
                {
                    name,
                    url,
                    interval,
                    alert: {
                        email: {emailAlert},
                        push: {pushAlert},
                    },
                },
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
                Add single monitor<span className="text-green-500">.</span>
            </h1>

            <div className="bg-[#0D121C] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">

                {/* ================= MONITOR TYPE ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3">Monitor type</h2>

                    <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-sm sm:text-base">HTTP / website monitoring</p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                Use HTTP(S) monitor to monitor your website, API endpoint, or anything running on HTTP.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-800" />

                {/* ================= URL INPUT ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3">URL to monitor</h2>

                    <input
                        type="text"
                        value={url}
                        required
                        placeholder="https://example.com"
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg outline-none text-gray-200 text-sm sm:text-base"
                    />
                </section>

                    {/* Tags */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold mb-3">Give Name to your monitor</h2>

                        <p className="text-gray-400 text-xs sm:text-sm mb-2">
                            Name to identify your monitor.
                        </p>

                        <input
                            type="text"
                            placeholder="Click to give name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-200 outline-none text-sm sm:text-base"
                        />
                    </div>


                <hr className="border-gray-800" />

                {/* ================= NOTIFICATIONS ================= */}
                <section>
                    <h2 className="text-lg sm:text-xl font-semibold mb-1">How will we notify you?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {/* Push */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" onChange={(e)=>setPushAlert(e.target.checked)} />
                                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-green-300"></div>
                                Push Notification
                            </label>
                            <p className="text-gray-400 text-sm mb-3">Loged in browser</p>
                            <p className="text-gray-500 text-xs">Instant, no repeat</p>
                        </div>
                        
                        {/* Email */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer " onChange={(e)=>setEmailAlert(e.target.checked)} />
                                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-green-300"></div>
                                E-mail
                            </label>
                            <p className="text-gray-400 text-sm mb-3">yourmail@gmail.com</p>
                            <p className="text-gray-500 text-xs">Instant, no repeat</p>
                        </div>

                        {/* Voice call */}
                        <div className="bg-[#121A28] border border-gray-700 p-4 rounded-lg">
                            <label className="flex items-center gap-2 mb-2 cursor-not-allowed opacity-50">
                                <input type="checkbox" disabled className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-green-300"></div>
                                Voice call
                            </label>
                            <div className="text-sm text-gray-400 mb-2">
                                🔒 Available only in Pro & Bussiness plan.
                                <span className="text-green-500 ml-2 cursor-pointer">Upgrade now</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">+91******2422</p>
                            <p className="text-gray-500 text-xs">No delay, no repeat</p>
                        </div>

                    </div>
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
                        max="6"
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
                        🔒 Available only in Pro & Business plan.
                        <span className="text-green-500 ml-2 cursor-pointer">Upgrade now</span>
                    </div>

                    <select className="w-full bg-[#121A28] px-2 py-3 rounded-lg border border-gray-800 text-gray-300">
                        <option>India</option>
                    </select>
                </section>

                {/* ================= SUBMIT BUTTON ================= */}
                <div className="pt-6">
                    <button onClick={CreateMonitor} className="w-full bg-green-500 cursor-pointer text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition">
                        Create Monitor
                    </button>
                </div>

            </div>
        </div>
    );
}
