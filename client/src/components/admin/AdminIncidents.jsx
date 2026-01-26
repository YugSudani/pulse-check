import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toast } from "sonner";

export default function AdminIncidents() {
  const navigate = useNavigate();

  // Incidents state
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [incidentSearch, setIncidentSearch] = useState("");
  const [incidentCategory, setIncidentCategory] = useState("all");

  // Pagination state
  const ITEMS_PER_PAGE = 20;
  const [incidentPage, setIncidentPage] = useState(1);
  const [totalIncidents, setTotalIncidents] = useState(0);

  // Statistics from database
  const [stats, setStats] = useState({
    incidents: {
      total: 0,
      dnsError: 0,
      timeout: 0,
      networkError: 0,
      unknownError: 0,
    },
  });

  // Fetch incidents when page changes
  useEffect(() => {
    fetchIncidents();
  }, [incidentPage]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (incidentPage !== 1) setIncidentPage(1);
    else fetchIncidents();
  }, [incidentSearch, incidentCategory]);

  // API Calls
  const fetchIncidents = async () => {
    try {
      setIncidentsLoading(true);
      const response = await api.get(
        `/admin/getIncidents?page=${incidentPage}&limit=${ITEMS_PER_PAGE}`,
      );
      setIncidents(response.data.incidents);
      setTotalIncidents(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
      toast.error("Failed to load incidents");
    } finally {
      setIncidentsLoading(false);
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

  // Client-side filtering
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.monitorUrl
      ?.toLowerCase()
      .includes(incidentSearch.toLowerCase());
    const matchesCategory =
      incidentCategory === "all" || incident.incidentType === incidentCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalIncidentPages = Math.ceil(totalIncidents / ITEMS_PER_PAGE);

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
          View Incidents<span className="text-green-500">.</span>
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="cursor-pointer px-4 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] transition text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.incidents.total}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">DNS Error</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.incidents.dnsError}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Timeout</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.incidents.timeout}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Network</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.incidents.networkError}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Unknown</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.incidents.unknownError}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Monitor URL"
          value={incidentSearch}
          onChange={(e) => setIncidentSearch(e.target.value)}
          className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 flex-1"
        />
        <select
          value={incidentCategory}
          onChange={(e) => setIncidentCategory(e.target.value)}
          className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full sm:w-auto cursor-pointer"
        >
          <option value="all">All</option>
          <option value="DNS-ERROR">DNS-ERROR</option>
          <option value="TIME-OUT">TIME-OUT</option>
          <option value="NETWORK-ERROR">NETWORK-ERROR</option>
          <option value="UNKNOWN-ERROR">UNKNOWN-ERROR</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#131e30] border border-gray-800 rounded-xl overflow-hidden max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600">
        {incidentsLoading ? (
          <div className="loader mx-auto my-20"></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0D121C] text-gray-400">
              <tr>
                <th className="text-left px-4 py-3">Monitor</th>
                <th className="text-left px-4 py-3">Root Cause</th>
                <th className="text-left px-4 py-3">Started</th>
                <th className="text-left px-4 py-3">Resolved</th>
                <th className="text-left px-4 py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-800 hover:bg-[#1A2333] transition"
                >
                  <td className="px-4 py-3 text-gray-200 max-w-xs truncate">
                    {incident.monitorUrl}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-red-500 text-xs px-2 py-1 rounded">
                      {incident.incidentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(incident.incidentStartTime)
                      .toLocaleString("en-GB")
                      .replace(",", "")}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(incident.incidentEndTime)
                      .toLocaleString("en-GB")
                      .replace(",", "")}
                  </td>
                  <td className="px-4 py-3">
                    {`${String(Math.floor(incident.incidentDuration / 3600000)).padStart(2, "0")}:${String(
                      Math.floor(incident.incidentDuration / 60000) % 60,
                    ).padStart(
                      2,
                      "0",
                    )}:${String(Math.floor(incident.incidentDuration / 1000) % 60).padStart(2, "0")}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredIncidents.length === 0 && !incidentsLoading && (
          <p className="text-center text-gray-400 py-6">No incidents found</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={incidentPage}
        totalPages={totalIncidentPages}
        onPageChange={setIncidentPage}
      />

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {incidentsLoading ? (
          <div className="loader mx-auto"></div>
        ) : (
          filteredIncidents.map((incident, i) => (
            <div
              key={i}
              className="bg-[#131e30] border border-gray-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="bg-red-500 text-xs px-2 py-1 rounded">
                  {incident.incidentType}
                </span>
              </div>
              <p className="text-sm text-gray-300 break-all">
                {incident.monitorUrl}
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span>
                    {new Date(incident.incidentStartTime).toLocaleDateString(
                      "en-GB",
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Resolved:</span>
                  <span>
                    {new Date(incident.incidentEndTime).toLocaleDateString(
                      "en-GB",
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        {filteredIncidents.length === 0 && !incidentsLoading && (
          <p className="text-center text-gray-400 py-10">No incidents found</p>
        )}
      </div>
    </div>
  );
}
