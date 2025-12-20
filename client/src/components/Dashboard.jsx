import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {

    const navigate = useNavigate();

    const [monitors, setMonitors] = useState([]);

    const getMonitors = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/monitor/getAllMonitors`,
                { withCredentials: true }
            );
            console.log("data : " + response.data.monitors);
            if (response.data.message === 'Failed to get monitors') {
                // navigate("/login", { replace: true });
                alert("Failed to get monitors");
            } else {
                setMonitors(response.data.monitors);
            }
        } catch (error) {
            // navigate("/login", { replace: true });
            alert("Failed to get monitors");
        }
    }

    useEffect(() => {
        getMonitors();
    }, [])


    const deleteMonitor = async (id) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/monitor/deleteMonitor/${id}`,
                { withCredentials: true }
            );
            console.log("data : " + response.data.allMonitor);
            if (response.data.message === 'Failed to delete monitor') {
                alert("Failed to delete monitor");
            } else {
                setMonitors(response.data.allMonitor);
            }
        } catch (error) {
            alert("Failed to delete monitor");
        }
    }

    const [activeMenuId, setActiveMenuId] = useState(null);
    const toggleDeleteBox = (id) => {
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(id);
        }
    }

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
                <div className="h-64 md:h-130 flex flex-col gap-4 overflow-y-auto   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {monitors?.map((monitor) => (
                        <div key={monitor._id} onClick={() => navigate(`/monitor/${monitor._id}`)} className="bg-[#121A28] p-4 rounded-2xl py-5 relative cursor-pointer">
                            <div>Active : {monitor.isActive ? "Yes" : "No"}</div>
                            <h2 className="font-semibold">{monitor.name}</h2>
                            <div className="flex  justify-between items-center">
                                <p className="text-gray-400 flex-[7]">End Point : {monitor.url}</p>
                                <p className="px-2 flex-[2] text-gray-400">Interval : {monitor.interval / 1000 / 60 > 0.99 ? monitor.interval / 1000 / 60 + " min" : monitor.interval / 1000 + " sec"}</p>
                                <div onClick={(e) => { e.stopPropagation(); toggleDeleteBox(monitor._id) }} className=" flex-[1] h-10 w-10 flex items-center justify-center right-0 -translate-y-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 20 20"
                                        fill="white"
                                        className="cursor-pointer "
                                    >
                                        <path
                                            d="M15.498 8.50159C16.3254 8.50159 16.9959 9.17228 16.9961 9.99963C16.9961 10.8271 16.3256 11.4987 15.498 11.4987C14.6705 11.4987 14 10.8271 14 9.99963C14.0002 9.17228 14.6706 8.50159 15.498 8.50159Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M4.49805 8.50159C5.32544 8.50159 5.99689 9.17228 5.99707 9.99963C5.99707 10.8271 5.32555 11.4987 4.49805 11.4987C3.67069 11.4985 3 10.827 3 9.99963C3.00018 9.17239 3.6708 8.50176 4.49805 8.50159Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M9.99997 8.50159C10.8273 8.50176 11.4979 9.17239 11.4981 9.99963C11.4981 10.827 10.8274 11.4985 9.99997 11.4987C9.1725 11.4987 8.50098 10.8271 8.50098 9.99963C8.50116 9.17228 9.17261 8.50159 9.99997 8.50159Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                {activeMenuId === monitor._id && (
                                    <div className="absolute right-15 top-20 w-auto h-auto z-10">
                                        <div className="bg-[#121A28] border border-gray-700 p-2 rounded-xl flex flex-col gap-2 shadow-xl">
                                            <button onClick={() => EditMonitor()} className=" bg-transparent hover:bg-gray-800 px-4 py-1 rounded-lg text-left text-sm ">Edit monitor</button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteMonitor(monitor._id) }} className="bg-[#b83710] hover:bg-[#962d0d] text-center py-1 rounded-lg text-center">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {monitors?.length === 0 && (
                        <div className="p-4 rounded-2xl border-gray-800 text-center">
                            <p className="text-gray-400">No monitors found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* ================ RIGHT STATUS COLUMN ================ */}
            <aside className="hidden lg:block w-80 p-6 md:p-8 bg-[#0D121C] border-l border-gray-800">

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
