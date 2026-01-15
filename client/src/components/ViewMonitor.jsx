import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import ResponseTimeChart from "./ResponseTimeChart";
import { useNavigate } from "react-router-dom";
import exportLogs from "./helpers/Logs_csv_generator";

export default function ViewMonitor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [monitor, setMonitor] = useState(null);
  const [monitorStatusBtn, setMonitorStatusBtn] = useState(true);
  const [logData, setLogData] = useState([]);
  const [stats, setStats] = useState({ min: null, max: null, avg: null });
  const [range, setRange] = useState("15m");
  const [upDownTime, setUpDownTime] = useState(null);

  const fetchLogData = async (range) => {
    try {
      const response = await api.get(
        `/monitor/${id}/response-history?range=${range}`,
        { withCredentials: true }
      );
      const data = response.data;
      // console.log(data);
      setLogData(data.data);
      setStats(data.stats || { min: null, max: null, avg: null });
    } catch (error) {
      alert("failed to load log data");
      console.error("Error fetching log data:", error);
    }
  };

  const fetchMonitor = async () => {
    try {
      const response = await api.get(`/monitor/${id}`, {
        withCredentials: true,
      });
      const data = response.data;
      // console.log(data.monitor);
      setMonitor(data.monitor);
      setMonitorStatusBtn(data.monitor.isActive);
    } catch (error) {
      alert("failed to load monitor data");
      console.error("Error fetching monitor data:", error);
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
      await api.patch(
        `/monitor/pause/${monitorId}`,
        {},
        { withCredentials: true }
      );
      setMonitorStatusBtn(!monitorStatusBtn);
    } catch (error) {
      alert("failed to pause monitor");
      console.error("Error pausing monitor:", error);
    }
  };

  const [incidents, setIncidents] = useState([]);
  const fetchIncidents = async () => {
    try {
      const response = await api.get(`/incident/${id}`, {
        withCredentials: true,
      });
      const data = response.data;
      setIncidents(data.incidents);
    } catch (error) {
      alert("failed to load incident data");
      console.error("Error fetching incident data:", error);
    }
  };

  const updateUpDownTime = () => {
    if (!monitor?.currentUpDownTimeStart) return;
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
  };

  //set stat
  const [stat, setStat] = useState({});
  const get24hStat = (incidents) => {
    const now = Date.now();
    const last24HoursStart = now - 24 * 60 * 60 * 1000; // 24h ago
    const incidentCount = incidents.length;
    let totalDowntimeMs = 0;

    incidents.forEach((incident) => {
      const start = new Date(incident.incidentStartTime).getTime();
      const end = incident.incidentEndTime
        ? new Date(incident.incidentEndTime).getTime()
        : now;

      // Clamp to 24h range
      const effectiveStart = Math.max(start, last24HoursStart);
      const effectiveEnd = Math.min(end, now);

      if (effectiveEnd > effectiveStart) {
        totalDowntimeMs += effectiveEnd - effectiveStart;
      }
    });
    const downtimeMinutes = Math.round(totalDowntimeMs / (1000 * 60));
    const totalTimeMs = 24 * 60 * 60 * 1000;
    const uptimePercentage =
      ((totalTimeMs - totalDowntimeMs) / totalTimeMs) * 100;
    const uptime = uptimePercentage.toFixed(2);

    setStat({
      incidentCount,
      downtimeMinutes,
      uptime,
    });
  };

  // Live updating time ago
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!monitor?.lastCheckedAt) {
        return;
      }

      const diff = Math.max(0, Math.floor((Date.now() - new Date(monitor.lastCheckedAt)) / 1000));

      const time =
        diff < 60
          ? `${diff}s`
          : diff < 3600
          ? `${Math.floor(diff / 60)}m`
          : diff < 86400
          ? `${Math.floor(diff / 3600)}h`
          : `${Math.floor(diff / 86400)}d`;

      setTimeAgo(time);
    };

    updateUpDownTime();
    get24hStat(incidents);
    fetchIncidents();

    updateTimeAgo(); // Initial update
    const interval = setInterval(updateTimeAgo, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, [monitor]);

  const triggerExportLog = () => {
    exportLogs(incidents, monitor);
  };

  const [showIncidentCount, setShowIncidentCount] = useState(3);

  return (
    <div className="overflow-x-hidden overflow-y-auto  h-[99vh] bg-[#101724] text-white p-4 sm:p-6 md:p-8 lg:p-12 flex gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 space-y-4 sm:space-y-5">
        {/* BACK + TITLE */}
        <div className="w-[93vw] md:w-[60vw]">
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="inline-flex items-center gap-2 ml-11 md:ml-0 mt-[2px] md:mt-0 sm:gap-4 bg-[#131e30] px-4 sm:px-8 py-2 rounded-lg text-sm mb-4 hover:bg-[#1A2333] cursor-pointer transition"
          >
            ← Monitoring
          </button>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {monitor?.name}
              </h1>

              <p className="text-gray-400 w-65 md:w-120 text-xs sm:text-sm">
                HTTPS monitor for{" "}
                <a
                  target="_blank"
                  href={monitor?.url}
                  className="text-green-500 hover:underline break-all"
                >
                  {monitor?.url}
                </a>
              </p>
            </div>
            <div className="flex flex-col w-17 md:w-30 xs:flex-row items-stretch xs:items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate(`/edit-monitor/${id}`)}
                className="bg-[#131e30] px-4 py-2 w-17 md:w-30  rounded-lg text-xs sm:text-sm hover:bg-[#1A2333] cursor-pointer transition whitespace-nowrap"
              >
                Edit
              </button>
              <button
                className="bg-[#131e30] px-4 py-2 w-17 md:w-30 rounded-lg text-xs sm:text-sm hover:bg-[#1A2333] cursor-pointer transition whitespace-nowrap"
                onClick={() => handlePause(monitor._id)}
              >
                {monitorStatusBtn ? "Pause" : "Resume"}
              </button>
              <button className="bg-[#131e30] px-4 py-2 w-17 md:w-30 rounded-lg text-xs sm:text-sm hover:bg-[#1A2333] cursor-pointer transition whitespace-nowrap">
                Test
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATUS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-[92vw] md:w-[60vw]">
          <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">
              Current status
            </p>
            <p className="font-bold text-lg sm:text-xl leading-tight tracking-wider">
              {monitor?.lastStatus ? (
                <p
                  className={`text-${
                    monitor?.lastStatus === "UP" ? "green-400" : "red-400"
                  }`}
                >
                  {monitor?.lastStatus}
                </p>
              ) : (
                <p>- - </p>
              )}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Currently {monitor?.lastStatus === "UP" ? "up" : "down"} for{" "}
              {upDownTime ? upDownTime : "- -"}
            </p>
          </div>

          <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Last check</p>
            <p className="font-semibold text-sm sm:text-base">
              {timeAgo ? timeAgo + " ago" : "Never checked"}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Checked every{" "}
              {monitor?.interval / 1000 / 60 > 0.99
                ? monitor?.interval / 1000 / 60 + " min"
                : monitor?.interval / 1000 + " sec"}
            </p>
            <p className="text-green-500 text-xs sm:text-sm mt-1">
              Net Pulse Count : {monitor?.totalChecks}
            </p>
          </div>

          <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">
              Last 24 hours
            </p>
            <p className="font-semibold text-sm sm:text-base">
              <p className="text-green-500">UP {stat?.uptime}%</p>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {monitor?.totalDown} incidents , {stat?.downtimeMinutes} min down
            </p>
          </div>
        </div>

        {/* ================= RESPONSE TIME ================= */}
        <div className="w-[93vw] md:w-[60vw] bg-[#131e30] border border-gray-800 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="font-semibold text-base sm:text-lg">
              Response time.
            </h2>
            <select
              name="time"
              id=""
              onChange={(e) => setRange(e.target.value)}
              className="bg-[#2d3747] rounded-lg px-3 py-2 text-sm border-none cursor-pointer outline-none focus:outline-none focus:ring-0 w-full sm:w-auto"
            >
              <option value="5m">5m</option>
              <option value="15m" selected>
                15m
              </option>
              <option value="30m">30m</option>
              <option value="2h">2h</option>
              <option value="6h">6h</option>
              <option value="12h">12h</option>
              <option value="24h">24h</option>
            </select>
          </div>

          {/* Fake graph placeholder */}
          <div className="h-48 sm:h-55 bg-[#0D121C] rounded-lg p-2 mb-4 overflow-hidden">
            <ResponseTimeChart data={logData} range={range} />
          </div>

          <div className="grid grid-cols-3 text-center text-xs sm:text-sm gap-2">
            <div>
              <p className="text-gray-400">Average</p>
              <p className="font-semibold text-sm sm:text-base">
                {stats.avg !== null ? `${stats.avg} ms` : "-- ms"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Minimum</p>
              <p className="text-green-400 font-semibold text-sm sm:text-base">
                {stats.min !== null ? `${stats.min} ms` : "-- ms"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Maximum</p>
              <p className="text-red-400 font-semibold text-sm sm:text-base">
                {stats.max !== null ? `${stats.max} ms` : "-- ms"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= LATEST INCIDENTS ================= */}
        <div className="w-[93vw] md:w-[60vw] bg-[#131e30] border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="font-semibold">Latest incidents.</h2>
            <button
              className="text-sm bg-[#1A2333] px-3 py-1 rounded-lg cursor-pointer"
              onClick={() => triggerExportLog()}
            >
              Export logs
            </button>
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className=" md:block bg-[#131e30] border border-gray-800 rounded-xl">
            <table className="text-sm w-full">
              <thead className="bg-[#0D121C] text-center text-gray-400">
                <tr>
                  <th className="text-left px-2 py-3">Root Cause</th>
                  <th className="text-left px-2 py-3">Started</th>
                  <th className="text-left px-2 py-3">Resolved</th>
                  <th className="text-left px-2 py-3">Duration</th>
                </tr>
              </thead>

              <tbody>
                {[...incidents]
                  .reverse()
                  .slice(0, showIncidentCount)
                  .map((item, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-800 hover:bg-[#1A2333]"
                    >
                      <td className="px-2 py-3 flex items-center gap-2">
                        <span className="bg-red-500 text-xs px-2 py-[2px] rounded">
                          {item.incidentType}
                        </span>
                      </td>

                      <td className="px-2 py-3 text-gray-400">
                        <span>
                          {new Date(item.incidentStartTime)
                            .toLocaleString("en-GB")
                            .replace(",", "")}
                        </span>
                      </td>

                      <td className="px-2 py-3 text-gray-400">
                        <span>
                          {new Date(item.incidentEndTime)
                            .toLocaleString("en-GB")
                            .replace(",", "")}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {`${String(
                          Math.floor(item.incidentDuration / 3600000)
                        ).padStart(2, "0")}:${String(
                          Math.floor(item.incidentDuration / 60000) % 60
                        ).padStart(2, "0")}:${String(
                          Math.floor(item.incidentDuration / 1000) % 60
                        ).padStart(2, "0")}`}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {incidents.length === 0 && (
              <p className="text-center text-gray-400 py-6">
                No Incidents found
              </p>
            )}
          </div>
          <div className="w-full flex p-4 justify-center justify-evenly text-sm gap-2">
            <button
              onClick={() => setShowIncidentCount(showIncidentCount + 5)}
              className="bg-[#1A2333] px-3 py-1 rounded-lg cursor-pointer"
            >
              Load More
            </button>
            <button
              onClick={() => setShowIncidentCount(3)}
              className="bg-[#1A2333] px-3 py-1 rounded-lg cursor-pointer"
            >
              Show Less
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      {/* ================= RIGHT SIDEBAR (PREMIUM GATED) ================= */}
      <aside className="hidden lg:block w-80 mt-13 space-y-5">
        {/* Domain & SSL */}
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Domain & SSL.</h3>
            <span className="text-xs text-yellow-400 border border-yellow-400/40 px-2 py-0.5 rounded-md">
              Pro
            </span>
          </div>

          <div className="space-y-4 text-sm opacity-50 select-none">
            <div>
              <p className="text-gray-400">Domain valid until</p>
              <p className="font-medium">Upgrade required</p>
            </div>

            <div>
              <p className="text-gray-400">SSL certificate valid until</p>
              <p className="font-medium">Upgrade required</p>
            </div>
          </div>

          <button className="mt-5 w-full bg-[#1A2333] cursor-pointer hover:bg-[#222d42] py-2 rounded-lg text-sm font-medium">
            Upgrade to unlock
          </button>
        </div>

        {/* Maintenance */}
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Next maintenance.</h3>
            <span className="text-xs text-yellow-400 border border-yellow-400/40 px-2 py-0.5 rounded-md">
              Pro
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-4 opacity-50 select-none">
            Scheduled maintenance windows are available on Pro plans.
          </p>

          <button className="w-full bg-[#1A2333] cursor-pointer hover:bg-[#222d42] py-2 rounded-lg text-sm font-medium">
            Upgrade to schedule
          </button>
        </div>

        {/* Regions */}
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Regions.</h3>
            <span className="text-xs text-yellow-400 border border-yellow-400/40 px-2 py-0.5 rounded-md">
              Pro
            </span>
          </div>

          <p className="text-gray-400 text-sm  mb-4 opacity-50 select-none">
            Multi-region checks (EU, Asia, AU) are available on Pro.
          </p>

          <button className="cursor-pointer w-full bg-[#1A2333] hover:bg-[#222d42] py-2 rounded-lg text-sm font-medium">
            Upgrade for more regions
          </button>
        </div>
      </aside>
    </div>
  );
}
