import React from "react";
import ProductManagementTable from "./ProductManagementTable";
import TopDistrict from "../../Pages/Dashboard/Home/TopDistrict";
import TopCategory from "./TopCategory";
import ProductAnalysis from "../../Pages/Dashboard/Home/ProductAnalysis";
function BookingList() {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between w-full gap-5 bg-transparent rounded-lg">
        <ProductAnalysis />
        <TopDistrict />
      </div>
      <ProductManagementTable />
      <TopCategory />
    </div>
  );
}

export default BookingList;
