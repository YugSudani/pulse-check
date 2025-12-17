import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {

    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const GetUserData = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/user/getMe`,
                { withCredentials: true }
            );
            console.log(response.data);
            if (response.data.message === 'User not found') {
                navigate("/login", { replace: true });
            } else {
                setUserData(response.data)
            }
        } catch (error) {
            navigate("/login", { replace: true });
        }
    }

    const [monitors, setMonitors] = useState([]);

    const getMonitors = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/monitor/getAllMonitors`,
                { withCredentials: true }
            );
            console.log("data : " + response.data.monitors);
            if (response.data.message === 'Failed to get monitors') {
                alert("Failed to get monitors");
            } else {
                setMonitors(response.data.monitors);
            }
        } catch (error) {
            alert("Failed to get monitors");
        }
    }

    useEffect(() => {
        GetUserData();
        getMonitors();
    }, [])


    return (
        <>
            {/* ================ MAIN CONTENT ================ */}
            <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0">

                {/* Header */}
                <h1 className="text-3xl font-bold mb-6">
                    Monitors<span className="text-green-500">.</span>
                </h1>

                {/* Controls Row */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-[#121A28] px-4 py-2 rounded-lg text-gray-300">0 / 0</div>
                    <div className="bg-[#121A28] px-4 py-2 rounded-lg text-gray-300">Show groups</div>

                    <input
                        type="text"
                        placeholder="Search by name or URL"
                        className="bg-[#121A28] px-4 py-2 rounded-lg text-gray-200 w-full md:w-64 outline-none border border-gray-700"
                    />

                    <button className="bg-[#121A28] px-4 py-2 rounded-lg">Filter</button>
                    <button className="bg-[#121A28] px-4 py-2 rounded-lg">Down first ▾</button>

                    <Link to="/create-new-monitor" className="md:ml-auto bg-[#1E3A8A] px-4 py-2 rounded-lg font-semibold w-full md:w-auto">
                        + New ▾
                    </Link>
                </div>

                {/* Main Placeholder Table */}
                <div className="bg-[#121A28] border border-gray-800 rounded-xl h-64 md:h-72 mb-8">
                    {monitors?.map((monitor) => (
                        <div key={monitor._id} className="p-4">
                            <h2 className="font-semibold">{monitor.name}</h2>
                            <p className="text-gray-400">{monitor.url}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* ================ RIGHT STATUS COLUMN ================ */}
            <aside className="hidden lg:block w-80 p-6 bg-[#0D121C] border-l border-gray-800">

                {/* Current Status Card */}
                <div className="bg-[#121A28] p-6 rounded-xl border border-gray-800 mb-6">
                    <h2 className="font-semibold mb-4">Current status.</h2>

                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
                            ▲
                        </div>
                    </div>

                    <div className="flex justify-around text-center mb-3">
                        <div>
                            <p className="text-gray-400 text-sm">Down</p>
                            <p className="text-lg font-bold">0</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Up</p>
                            <p className="text-lg font-bold">1</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Paused</p>
                            <p className="text-lg font-bold">1</p>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-4">
                        Using 2 of 50 monitors.
                    </p>
                </div>

                {/* Last 24 Hours Card */}
                <div className="bg-[#121A28] p-6 rounded-xl border border-gray-800">
                    <h2 className="font-semibold mb-4">Last 24 hours.</h2>

                    <p className="text-red-400 font-bold text-xl">63.151%</p>
                    <p className="text-gray-400 text-sm mb-4">Overall uptime</p>

                    <div className="flex justify-between text-sm mb-3">
                        <p className="text-gray-400">Incidents</p>
                        <p>2</p>
                    </div>

                    <div className="flex justify-between text-sm">
                        <p className="text-gray-400">Affected mon.</p>
                        <p>1</p>
                    </div>

                    <p className="text-gray-400 text-sm mt-4">
                        23h, 34m Without incidents.
                    </p>
                </div>

            </aside>
        </>
    );
}
