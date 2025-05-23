import React, { useState } from "react";
import { DatePicker } from "antd";
import { MdOutlineDateRange } from "react-icons/md";

function PickDate() {
  const [isDateSelected, setIsDateSelected] = useState(false);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsDateSelected(!!dateString);
  };

  return (
    <DatePicker
      onChange={onChange}
      picker="year"
      className="border-1 h-8 w-28 py-2 rounded-lg"
      suffixIcon={
        <div
          className="rounded-full w-6 h-6 p-1 flex items-center justify-center"
          style={{
            backgroundColor: isDateSelected ? "#18a0fb" : "#c3e3f7",
          }}
        >
          <MdOutlineDateRange color={isDateSelected ? "white" : "#18a0fb"} />
        </div>
      }
    />
  );
}

export default PickDate;
