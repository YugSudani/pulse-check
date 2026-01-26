export default function AdminBadge({user, navigate}) {



    return (
        <div className="flex items-start justify-between mb-4 sm:mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Monitors<span className="text-green-500">.</span>
          </h1>

          {user?.role === "admin" && (
            <div className="group relative">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 backdrop-blur-sm hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-400 transition-all duration-300 cursor-pointer shadow-lg shadow-green-500/10 hover:shadow-green-500/20 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="text-sm font-semibold text-green-400 group-hover:text-green-300 transition-colors whitespace-nowrap">
                  Admin
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </button>

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-gray-700 whitespace-nowrap shadow-xl">
                  Admin Dashboard
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-225"></div>
                </div>
              </div>
            </div>
          )}
        </div>  
    )
}