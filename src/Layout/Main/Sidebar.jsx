import { Menu } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineProduct, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaQuoteRight } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { GoCodeReview } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuGift } from "react-icons/lu";
import { MdOutlinePrivacyTip, MdOutlineReportProblem, MdOutlineRoundaboutLeft } from "react-icons/md";
import { PiMessengerLogoBold } from "react-icons/pi";
import { RiContactsBook3Line, RiSettings5Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbBellBolt, TbListDetails } from "react-icons/tb";
import { TfiLayoutSlider, TfiLayoutSliderAlt } from "react-icons/tfi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const getIcon = (key) => {
    const icons = {
      "/": <RxDashboard size={20} />,
      "/user-management": <AiOutlineUsergroupAdd size={20} />,
      "/product-details": <AiOutlineProduct size={20} />,
      "/category": <LuGift size={20} />,
      "/app-review": <GoCodeReview size={20} />,
      "/transaction": <GrTransaction size={20} />,
      "/reported-issues": <MdOutlineReportProblem size={20} />,
      "/support-chat": <PiMessengerLogoBold size={20} />,
      "/pushnotification": <TbBellBolt size={20} />,
      "/privacy-policy": <MdOutlinePrivacyTip size={20} />,
      "/about-us": < MdOutlineRoundaboutLeft size={20} />,
      "/terms-and-conditions": <IoDocumentTextOutline size={20} />,
      "/faq": <FaQuoteRight size={20} />,
      "/contact": <RiContactsBook3Line size={20} />,
      "/slider": <TfiLayoutSlider size={20} />,
      "/video": <TfiLayoutSliderAlt size={20} />,
      "/admin-list": <RiSettings5Line size={20} />,
      "/logout": <FiLogOut size={20} />,
    };
    return icons[key] || <TbListDetails size={20} />;
  };

  const menuItems = [
    {
      key: "/",
      icon: getIcon("/"),
      label: <Link to="/">Overview</Link>,
    },
    {
      key: "/user-management",
      icon: getIcon("/user-management"),
      label: <Link to="/user-management">User Management</Link>,
    },
    {
      key: "/product-details",
      icon: getIcon("/product-details"),
      label: <Link to="/product-details">Product Management</Link>,
    },
    // {
    //   key: "/category",
    //   icon: getIcon("/category"),
    //   label: <Link to="/category">Category</Link>,
    // },
    {
      key: "/app-review",
      icon: getIcon("/app-review"),
      label: <Link to="/app-review">App Reviews</Link>,
    },
    {
      key: "/transaction",
      icon: getIcon("/transaction"),
      label: <Link to="/transaction">Transaction</Link>,
    },
    {
      key: "/reported-issues",
      icon: getIcon("/reported-issues"),
      label: <Link to="/reported-issues">Report</Link>,
    },
    {
      key: "/support-chat",
      icon: getIcon("/support-chat"),
      label: <Link to="/support-chat">Support Chat</Link>,
    },
    {
      key: "/pushnotification",
      icon: getIcon("/pushnotification"),
      label: <Link to="/pushnotification">PushNotification</Link>,
    },
    {
      key: "subMenuSetting",
      icon: getIcon("/privacy-policy"),
      label: "Cms",
      children: [
        {
          key: "/about-us",
          icon: getIcon("/about-us"),
          label: <Link to="/about-us">About Us</Link>,
        },
        {
          key: "/privacy-policy",
          icon: getIcon("/privacy-policy"),
          label: <Link to="/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "/terms-and-conditions",
          icon: getIcon("/terms-and-conditions"),
          label: <Link to="/terms-and-conditions">Terms And Condition</Link>,
        },
        {
          key: "/contact",
          icon: getIcon("/contact"),
          label: <Link to="/contact">Contact Us</Link>,
        },
        {
          key: "/slider",
          icon: getIcon("/slider"),
          label: <Link to="/slider">Slider</Link>,
        },
        {
          key: "/video",
          icon: getIcon("/video"),
          label: <Link to="/video">Video</Link>,
        },
      ],
    },
    {
      key: "/admin-list",
      icon: getIcon("/admin-list"),
      label: <Link to="/admin-list">Setting</Link>,
    },
    {
      key: "/logout",
      icon: getIcon("/logout"),
      label: isCollapsed ? null : <span onClick={handleLogout}>Logout</span>,
    },
  ];

  useEffect(() => {
    const findSelectedKey = (items, currentPath) => {
      // Special case for root path
      if (currentPath === '/') {
        return { selectedKey: '/', openKeys: [] };
      }

      // First try to find exact matches
      for (const item of items) {
        if (item.key === currentPath) {
          return { selectedKey: item.key, openKeys: [] };
        }

        if (item.children) {
          const exactChildMatch = item.children.find(child => child.key === currentPath);
          if (exactChildMatch) {
            return { selectedKey: exactChildMatch.key, openKeys: [item.key] };
          }
        }
      }

      // If no exact match, look for partial matches (nested routes)
      for (const item of items) {
        // Skip root path for partial matching
        if (item.key !== '/' && currentPath.startsWith(item.key)) {
          return { selectedKey: item.key, openKeys: [] };
        }

        if (item.children) {
          const partialChildMatch = item.children.find(child =>
            child.key !== '/' && currentPath.startsWith(child.key)
          );
          if (partialChildMatch) {
            return { selectedKey: partialChildMatch.key, openKeys: [item.key] };
          }
        }
      }

      return { selectedKey: "", openKeys: [] };
    };

    const { selectedKey: newSelectedKey, openKeys: newOpenKeys } = findSelectedKey(menuItems, path);
    setSelectedKey(newSelectedKey);
    setOpenKeys(newOpenKeys);
  }, [path]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <div className={`bg-quilocoP flex flex-col h-screen ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}>
      {/* Scrollable Menu */}
      <div
        className="flex-1 pt-16 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarGutter: 'stable',
        }}
      >
        <style>
          {`
            .overflow-y-auto::-webkit-scrollbar {
              width: 5px;
              height: 5px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 5px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}
        </style>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{
            background: "#ffffff",
            borderRight: 0,
            paddingBottom: "10px",
            height: '100%',
          }}
          items={menuItems}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default Sidebar;