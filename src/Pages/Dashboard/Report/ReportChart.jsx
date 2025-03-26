import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LabelList, 
  ResponsiveContainer 
} from 'recharts';
import { Select } from 'antd';

const ReportChart = () => {
  // Sample data with district and year information
  const data = [
    { name: 'Jan', district: 'North', review: 150, resolve: 20, year: 2025 },
    { name: 'Feb', district: 'North', review: 80, resolve: 50, year: 2025 },
    { name: 'Mar', district: 'South', review: 250, resolve: 35, year: 2025 },
    { name: 'Apr', district: 'South', review: 270, resolve: 30, year: 2024 },
    { name: 'May', district: 'East', review: 320, resolve: 25, year: 2024 },
    { name: 'Jun', district: 'East', review: 380, resolve: 55, year: 2024 },
    { name: 'Jul', district: 'West', review: 270, resolve: 40, year: 2023 },
    { name: 'Aug', district: 'West', review: 350, resolve: 60, year: 2023 },
    { name: 'Sep', district: 'North', review: 200, resolve: 50, year: 2022 },
    { name: 'Oct', district: 'South', review: 250, resolve: 35, year: 2022 },
    { name: 'Nov', district: 'East', review: 270, resolve: 30, year: 2021 },
    { name: 'Dec', district: 'West', review: 270, resolve: 70, year: 2020 }
  ];

  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [hiddenBars, setHiddenBars] = useState([]);
  
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
  const filteredData = data.filter(item => {
    const districtMatch = selectedDistrict === 'All Districts' || item.district === selectedDistrict;
    const yearMatch = selectedYear === 'All Years' || item.year === selectedYear;
    return districtMatch && yearMatch;
  });

  // Updated CustomTooltip component to show both values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get the month's data
      const monthData = filteredData.find(item => item.name === label);
      
      return (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg h">
          <p className="m-0 font-bold text-gray-700">{label}</p>
          <div className="mt-1">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FF6B35' }}></div>
              <p className="m-0"><span className="font-medium">Under Review:</span> {monthData.review}</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FFCBA5' }}></div>
              <p className="m-0"><span className="font-medium">Resolve:</span> {monthData.resolve}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle legend click to toggle visibility
  const handleLegendClick = (dataKey) => {
    setHiddenBars(prev => {
      if (prev.includes(dataKey)) {
        return prev.filter(item => item !== dataKey);
      } else {
        return [...prev, dataKey];
      }
    });
  };

  return (
    <div className="flex flex-col justify-start w-full h-full p-6 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">Products</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            style={{ width: 200 }}
            placeholder="District"
            options={[
              { value: 'All Districts', label: 'All Districts' },
              ...districtOptions
            ]}
          />
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 200 }}
            placeholder="Year"
            options={[
              { value: 'All Years', label: 'All Years' },
              ...yearOptions
            ]}
          />
        </div>
      </div>
      
      <div className="flex flex-grow w-full">
        <ResponsiveContainer  width="100%" height="90%" minHeight={550}>
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#666' }} 
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Legend 
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '20px' }}
              onClick={(e) => handleLegendClick(e.dataKey)}
              payload={[
                { value: 'Under Review', dataKey: 'review', type: 'circle', color: '#FF6B35', 
                  payload: { strokeDasharray: hiddenBars.includes('available') ? '3 3' : '0', fill: '#FF6B35' } },
                { value: 'resolve', dataKey: 'resolve', type: 'circle', color: '#FFCBA5', 
                  payload: { strokeDasharray: hiddenBars.includes('sold') ? '3 3' : '0', fill: '#FFCBA5' } },
              ]}
              formatter={(value, entry) => (
                <span style={{ color: hiddenBars.includes(entry.dataKey) ? '#999' : '#333', cursor: 'pointer' }}>
                  {value}
                </span>
              )}
            />
            {!hiddenBars.includes('review') && (
              <Bar dataKey="review" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList 
                  dataKey="review" 
                  position="top" 
                  content={({ x, y, width, value, index }) => {
                    // Only show label for June (index 5)
                    if (index !== 5) return null;
                    return (
                      <g>
                        <rect x={x + width/2 - 20} y={y - 26} width="40" height="22" rx="5" fill="#FF6B35" />
                        <text x={x + width/2} y={y - 12} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="12">
                          {value}
                        </text>
                      </g>
                    );
                  }}
                />
              </Bar>
            )}
            {!hiddenBars.includes('resolve') && (
              <Bar dataKey="resolve" fill="#FFCBA5" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList 
                  dataKey="resolve" 
                  position="top" 
                  content={({ x, y, width, value, index }) => {
                    // Only show label for September (index 8)
                    if (index !== 8) return null;
                    return (
                      <g>
                        <rect x={x + width/2 - 20} y={y - 26} width="40" height="22" rx="5" fill="#FFCBA5" />
                        <text x={x + width/2} y={y - 12} fill="#000" textAnchor="middle" dominantBaseline="middle" fontSize="12">
                          {value}
                        </text>
                      </g>
                    );
                  }}
                />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportChart;