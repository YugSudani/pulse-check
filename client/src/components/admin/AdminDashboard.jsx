import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  Users,
  Monitor,
  AlertTriangle,
  Activity,
  Bell,
  Mail,
  Phone,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Statistics from database
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, blocked: 0 },
    monitors: { total: 0, up: 0, down: 0 },
    incidents: {
      total: 0,
      dnsError: 0,
      timeout: 0,
      networkError: 0,
      unknownError: 0,
    },
  });

  const [statsLoading, setStatsLoading] = useState(false);




  const [notificationData, setNotificationData] = useState({
    pushEnabled: true,
    emailEnabled:true,
    callEnabled: true,
  });
  const handleGetNotificationData = async () => {
    console.log("fired");

    try {
      const response = await api.get("/admin/getNotifications")
      setNotificationData(response.data.sets);
      console.log("sets recieved : " + response.data.sets);
    } catch (err) {
      toast.success(response.data.msg);
    }
  }
  useEffect(() => {
  if (notificationData?.[0]?.notificationSetting) {
    setNotificationSettings({
      pushEnabled: notificationData[0].notificationSetting.push,
      emailEnabled: notificationData[0].notificationSetting.email,
      callEnabled: notificationData[0].notificationSetting.call,
    });
  }
}, [notificationData]);



  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/dashboard");
    }
    fetchStats();
    handleGetNotificationData();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get("/admin/getStats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Global notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled:"",
    emailEnabled: "",
    callEnabled: ""
  });
  console.log("data : " + notificationData[0]?.notificationSetting?.push);
  console.log("data : " + notificationData);

  const handleNotificationToggle = async () => {
    console.log("clicked");

    try {
      const response = await api.post("/admin/setNotifications",
        notificationSettings
      )
      toast.success(response.data.msg);
    } catch (err) {
      toast.success(response.data.msg);
    }
  }

  const navigationCards = [
    {
      title: "Manage Users",
      description: "View, block, and manage all users",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-500/10 border-blue-500/50 hover:border-blue-500",
      iconColor: "text-blue-400",
    },
    {
      title: "Manage Monitors",
      description: "Pause, resume and view all monitors",
      icon: Monitor,
      path: "/admin/monitors",
      color: "bg-green-500/10 border-green-500/50 hover:border-green-500",
      iconColor: "text-green-400",
    },
    {
      title: "View Incidents",
      description: "Track and analyze system incidents",
      icon: AlertTriangle,
      path: "/admin/incidents",
      color: "bg-red-500/10 border-red-500/50 hover:border-red-500",
      iconColor: "text-red-400",
    },
  ];

  // Calculate system health percentage using useMemo
  const systemHealth = useMemo(() => {
    if (!stats || !stats.monitors) return 0;
    if (stats.monitors.total === 0) return 100;
    return Math.round((stats.monitors.up / stats.monitors.total) * 100);
  }, [stats]);

  return (
    <div className="bg-[#101724] text-white p-4 sm:p-6 md:p-10 overflow-y-auto flex-1 min-h-0 h-full w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl ml-12 sm:ml-0 font-bold">
            Admin Dashboard<span className="text-green-500">.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 ml-12 sm:ml-0">
            Overview of your monitoring system
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer px-4 py-2 bg-[#131e30] border border-gray-800 rounded-lg hover:bg-[#1A2333] transition text-sm"
        >
          ← Back
        </button>
      </div>

      {statsLoading ? (
        <div className="loader mx-auto mt-20"></div>
      ) : (
        <>
          {/* System Health Indicator */}
          <div className="mb-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemHealth / 100)}`}
                      className={
                        systemHealth >= 80
                          ? "text-green-500"
                          : systemHealth >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{systemHealth}%</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-semibold">System Health</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  {stats.monitors.up} of {stats.monitors.total} monitors are
                  operational
                </p>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="text-green-400">
                    ● {stats.monitors.up} Up
                  </span>
                  <span className="text-red-400">
                    ● {stats.monitors.down} Down
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Overview Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Users Stats */}
              <div className="bg-[#131e30] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                  <h3 className="font-semibold text-lg">Users</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {stats.users.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Active</span>
                    <span className="text-green-400 font-medium">
                      {stats.users.active}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Blocked</span>
                    <span className="text-red-400 font-medium">
                      {stats.users.blocked}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monitors Stats */}
              <div className="bg-[#131e30] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-6 h-6 text-green-400" />
                  <h3 className="font-semibold text-lg">Monitors</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      {stats.monitors.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Up</span>
                    <span className="text-green-400 font-medium">
                      {stats.monitors.up}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Down</span>
                    <span className="text-red-400 font-medium">
                      {stats.monitors.down}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incidents Stats */}
              <div className="bg-[#131e30] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="font-semibold text-lg">Incidents</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-2xl font-bold text-red-400">
                      {stats.incidents.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">DNS</span>
                      <span className="text-red-400">
                        {stats.incidents.dnsError}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeout</span>
                      <span className="text-red-400">
                        {stats.incidents.timeout}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network</span>
                      <span className="text-red-400">
                        {stats.incidents.networkError}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unknown</span>
                      <span className="text-red-400">
                        {stats.incidents.unknownError}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Global Notification Settings Card */}
              <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-xl p-6">
                <Bell className="w-10 h-10 mb-4 text-yellow-400" />
                <h3 className="text-lg font-semibold mb-2">
                  Notification Settings
                </h3>
                <p className="text-gray-400 text-xs mb-4">
                  Global notification controls
                </p>

                <div className="space-y-3">
                  {/* Push Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Push</span>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushEnabled: !prev.pushEnabled,
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${notificationSettings.pushEnabled
                          ? "bg-green-500"
                          : "bg-gray-600"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.pushEnabled
                            ? "translate-x-5"
                            : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Email Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Email</span>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailEnabled: !prev.emailEnabled,
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${notificationSettings.emailEnabled
                          ? "bg-green-500"
                          : "bg-gray-600"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.emailEnabled
                            ? "translate-x-5"
                            : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Call Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Call</span>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          callEnabled: !prev.callEnabled,
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${notificationSettings.callEnabled
                          ? "bg-green-500"
                          : "bg-gray-600"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.callEnabled
                            ? "translate-x-5"
                            : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                  <button onClick={() => handleNotificationToggle()} className="bg-green-500 hover:bg-green-600 cursor-pointer rounded-[10px] h-8 w-30">Apply</button>
                </div>
              </div>

              {navigationCards.map((card) => (
                <div
                  key={card.path}
                  onClick={() => navigate(card.path)}
                  className={`cursor-pointer border rounded-xl p-6 transition-all ${card.color}`}
                >
                  <card.icon className={`w-10 h-10 mb-4 ${card.iconColor}`} />
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
