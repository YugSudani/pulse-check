import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [monitors, setMonitors] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const getMonitors = async () => {
    try {
      const response = await api.get(`/monitor/getAllMonitors`, {
        withCredentials: true,
      });
      // console.log("data : " + response.data.monitors);
      if (!response.data.success) {
        // alert("Failed to get monitors");
      } else {
        setMonitors(response.data.monitors);
      }
    } catch (error) {
      // navigate("/login", { replace: true });
      // alert("Failed to get monitors");
    }
  };

  useEffect(() => {
    getMonitors();
  }, []);

  const deleteMonitor = async (id) => {
    try {
      const { data } = await api.delete(`/monitor/deleteMonitor/${id}`, {
        withCredentials: true,
      });

      if (!data.success) {
        // alert(data.msg || "Failed to delete monitor");
        return;
      }
      // console.log("reaching here>>>>");
      setMonitors(data.monitors);
    } catch (error) {
      console.error(error);
      // alert("Failed to delete monitor");
    }
  };

  // const [downCount, setDownCount] = useState(0);
  // const [upCount, setUpCount] = useState(0);
  // const [pausedCount, setPausedCount] = useState(0);

  const downCount = monitors.filter((m) => m.lastStatus === "DOWN").length;

  const upCount = monitors.filter((m) => m.lastStatus === "UP").length;

  const pausedCount = monitors.filter((m) => m.isActive === false).length;

  const [activeMenuId, setActiveMenuId] = useState(null);
  const toggleDeleteBox = (id) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  return (
    <>
      {/* ================ MAIN CONTENT ================ */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 mt-14 md:mt-0">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Monitors<span className="text-green-500">.</span>
        </h1>

        {/* Controls Row */}
        <div className="relative flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" bg-[#131e30] px-4 py-2 rounded-lg text-gray-200 w-full sm:w-auto sm:flex-1 md:flex-none md:w-64 outline-none border border-gray-700 text-sm"
          />
          {search && (
            <span
              onClick={() => setSearch("")}
              className="absolute left-52 top-2 text-gray-400 cursor-pointer"
            >
              clear
            </span>
          )}

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#131e30] px-4 py-2 rounded-lg hover:bg-[#1A2333] transition text-sm"
          >
            <option value="all">All</option>
            <option value="UP">Up</option>
            <option value="DOWN">Down</option>
            <option value="PAUSED">Paused</option>
          </select>

          <button
            onClick={() => navigate("/create-new-monitor", { replace: true })}
            className="sm:ml-auto bg-[#1E3A8A] px-4 py-2 rounded-lg font-semibold w-full sm:w-auto cursor-pointer hover:bg-[#2563EB] transition text-sm"
          >
            + New
          </button>
        </div>

        {/* Status Cards - Mobile Only (shown above monitor list) */}
        <div className=" gap-3 mb-6 lg:hidden">
          {/* Current Status Card - Compact Mobile Version */}
          <div className="bg-[#131e30] p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-semibold mb-3 text-gray-300">
              Current status.
            </h3>

            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-black text-lg">▲</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div>
                <p className="text-gray-400 text-[10px]">Do</p>
                <p className="font-bold">{downCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px]">Up</p>
                <p className="font-bold">{upCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px]">Paused</p>
                <p className="font-bold">{pausedCount}</p>
              </div>
            </div>
          </div>

        </div>
        {/* Main Monitor List */}
        <div className="h-135 sm:h-130 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[...monitors].reverse().map((monitor) => {
            if (
              search &&
              !monitor.name.toLowerCase().includes(search.toLowerCase())
            )
              return null;
            if (category !== "all") {
              if (category === "UP" && monitor.lastStatus !== "UP") return null;
              if (category === "DOWN" && monitor.lastStatus === "UP")
                return null;
              if (category === "PAUSED" && monitor.isActive == true)
                return null;
            }

            return (
              <div
                key={monitor._id}
                onClick={() =>
                  navigate(`/monitor/${monitor._id}`, { replace: true })
                }
                className={`bg-[#131e30] p-4 sm:p-5 rounded-2xl relative cursor-pointer hover:bg-[#1A2333] transition  ${
                  search ? "search-highlight" : ""
                }`}
              >
                <h2 className="font-semibold text-base sm:text-lg mb-2">
                  {monitor.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <p className="text-gray-400 text-sm sm:text-base break-all sm:break-normal sm:flex-[7] sm:truncate">
                    End Point : {monitor.url}
                  </p>
                  <p className="text-gray-400 text-sm sm:text-base sm:px-2 sm:flex-[2]">
                    Interval :{" "}
                    {monitor.interval / 1000 / 60 > 0.99
                      ? monitor.interval / 1000 / 60 + " min"
                      : monitor.interval / 1000 + " sec"}
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDeleteBox(monitor._id);
                    }}
                    className="absolute bottom-4 right-4 h-10 w-10 flex items-center justify-center hover:bg-[#2A3444] rounded-lg transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 20 20"
                      fill="white"
                      className="cursor-pointer"
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
                    <div className="absolute right-6 top-31 sm:top-24 w-auto h-auto z-10">
                      <div className="bg-[#121A28] border border-gray-700 p-3 rounded-xl flex flex-col gap-2 shadow-xl min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-monitor/${monitor._id}`);
                          }}
                          className="bg-[#172742] px-4 py-2 md:w-30  rounded-lg text-xs sm:text-sm hover:bg-[#1A2333] cursor-pointer transition whitespace-nowrap"
                        >
                          Edit Monitor
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMonitor(monitor._id);
                          }}
                          className="bg-[#b83710] hover:bg-[#962d0d] text-center py-1 rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {monitor.isActive ? "Active" : "Inactive"} /{" "}
                  {monitor.lastStatus}
                </div>
              </div>
            );
          })}
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
        <div className="bg-[#131e30] p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="font-semibold mb-4">Current status.</h2>

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
              ▲
            </div>
          </div>

          <div className="flex justify-around text-center mb-3">
            <div>
              <p className="text-gray-400 text-sm">Down</p>
              <p className="text-lg font-bold">{downCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Up</p>
              <p className="text-lg font-bold">{upCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Paused</p>
              <p className="text-lg font-bold">{pausedCount}</p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Using 2 of 50 monitors.
          </p>
        </div>
      </aside>
    </>
  );
}
