import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Slidebar() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [userName, setUserName] = useState("");

  const fetchUser = async () => {
    const { data } = await api.get("/user/getMe");
    setUserName(data.name);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {/* ================ MOBILE SIDEBAR TOGGLE ================ */}
      <button
        className="md:hidden fixed top-4 left-4 z-5 bg-[linear-gradient(0deg,_rgba(59,215,113,0.05)_0%,_rgb(20,32,45)_75%)] px-3 py-2 rounded-lg hover:bg-[#1A2333] transition"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        {openSidebar ? "✕" : "☰"}
      </button>

      {/* ================ MOBILE BACKDROP ================ */}
      {openSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      {/* ================ LEFT SIDEBAR ================ */}
      <aside
        className={`
                    fixed md:static top-0 left-0 z-40
                    h-[100vh] w-72 md:w-67 bg-[linear-gradient(0deg,_rgba(59,215,113,0.05)_0%,_rgb(20,32,45)_75%)] border-r border-gray-800 p-6
                    flex flex-col justify-between
                    transform transition-transform duration-300 ease-in-out
                    ${
                      openSidebar
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }
                `}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold mb-10">
            <span className="text-green-500 text-lg sm:text-xl">⬤</span>
            PulseCheck
          </div>

          <button
            className="md:hidden fixed cursor-pointer top-6 right-5 z-50 bg-[linear-gradient(0deg,_rgba(59,215,113,0.2)_0%,_rgb(20,32,45)_75%)] px-3 py-2 rounded-md h-8 w-12 flex items-center justify-center hover:bg-[#393a3b] transition"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            ✕
          </button>

          {/* Menu Items */}
          <nav className="space-y-2 sm:space-y-3 text-gray-300">
            <button
              onClick={() => {
                navigate("/dashboard", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              <span className="text-green-500">🟢</span> Monitoring
            </button>

            <button
              onClick={() => {
                navigate("/incidents", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              🛡️ Incidents
            </button>

            <button
              onClick={() => {
                navigate("/status-pages", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              📡 Status pages
            </button>

            <button
              onClick={() => {
                navigate("/maintenance", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              🛠️ Maintenance
            </button>

            <button
              onClick={() => {
                navigate("/team", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              👤 Team members
            </button>

            <button
              onClick={() => {
                navigate("/integrations", { replace: true });
                setOpenSidebar(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px]"
            >
              🔗 Integrations & API
            </button>
          </nav>
        </div>

        {/* User Bottom Section */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">
              {userName?.split(" ")[0]?.charAt(0)?.toUpperCase()}
            </div>
            <p className="font-semibold text-sm sm:text-base">
              {userName}'s Workspace
            </p>
          </div>
          <div className="mb-2 flex justify-center">
            <button
              onClick={async () => {
                setOpenSidebar(false);
                await api.post("/user/logout");
                navigate("/login", { replace: true });
                await checkAuth();
              }}
              className="px-11 py-2 text-sm font-medium text-white 
                             bg-slate-800 rounded-md 
                            hover:bg-slate-700
                            focus:ring-2 focus:ring-slate-400 
                            transition cursor-pointer"
            >
              Logout
            </button>
          </div>

          <button className="w-full bg-green-500 text-black py-2 sm:py-2 rounded-full font-semibold hover:bg-green-400 transition min-h-[44px]">
            Upgrade now
          </button>
        </div>
      </aside>
    </>
  );
}
