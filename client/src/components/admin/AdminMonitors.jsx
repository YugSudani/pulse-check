import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toast } from "sonner";

export default function AdminMonitors() {
  const navigate = useNavigate();

  // Monitors state
  const [monitors, setMonitors] = useState([]);
  const [monitorsLoading, setMonitorsLoading] = useState(false);
  const [monitorSearch, setMonitorSearch] = useState("");

  // Pagination state
  const ITEMS_PER_PAGE = 20;
  const [monitorPage, setMonitorPage] = useState(1);
  const [totalMonitors, setTotalMonitors] = useState(0);

  // Action loading states
  const [pausingMonitorId, setPausingMonitorId] = useState(null);

  // Statistics from database
  const [stats, setStats] = useState({
    monitors: { total: 0, up: 0, down: 0 },
  });

  // Fetch monitors when page changes
  useEffect(() => {
    fetchMonitors();
  }, [monitorPage]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (monitorPage !== 1) setMonitorPage(1);
    else fetchMonitors();
  }, [monitorSearch]);

  // API Calls
  const fetchMonitors = async () => {
    try {
      setMonitorsLoading(true);
      const response = await api.get(
        `/admin/getAllMonitors?page=${monitorPage}&limit=${ITEMS_PER_PAGE}`,
      );
      setMonitors(response.data.monitors);
      setTotalMonitors(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch monitors:", error);
      toast.error("Failed to load monitors");
    } finally {
      setMonitorsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/getStats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  const handlePauseMonitor = async (monitorId, isActive) => {
    try {
      setPausingMonitorId(monitorId);
      const endpoint = isActive
        ? "/admin/pauseMonitor"
        : "/admin/resumeMonitor";
      await api.post(endpoint, { monitorId });

      // Update local state
      setMonitors(
        monitors.map((monitor) =>
          monitor._id === monitorId
            ? { ...monitor, isActive: !isActive }
            : monitor,
        ),
      );

      // Refetch stats to update counts
      fetchStats();

      toast.success(
        isActive
          ? "Monitor paused successfully"
          : "Monitor resumed successfully",
      );
    } catch (error) {
      console.error("Failed to update monitor:", error);
      toast.error("Failed to update monitor status");
    } finally {
      setPausingMonitorId(null);
    }
  };

  // Client-side filtering for search
  const filteredMonitors = monitors.filter((monitor) => {
    return (
      monitor.name?.toLowerCase().includes(monitorSearch.toLowerCase()) ||
      monitor.url?.toLowerCase().includes(monitorSearch.toLowerCase())
    );
  });

  // Pagination calculations using server totals
  const totalMonitorPages = Math.ceil(totalMonitors / ITEMS_PER_PAGE);

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer px-3 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
        >
          ← Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="cursor-pointer px-3 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] transition text-sm"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`cursor-pointer px-3 py-2 rounded-lg transition text-sm ${
              currentPage === page
                ? "bg-green-500 text-black font-semibold"
                : "bg-[#131e30] border border-gray-800 hover:bg-[#1A2333]"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer px-3 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] transition text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer px-3 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
        >
          Next →
        </button>

        <span className="text-sm text-gray-400 ml-2">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#101724] text-white p-4 sm:p-6 md:p-10 overflow-y-auto flex-1 min-h-0 h-full w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl ml-12 sm:ml-0 font-bold">
          Manage Monitors<span className="text-green-500">.</span>
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="cursor-pointer px-4 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] transition text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total Monitors</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.monitors.total}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Up</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.monitors.up}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Down</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.monitors.down}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or URL"
          value={monitorSearch}
          onChange={(e) => setMonitorSearch(e.target.value)}
          className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full sm:w-80"
        />
      </div>

      {/* Monitors Grid */}
      {monitorsLoading ? (
        <div className="loader mx-auto mt-20"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600">
          {filteredMonitors.map((monitor) => (
            <div
              key={monitor._id}
              className="bg-[#131e30] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-gray-700 transition"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">{monitor.name}</h3>
                <p className="text-sm text-gray-400 break-all">{monitor.url}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Interval:</span>
                <span className="font-medium">
                  {monitor.interval / 1000 / 60 > 0.99
                    ? `${monitor.interval / 1000 / 60} min`
                    : `${monitor.interval / 1000} sec`}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`font-medium ${
                    monitor.lastStatus === "UP"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {monitor.lastStatus || "UNKNOWN"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active:</span>
                <span
                  className={`text-sm font-medium ${
                    monitor.isActive ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {monitor.isActive ? "Yes" : "Paused"}
                </span>
              </div>

              <button
                onClick={() =>
                  handlePauseMonitor(monitor._id, monitor.isActive)
                }
                disabled={pausingMonitorId === monitor._id}
                className={`w-full py-2 rounded-lg font-semibold transition text-sm ${
                  pausingMonitorId === monitor._id
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : monitor.isActive
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "bg-green-500 hover:bg-green-400 text-black"
                }`}
              >
                {pausingMonitorId === monitor._id
                  ? "Processing..."
                  : monitor.isActive
                    ? "Pause Monitor"
                    : "Resume Monitor"}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredMonitors.length === 0 && !monitorsLoading && (
        <p className="text-center text-gray-400 py-10">No monitors found</p>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={monitorPage}
        totalPages={totalMonitorPages}
        onPageChange={setMonitorPage}
      />
    </div>
  );
}
