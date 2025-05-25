import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, Pagination, Badge, Spin } from "antd";
import toast from "react-hot-toast";
import { FaBell, FaCheck, FaRegBell } from "react-icons/fa";
import io from "socket.io-client";
import { 
  useAllNotificationsQuery, 
  useReadNotificationMutation,
} from "../../features/notification/notificationApi";
import { SocketBaseURL } from "../../utils/BaseURL";

const PAGE_SIZE = 10;

const NotificationItem = ({ notification, onMarkAsRead, isReadLoading }) => (
  <div
    className={`border-b pb-4 border-gray-200 flex items-start gap-4 p-3 rounded-md transition-all ${
      !notification.read ? "bg-amber-50" : "hover:bg-gray-100"
    }`}
  >
    <div className="relative">
      {!notification.read && (
        <Badge status="processing" color="#FFC301" className="absolute -top-1 -right-1" />
      )}
      <img
        className="object-cover w-12 h-12 border-2 border-gray-300 rounded-full md:h-14 md:w-14"
        src={notification.avatar || "https://img.freepik.com/free-photo/everything-is-okay-cheerful-friendly-looking-caucasian-guy-with-moustache-beard-raising-hand-with-ok-great-gesture-giving-approval-like-having-situation-control_176420-22386.jpg"}
        alt="Notification avatar"
      />
    </div>
    <div className="flex-1">
      <p className="text-gray-800">
        <span className="font-semibold text-black">{notification.title}</span> {notification.text}
      </p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
        {!notification.read && (
          <button 
            onClick={() => onMarkAsRead(notification._id)}
            disabled={isReadLoading}
            className="flex items-center gap-1 text-sm text-gtdandy hover:underline"
            aria-label={`Mark notification from ${notification.title} as read`}
          >
            <FaCheck size={12} />
            Mark as read
          </button>
        )}
      </div>
    </div>
  </div>
);

const Notifications = () => {
  const [page, setPage] = useState(1);
  const socketRef = useRef(null);
  const { data, isLoading: isNotificationLoading, refetch } = useAllNotificationsQuery({ page, limit: PAGE_SIZE });
  const [readNotification, { isLoading: isReadLoading }] = useReadNotificationMutation();
  

  const notifications = data?.data?.notifications || [];
  const totalNotifications = data?.data?.totalCount || 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    socketRef.current = io(SocketBaseURL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    const handleNewNotification = (notification) => {
      refetch();
      toast.success("New notification received");
    };

    socketRef.current.on(`notification::${localStorage.getItem("userId")}`, handleNewNotification);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("connect_error");
        socketRef.current.off(`notification::${localStorage.getItem("userId")}`, handleNewNotification);
        socketRef.current.disconnect();
      }
    };
  }, [refetch]);

  const handleRead = async (id) => {
    try {
      await readNotification(id).unwrap();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark as read");
    }
  };

  if (isNotificationLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="p-6 px-6 mt-6 rounded-lg shadow-sm md:px-14 md:mt-10 bg-gray-50">
      <div className="flex flex-col items-start justify-between pb-4 mb-6 border-b sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Badge count={unreadCount} showZero>
            <FaBell className="text-gtdandy" size={22} aria-hidden="true" />
          </Badge>
          <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">All Notifications</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaRegBell size={36} className="mb-2 text-gray-300" aria-hidden="true" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleRead}
              isReadLoading={isReadLoading}
            />
          ))
        )}
      </div>

      {totalNotifications > PAGE_SIZE && (
        <div className="flex items-center justify-center mt-8">
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  itemActiveBg: "#FFC301",
                  itemBg: "white",
                  borderRadius: "8px",
                  colorText: "#333",
                  colorPrimaryBorder: "#FFC301",
                  colorBgTextHover: "#FFF8E0",
                  colorPrimaryHover: "#FFC301",
                },
              },
              token: {
                colorPrimary: "#FFC301",
              },
            }}
          >
            <Pagination
              current={page}
              total={totalNotifications}
              onChange={(page) => setPage(page)}
              showQuickJumper={false}
              showSizeChanger={false}
              pageSize={PAGE_SIZE}
              showTotal={(total) => `Total ${total} notifications`}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default Notifications;