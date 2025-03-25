import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CustomDropdown = ({ onChange, value, ...props }) => {
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <Select
      placeholder="Select month"
      onChange={onChange}
      value={value}
      style={{ width: 200 }}
      {...props}
    >
      {months.map((month, index) => (
        <Option key={month} value={index + 1}>
          {month}
        </Option>
      ))}
    </Select>
  );
};

export default CustomDropdown;