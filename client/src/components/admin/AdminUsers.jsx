import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toast } from "sonner";

export default function AdminUsers() {
  const navigate = useNavigate();

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  // Pagination state
  const ITEMS_PER_PAGE = 20;
  const [userPage, setUserPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Action loading states
  const [blockingUserId, setBlockingUserId] = useState(null);

  // Statistics from database
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, blocked: 0 },
  });

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers();
  }, [userPage]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (userPage !== 1) setUserPage(1);
    else fetchUsers();
  }, [userSearch, planFilter]);

  // API Calls
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get(
        `/admin/getAllUsers?page=${userPage}&limit=${ITEMS_PER_PAGE}`,
      );
      setUsers(response.data.users);
      setTotalUsers(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
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

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      setBlockingUserId(userId);
      const endpoint = isBlocked ? "/admin/unblockUser" : "/admin/blockUser";
      await api.post(endpoint, { userId });

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user,
        ),
      );

      // Refetch stats to update counts
      fetchStats();

      toast.success(
        isBlocked ? "User unblocked successfully" : "User blocked successfully",
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user status");
    } finally {
      setBlockingUserId(null);
    }
  };

  // Client-side filtering for search/filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesPlan =
      planFilter === "all" || user.subscriptionPlan === planFilter;
    return matchesSearch && matchesPlan;
  });

  // Pagination calculations using server totals
  const totalUserPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

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
            className={`cursor-pointer px-3 py-2 rounded-lg transition text-sm ${currentPage === page
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
          Manage Users<span className="text-green-500">.</span>
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
          <p className="text-gray-400 text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.users.total}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.users.active}
          </p>
        </div>
        <div className="bg-[#131e30] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-1">Blocked Users</p>
          <p className="text-3xl font-bold text-red-400">
            {stats.users.blocked}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 flex-1"
        />
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-[#131e30] px-4 py-2 rounded-lg text-sm outline-none border border-gray-800 w-full sm:w-auto cursor-pointer"
        >
          <option value="all">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Users Grid */}
      {usersLoading ? (
        <div className="loader mx-auto mt-20"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-[radial-gradient(circle_at_top,#1b2b45_0%,#131e30_40%,#0b1220_100%)] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex w-auto items-center justify-between">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <span
                  className={`m-2 text-xs px-2 py-1 rounded-full ${user.role === "admin"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-700 text-gray-300"
                    }`}
                >
                  {user.role || "user"}
                </span>
                </div>
                {user.avatar && <img src={user?.avatar} alt="DP" className="rounded-full h-15 w-15 ml-2" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email :</span>
                <span
                  className={`text-sm font-medium text-green-400`}
                >
                  {user.email}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Plan:</span>
                <span className="font-medium capitalize">
                  {user.subscriptionPlan || "starter"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status:</span>
                <span
                  className={`text-sm font-medium ${user.isBlocked ? "text-red-400" : "text-green-400"
                    }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">playerId:</span>
                <span
                  className="text-sm font-medium text-green-400"
                >
                  {user.playerId ? user.playerId : "- - - -"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">provider :</span>
                <span
                  className="text-sm font-medium text-green-400"
                >
                  {user.provider}
                </span>
              </div>

              <button
                onClick={() => handleBlockUser(user._id, user.isBlocked)}
                disabled={user.role === "admin" || blockingUserId === user._id}
                className={`cursor-pointer w-full py-2 rounded-lg font-semibold transition text-sm ${user.role === "admin" || blockingUserId === user._id
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : user.isBlocked
                    ? "bg-green-500 hover:bg-green-400 text-black"
                    : "bg-red-500 hover:bg-red-400 text-white"
                  }`}
              >
                {blockingUserId === user._id
                  ? "Processing..."
                  : user.role === "admin"
                    ? "Cannot Modify Admin"
                    : user.isBlocked
                      ? "Unblock User"
                      : "Block User"}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !usersLoading && (
        <p className="text-center text-gray-400 py-10">No users found</p>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={userPage}
        totalPages={totalUserPages}
        onPageChange={setUserPage}
      />
    </div>
  );
}
