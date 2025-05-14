import { Spin } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";
import CustomDropdown from "../../../components/CustomDropdown";
import { useDashboardAnalysisQuery } from "../../../features/overview/overviewApi";
import ProductAnalysis from "./ProductAnalysis";
import RevenueAnalytics from "./RevenueAnalytics";
import TinyChart from "./TinyChart";
import TopDistrict from "./TopDistrict";
dayjs.extend(customParseFormat);

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardAnalysisQuery();

  const stats = [
    {
      label: "Total User",
      value: dashboardLoading ? "Loading..." : dashboardData?.data?.totalUsers || "0",
      percent: +2.6,
      color: "#00a76f",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Active Listing",
      value: dashboardLoading ? "Loading..." : dashboardData?.data?.totalActiveListing || "0",
      percent: +2.6,
      color: "#00b8d9",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Sold Listing",
      value: dashboardLoading ? "Loading..." : dashboardData?.data?.totalSoldListing || "0",
      percent: +2.6,
      color: "#18a0fb",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Total Revenue",
      value: dashboardLoading ? "Loading..." : dashboardData?.data?.totalRevenue || "0",
      percent: -2.6,
      color: "#ff5630",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
  ];

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    console.log(`Selected month: ${value}`);
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[400px]">
        <div className="text-xl font-semibold"><Spin size="default" /></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col flex-wrap items-end justify-between w-full gap-5 bg-transparent rounded-md">
        {/* Scrollable section for stats */}
        <CustomDropdown onChange={handleMonthChange} value={selectedMonth} />
        <div
          className="flex flex-wrap items-center justify-between w-full gap-10 overflow-y-auto lg:flex-nowrap"
          style={{ maxHeight: "400px", scrollbarWidth: "thin" }}
        >
          {stats.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col w-full mt-4 bg-white rounded-lg justify-evenly">
        <RevenueAnalytics />
      </div>
      <div className="flex items-center justify-between w-full gap-5 mt-4 bg-transparent rounded-lg">
        <ProductAnalysis />
        <TopDistrict />
      </div>
    </div>
  );
};

export const Card = ({ item }) => {
  return (
    <div
      className={`flex w-full items-center justify-evenly rounded-xl bg-white gap-10 ${item.bg}`}
    >
      <div className="flex flex-col items-start justify-between gap-3 py-4 ">
        <p>{item.label}</p>
        <p className="text-[24px] font-bold text-gray-800">{item.value}</p>
        {item.percent > 0 ? (
          <p>
            <span className="flex gap-2 text-green-400">
              {item.icon[0]}% last 7 days
            </span>
          </p>
        ) : (
          <p>
            <span className="flex gap-2 text-red-400">
              {item.icon[1]}% last 7 days
            </span>
          </p>
        )}
      </div>
      <div className="h-[60%] flex items-center justify-end  w-20 ">
        <TinyChart color={item.color} />
      </div>
    </div>
  );
};

export default Home;