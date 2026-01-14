import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Incidents() {
  const [category, setCategory] = useState('all');
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");

  const getAllIncidents=async()=>{
      const response = await api.get("/incident/getAll",
        {withCredentials: true}
      )
      // console.log(response.data.incidents);
      setIncidents(response.data.incidents);
  }

  useEffect(()=>{
    getAllIncidents()
  },[])
  
  return (
    <div className="bg-[#101724] text-white min-h-screen p-4 sm:p-6 md:p-10 overflow-y-auto h-[100vh] w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold ml-12 mt-1.5 md:m-0">Incidents.</h1>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by Monitor URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full sm:w-60"
          />

          <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full sm:w-auto cursor-pointer ">
            <option value="all" selected>All</option>
            <option value="DNS-ERROR">DNS-ERROR</option>
            <option value="TIME-OUT">TIME-OUT</option>
            <option value="NETWORK-ERROR">NETWORK-ERROR</option>
            <option value="UNKNOWN-ERROR">UNKNOWN-ERROR</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-[#131e30] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0D121C] text-center text-gray-400">
            <tr>
              <th className="text-left px-4 py-3 whitespace-nowrap">Monitor</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Root Cause</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Started</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Resolved</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Duration</th>
            </tr>
          </thead>

          <tbody>
            {[...incidents].reverse().map((item, i) => {
              if(category !== "all" && item.incidentType !== category) return null;
              if(search && !item.monitorUrl.toLowerCase().includes(search.toLowerCase())) return null;
                
              return(
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#1A2333] transition "
              >
                <td className={"px-4 py-3 text-gray-200 max-w-xs truncate  " + (search ? "search-highlight" : "")}>
                  {item.monitorUrl}
                </td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="bg-red-500 text-xs px-2 py-[2px] rounded whitespace-nowrap">
                    {item.incidentType}
                  </span>
                  <span className="hidden lg:inline">{item.incidentType}</span>
                </td>

                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  <span>{new Date(item.incidentStartTime).toLocaleString('en-GB').replace(',', '')}</span>
                </td>

                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  <span>{new Date(item.incidentEndTime).toLocaleString('en-GB').replace(',', '')}</span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {`${String(Math.floor(item.incidentDuration/3600000)).padStart(2,'0')}:${String(Math.floor(item.incidentDuration/60000)%60).padStart(2,'0')}:${String(Math.floor(item.incidentDuration/1000)%60).padStart(2,'0')}`}
                </td>

              </tr>
            )})}
          </tbody>
        </table>
        {incidents.length === 0 && <p className="text-center text-gray-400 py-6">No Incidents found</p>}
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {incidents.map((item, i) => (
          <div
            key={i}
            className="bg-[#131e30] border border-gray-800 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-green-400 text-xs sm:text-sm">✔ {item.incidentType}</span>
              <span className="bg-red-500 text-xs px-2 py-1 rounded">
                {item.incidentType}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 break-all">
              {item.monitorUrl}
            </p>

            <p className="text-xs sm:text-sm font-semibold">{item.incidentType}</p>

            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between gap-2">
                <span>Started:</span>
                <span className="text-right">{new Date(item.incidentStartTime).toLocaleDateString('en-GB')}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Resolved:</span>
                <span className="text-right">{new Date(item.incidentEndTime).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
        ))}
        {incidents.length === 0 && <p className="text-center text-gray-400 py-6">No Incidents found</p>}
      </div>

    </div>
  );
}
