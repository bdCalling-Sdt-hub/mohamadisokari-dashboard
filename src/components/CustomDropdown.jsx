import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CustomDropdown = ({ onChange, value, ...props }) => {
  const months = [
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
    { label: 'All time', value: 'allTime' },
  ];

  return (
    <Select
      placeholder="Select month"
      onChange={onChange}
      value={value}
      style={{ width: 200 }}
      {...props}
    >
      {months.map((month) => (
        <Option key={month.value} value={month.value}>
          {month.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomDropdown;