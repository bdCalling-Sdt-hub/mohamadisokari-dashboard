import React, { useState } from "react";
import { Tabs, ConfigProvider } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";

const Setting = () => {
  const [activeKey, setActiveKey] = useState("admin");

  const primaryColor = "#FF6600"; // Selected color
  const unselectedColor = "#000000"; // Unselected color

  const items = [
    {
      key: "admin",
      label: (
        <div style={{
          color: activeKey === "admin" ? primaryColor : unselectedColor,
          fontWeight: "normal"
        }}>
          Admin
        </div>
      ),
      children: <AdminList />,
    },
    {
      key: "password",
      label: (
        <div style={{
          color: activeKey === "password" ? primaryColor : unselectedColor,
          fontWeight: "normal"
        }}>
          Password
        </div>
      ),
      children: <AdminPassword />,
    },
  ];

  const onChange = (key) => {
    setActiveKey(key);
    console.log("Selected tab:", key);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: primaryColor,
            itemHoverColor: primaryColor,
            itemSelectedColor: primaryColor,
            titleFontSize: 18,
            horizontalMargin: "0 0 30px 0",
          },
        },
      }}
    >
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        className="py-8 font-medium"
        type="line"
      />
    </ConfigProvider>
  );
};

export default Setting;