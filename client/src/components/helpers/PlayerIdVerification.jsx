import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import setOneSignalPlayerId from "./setOneSignalPlayerId";

export default function PlayerIdVerification() {
  const { user, checkAuth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  useEffect(() => {
    // Only check if user is logged in
    if (!user) return;

    const checkPlayerIdMatch = async () => {
      try {
        // Get current device's OneSignal player ID
        window.OneSignalDeferred.push(async (OneSignal) => {
          const id = await OneSignal.User.PushSubscription.id;
          setCurrentPlayerId(id);

          // Check if player IDs match or if user has no player ID
          const userPlayerId = user.playerId;

          // If no player ID in DB or IDs don't match, show modal
          if (!userPlayerId || (id && userPlayerId !== id)) {
            setShowModal(true);
          }
        });
      } catch (error) {
        console.error("Error checking player ID:", error);
      }
    };

    checkPlayerIdMatch();
  }, [user]);

  const handleEnableNotifications = async () => {
    if (isLoading) return;
    setIsLoading(true);

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        // Listen for subscription changes
        const handleSubscriptionChange = async (event) => {
          if (event.current.id) {
            // Save the new player ID to the database
            await setOneSignalPlayerId(event.current.id);

            // Refresh user data to get updated player ID
            await checkAuth();

            setShowModal(false);
            setIsLoading(false);

            // Remove listener after getting the ID
            OneSignal.User.PushSubscription.removeEventListener(
              "change",
              handleSubscriptionChange,
            );
          }
        };

        // Add event listener before opting in
        OneSignal.User.PushSubscription.addEventListener(
          "change",
          handleSubscriptionChange,
        );

        // Opt in to push notifications (shows browser's native prompt)
        await OneSignal.User.PushSubscription.optIn();

        // Also check immediately in case ID is already available
        const id = await OneSignal.User.PushSubscription.id;
        if (id) {
          await setOneSignalPlayerId(id);
          await checkAuth();
          setShowModal(false);
          setIsLoading(false);
          OneSignal.User.PushSubscription.removeEventListener(
            "change",
            handleSubscriptionChange,
          );
        }
      } catch (err) {
        console.error("Notification prompt error:", err);
        setIsLoading(false);
      }
    });
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  // Don't render anything if modal shouldn't be shown
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0D121C] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Enable Notifications
          </h2>

          {/* Message */}
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            {!user?.playerId ? (
              <>
                To receive alerts for your monitors, please enable push
                notifications.
              </>
            ) : (
              <>
                We detected you're on a different device. Please enable
                notifications to receive alerts on this device.
              </>
            )}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDismiss}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#121A28] text-gray-300 rounded-xl font-medium hover:bg-[#1A2333] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Later
            </button>
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-green-500 text-black rounded-xl font-semibold hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enabling...
                </>
              ) : (
                "Enable Notifications"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
