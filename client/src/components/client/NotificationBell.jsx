import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketContext = useSocket();
  const { user } = useUser();
  const navigate = useNavigate();

  // Handle socket events
  useEffect(() => {
    if (!user?._id) return;

    const socket = socketContext?.getSocket();
    if (!socket) {
      console.warn("[NotificationBell] No socket connection available");
      return;
    }

    console.log("[NotificationBell] Setting up socket listeners");

    // Request initial notifications
    socket.emit("getUnreadNotifications", user._id);

    // Handle new notifications
    const handleNewNotification = (data) => {
      console.log("[NotificationBell] Received new notification:", data);
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    // Handle notification read status
    const handleNotificationRead = (updatedNotification) => {
      console.log(
        "[NotificationBell] Notification marked as read:",
        updatedNotification
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === updatedNotification._id ? updatedNotification : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    // Handle initial notifications load
    const handleUnreadNotifications = (initialNotifications) => {
      console.log(
        "[NotificationBell] Received initial notifications:",
        initialNotifications
      );
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.filter((n) => !n.isRead).length);
    };

    // Set up event listeners
    socket.on("receiveNotification", handleNewNotification);
    socket.on("notificationRead", handleNotificationRead);
    socket.on("unreadNotifications", handleUnreadNotifications);

    // Cleanup listeners
    return () => {
      console.log("[NotificationBell] Cleaning up socket listeners");
      socket.off("receiveNotification", handleNewNotification);
      socket.off("notificationRead", handleNotificationRead);
      socket.off("unreadNotifications", handleUnreadNotifications);
    };
  }, [user?._id, socketContext]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      const socket = socketContext?.getSocket();
      if (!socket) return;

      console.log(
        "[NotificationBell] Marking notification as read:",
        notification._id
      );
      socket.emit("markNotificationRead", {
        notificationId: notification._id,
        userId: user._id,
      });

      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Navigate based on notification type and close dropdown
    if (notification.onModel === "Offer" && notification.relatedId) {
      navigate("/offers");
    } else if (notification.onModel === "Order" && notification.relatedId) {
      navigate(`/order-details/${notification.relatedId}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="p-4 border-b bg-white sticky top-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
