import React from "react";
import ProductManagementTable from "./ProductManagementTable";
import UserAnalysis from "../../Pages/Dashboard/Booking/UserAnalysis";
import TopDistrict from "../../Pages/Dashboard/Home/TopDistrict";
import TopCategory from "./TopCategory";
function BookingList() {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between w-full gap-5 mt-4 bg-transparent rounded-lg">
        <UserAnalysis />
        <TopDistrict />
      </div>
      <ProductManagementTable />
      <TopCategory />
    </div>
  );
}

export default BookingList;
