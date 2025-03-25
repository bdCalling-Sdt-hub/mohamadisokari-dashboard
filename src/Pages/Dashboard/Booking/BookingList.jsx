import React from "react";
import BookigListTable from "./BookigListTable";
import TopDistrict from "../Home/TopDistrict";
import UserAnalysis from "./UserAnalysis";
function BookingList() {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between w-full gap-5 mt-4 bg-transparent rounded-lg">
        <UserAnalysis />
        <TopDistrict />
      </div>
      <BookigListTable />
    </div>
  );
}

export default BookingList;
