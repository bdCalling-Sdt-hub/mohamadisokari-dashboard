import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Select } from 'antd';  // Import Ant Design's Select component

const RevenueAnalytics = () => {
  // Sample data with district and year information
  const revenueData = [
    { month: 'Jan', district: 'North', revenue: 3100, year: 2025 },
    { month: 'Jan', district: 'North', revenue: 3100, year: 2024 },
    { month: 'Jan', district: 'North', revenue: 3100, year: 2023 },
    { month: 'Jan', district: 'North', revenue: 3100, year: 2022 },
    { month: 'Feb', district: 'North', revenue: 1600, year: 2025 },
    { month: 'Mar', district: 'South', revenue: 2200, year: 2025 },
    { month: 'Apr', district: 'South', revenue: 4100, year: 2024 },
    { month: 'May', district: 'East', revenue: 3300, year: 2024 },
    { month: 'Jun', district: 'East', revenue: 3560, year: 2024 },
    { month: 'Jul', district: 'West', revenue: 2300, year: 2023 },
    { month: 'Aug', district: 'West', revenue: 4800, year: 2023 },
    { month: 'Sep', district: 'North', revenue: 5000, year: 2022 },
    { month: 'Oct', district: 'South', revenue: 3500, year: 2022 },
    { month: 'Nov', district: 'East', revenue: 3000, year: 2021 },
    { month: 'Dec', district: 'West', revenue: 5800, year: 2020 },
  ];

  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedYear, setSelectedYear] = useState('All Years');
  
  // District options
  const districtOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
  ];

  // Generate year options for the last 5 years from current year (2025)
  const currentYear = 2025;
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // Filter data based on selected district and year
  const filteredData = revenueData.filter(item => {
    const districtMatch = selectedDistrict === 'All Districts' || item.district === selectedDistrict;
    const yearMatch = selectedYear === 'All Years' || item.year === selectedYear;
    return districtMatch && yearMatch;
  });

  // Average revenue for reference line
  const averageRevenue = 3600;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 font-bold text-white bg-orange-500 rounded-md shadow-lg">
          ${payload[0].value}
        </div>
      );
    }
    return null;
  };

  // Active dot component
  const ActiveDot = (props) => {
    const { cx, cy } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#FF6B00" stroke="white" strokeWidth={2} />
      </g>
    );
  };

  return (
    <div className="w-full p-6 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics</h2>
        <div className="flex gap-4">
          <Select
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            style={{ width: 200 }}
            placeholder="Select District"
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}  // Set max height for dropdown
          >
            <Select.Option value="All Districts">All Districts</Select.Option>
            {districtOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 200 }}
            placeholder="Select Year"
            dropdownStyle={{ overflow: 'auto' }}
          >
            <Select.Option value="All Years">All Years</Select.Option>
            {yearOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }} 
              domain={[0, 6000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
              tickFormatter={(value) => value === 0 ? '0' : `${value/1000}K`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={false}
              position={{ y: 0 }}
            />
            <ReferenceLine 
              y={averageRevenue} 
              stroke="#FF6B00" 
              strokeDasharray="3 3" 
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#FF6B00" 
              strokeWidth={3}
              dot={false}
              activeDot={<ActiveDot />}
              fill="url(#colorRevenue)"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueAnalytics;