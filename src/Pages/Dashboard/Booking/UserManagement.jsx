import React from "react";
import TopDistrict from "../Home/TopDistrict";
import UserAnalysis from "./UserAnalysis";
import UserManagementTable from "./UserManagementTable";
function UserManagement() {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between w-full gap-5 bg-transparent rounded-lg">
        <UserAnalysis />
        <TopDistrict />
      </div>
      <UserManagementTable />
    </div>
  );
}

export default UserManagement;
