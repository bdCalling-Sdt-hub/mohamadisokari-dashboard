import React, { useState } from "react";
import { ConfigProvider, Pagination, Badge, Spin } from "antd";
import toast from "react-hot-toast";
import { FaBell, FaCheck, FaRegBell } from "react-icons/fa";
import { 
  useAllNotificationsQuery, 
  useReadNotificationMutation 
} from "../../features/notification/notificationApi";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading: isNotificationLoading, refetch } = useAllNotificationsQuery();
  const [readNotification, { isLoading: isReadLoading }] = useReadNotificationMutation();

  const notifications = data?.data || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = async (id) => {
    try {
      await readNotification(id).unwrap();
      refetch(); // Refresh notifications after marking as read
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark as read");
    }
  };

  const handleReadAll = async () => {
    try {
      // This assumes your API supports marking all as read
      // If not, you would need to loop through unread notifications
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => readNotification(n._id).unwrap())
      );
      refetch();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
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
          <Badge count={unreadCount}>
            <FaBell className="text-gtdandy" size={22} />
          </Badge>
          <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">All Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleReadAll}
            disabled={isReadLoading}
            className="flex items-center h-10 gap-2 px-4 mt-3 text-white transition-colors rounded-md bg-gtdandy hover:bg-amber-500 sm:mt-0"
          >
            <FaCheck size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaRegBell size={36} className="mb-2 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
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
                  src="https://img.freepik.com/free-photo/everything-is-okay-cheerful-friendly-looking-caucasian-guy-with-moustache-beard-raising-hand-with-ok-great-gesture-giving-approval-like-having-situation-control_176420-22386.jpg"
                  alt="User avatar"
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
                      onClick={() => handleRead(notification._id)}
                      disabled={isReadLoading}
                      className="flex items-center gap-1 text-sm text-gtdandy hover:underline"
                    >
                      <FaCheck size={12} />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
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
              total={notifications.length}
              onChange={(page) => setPage(page)}
              showQuickJumper={false}
              showSizeChanger={false}
              pageSize={10}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default Notifications;