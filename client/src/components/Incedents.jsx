import { useEffect, useState } from "react";
import axios from "axios";

export default function Incidents() {
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState([]);

  const getAllIncidents=async()=>{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/incident/getAll`,
        {withCredentials: true}
      )
      console.log(response.data.incidents);
      setIncidents(response.data.incidents);
  }

  useEffect(()=>{
    getAllIncidents()
  },[])
  
  return (
    <div className="bg-[#101724] text-white min-h-screen p-5 md:p-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Incidents.</h1>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full md:w-60"
          />

          <select name="" id="" className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800">
            <option value="">All</option>
            <option value="">DNS-ERROR</option>
            <option value="">TIME-OUT</option>
            <option value="">NETWORK-ERROR</option>
            <option value="">UNKNOWN-ERROR</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-[#131e30] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-[80vw] text-sm ">
          <thead className="bg-[#0D121C] text-center text-gray-400">
            <tr>
              <th className="text-left px-4 py-3">Monitor</th>
              <th className="text-left px-4 py-3">Root Cause</th>
              <th className="text-left px-4 py-3">Started</th>
              <th className="text-left px-4 py-3">Resolved</th>
              <th className="text-left px-4 py-3">Duration</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((item, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#1A2333]"
              >
                <td className="px-4 py-3 text-gray-200 truncate max-w-full">
                  {item.monitorUrl}
                </td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="bg-red-500 text-xs px-2 py-[2px] rounded">
                    {item.incidentType}
                  </span>
                  <span>{item.incidentType}</span>
                </td>

                <td className="px-4 py-3 text-gray-400">
                  <span>{new Date(item.incidentStartTime).toLocaleString('en-GB').replace(',', '')}</span>
                </td>

                <td className="px-4 py-3 text-gray-400">
                  <span>{new Date(item.incidentEndTime).toLocaleString('en-GB').replace(',', '')}</span>
                </td>

                <td className="px-4 py-3">
                  {`${String(Math.floor(item.incidentDuration/3600000)).padStart(2,'0')}:${String(Math.floor(item.incidentDuration/60000)%60).padStart(2,'0')}:${String(Math.floor(item.incidentDuration/1000)%60).padStart(2,'0')}`}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {incidents.map((item, i) => (
          <div
            key={i}
            className="bg-[#131e30] border border-gray-800 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-sm">✔ {item.incidentType}</span>
              <span className="bg-red-500 text-xs px-2 py-[2px] rounded">
                {item.incidentType}
              </span>
            </div>

            <p className="text-sm text-gray-300 break-all">
              {item.monitorUrl}
            </p>

            <p className="text-sm">{item.incidentType}</p>

            <div className="text-xs text-gray-400 flex justify-between">
              <span>Started: {item.incidentStartTime }</span>
              <span>Resolved: {item.incidentEndTime }</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
