
import React from "react";

const ButtonEDU = ({ actionType, onClick, children }) => {
  const getButtonStyles = () => {
    switch (actionType) {
      case "add":
        return "bg-[#F97316] text-white w-28 h-9 rounded-md border border-[#F97316] transition-all duration-300 hover:bg-transparent hover:text-[#F97316]";
      case "update":
        return "bg-[#17a4e2] text-white w-28 h-9 rounded-md border border-[#17a4e2] transition-all duration-300 hover:bg-transparent hover:text-[#17a4e2]";
      case "save":
        return "bg-[#F97316] text-white w-28 h-9 rounded-md border border-[#F97316] transition-all duration-300 hover:bg-transparent hover:text-[#F97316]";
      case "edit":
        return "bg-[#17a4e2] text-white w-28 h-9 rounded-md border border-[#17a4e2] transition-all duration-300 hover:bg-transparent hover:text-[#17a4e2]";
      case "delete":
        return "bg-red-600 text-white w-28 h-9 rounded-md border border-red-600 transition-all duration-300 hover:bg-transparent hover:text-red-600";
      case "cancel":
        return "bg-gray-300 text-black w-28 h-9 rounded-md border border-gray-400 transition-all duration-300 hover:bg-transparent hover:text-gray-600";
      default:
        return "bg-[#F97316] text-white w-28 h-9 rounded-md border border-[#F97316] transition-all duration-300 hover:bg-transparent hover:text-[#F97316]";
    }
  };

  return (
    <button
      className={`${getButtonStyles()} flex items-center justify-center font-semibold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonEDU;
