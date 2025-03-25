import React, { useState } from "react";
import { ConfigProvider, Pagination, Badge } from "antd";
import {
  useNotificationQuery,
  useReadMutation,
} from "../../redux/apiSlices/notificationSlice";
import toast from "react-hot-toast";
import { FaBell, FaCheck, FaRegBell } from "react-icons/fa";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [read] = useReadMutation();

  const handleRead = async () => {
    try {
      await read()
        .unwrap()
        .then(({ status, message }) => {
          if (status) {
            toast.success(message);
          }
        });
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="p-6 px-6 mt-6 rounded-lg shadow-sm md:px-14 md:mt-10 bg-gray-50">
      <div className="flex flex-col items-start justify-between pb-4 mb-6 border-b sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <FaBell className="text-gtdandy" size={22} />
          <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">All Notifications</h2>
        </div>
        <button 
          onClick={handleRead}
          className="flex items-center h-10 gap-2 px-4 mt-3 text-white transition-colors rounded-md bg-gtdandy hover:bg-amber-500 sm:mt-0"
        >
          <FaCheck size={14} />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[...Array(8).keys()].map((notification, index) => {
          const isUnread = index % 3 === 0; // Just for demo purposes
          return (
            <div
              key={index}
              className={`border-b pb-4 border-gray-200 flex items-start gap-4 p-3 rounded-md transition-all ${
                isUnread ? "bg-amber-50" : "hover:bg-gray-100"
              }`}
            >
              <div className="relative">
                {isUnread && (
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
                  <span className="font-semibold text-black">Sanchez haro manuel</span> started a new trip at 5pm. 
                  <span className="font-medium text-gtdandy"> Trip No.56</span>. Trip started from Mexico City.
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">1hr ago</p>
                  {isUnread && (
                    <button className="flex items-center gap-1 text-sm text-gtdandy hover:underline">
                      <FaCheck size={12} />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state - can be conditionally rendered when there are no notifications */}
      {false && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FaRegBell size={36} className="mb-2 text-gray-300" />
          <p>No notifications yet</p>
        </div>
      )}

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
            current={parseInt(page)}
            total={50}
            onChange={(page) => setPage(page)}
            showQuickJumper={false}
            showSizeChanger={false}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Notifications;