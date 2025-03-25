import React, { useState } from 'react';
import { Radio, Select, Pagination } from 'antd';

const TopCategory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [timeRange, setTimeRange] = useState('This Month');
  
  // Sample district data
  const districts = [
    { name: 'Hamar Weyne', value: 150 },
    { name: 'Kismayo', value: 150 },
    { name: 'Galkayo', value: 150 },
    { name: 'Karan', value: 150 },
    { name: 'Yaqshid', value: 150 },
    { name: 'Mogadishu', value: 150 },
    { name: 'Bosaso', value: 150 },
    { name: 'Baidoa', value: 150 },
    { name: 'Marka', value: 150 },
    { name: 'Jowhar', value: 150 },
  ];
  
  // Get current districts to display
  const indexOfLastDistrict = currentPage * pageSize;
  const indexOfFirstDistrict = indexOfLastDistrict - pageSize;
  const currentDistricts = districts.slice(indexOfFirstDistrict, indexOfLastDistrict);
  
  return (
    <div className="flex flex-col w-5/12 h-[445px] p-5 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top Category</h2>
        <Select 
          defaultValue="This Month" 
          style={{ width: 150 }}
          onChange={value => setTimeRange(value)}
          className="border rounded-full"
          options={[
            { value: 'This Month', label: 'This Month' },
            { value: 'Last Month', label: 'Last Month' },
            { value: 'This Year', label: 'This Year' },
          ]}
        />
      </div>
      
      {/* Added flex-grow to make this section fill available space */}
      <div className="flex-grow space-y-4 overflow-y-auto">
        {currentDistricts.map((district, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
            <div className='w-3.5 h-3.5 border border-orange-500 rounded-full'></div>
              <span className="ml-2 text-gray-800">{district.name}</span>
            </div>
            <div className="w-20 px-4 py-1 font-medium text-center text-white bg-orange-500 rounded-md">
              {district.value}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Rows per page:</span>
          <Select
            defaultValue={pageSize}
            onChange={value => setPageSize(value)}
            options={[
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
            className="w-16"
          />
        </div>
        
        <div className="flex items-center">
          <span className="mr-4 text-gray-600">
            {indexOfFirstDistrict + 1}–{Math.min(indexOfLastDistrict, districts.length)} of {districts.length}
          </span>
          <div className="flex">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(districts.length / pageSize)))}
              disabled={currentPage >= Math.ceil(districts.length / pageSize)}
              className="p-1 text-gray-400 disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategory;