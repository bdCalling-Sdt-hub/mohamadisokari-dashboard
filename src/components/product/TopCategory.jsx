import { Select, Spin } from 'antd';
import { useState } from 'react';
import { useTopCategoriesQuery } from '../../features/ProductManagement/ProductManagementApi';

const TopCategory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [timeRange, setTimeRange] = useState('This Month');

  // Get current date for API params
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

  // Calculate last month
  let lastMonth = currentMonth - 1;
  let lastYear = currentYear;
  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear = currentYear - 1;
  }

  // Format month as YYYY-MM
  const formatMonth = (year, month) => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  // Determine API params based on timeRange selection
  let yearParam, monthParam;

  if (timeRange === 'This Month') {
    yearParam = currentYear;
    monthParam = formatMonth(currentYear, currentMonth);
  } else if (timeRange === 'Last Month') {
    yearParam = lastYear;
    monthParam = formatMonth(lastYear, lastMonth);
  } else if (timeRange === 'This Year') {
    yearParam = 2025;
    monthParam = undefined; // No month param for yearly data
  }

  // Fetch data using the updated params
  const { data, isLoading, isError } = useTopCategoriesQuery({ 
    month: monthParam, 
    year: yearParam,
    page: currentPage,
    limit: pageSize
  });

  // Extract data from API response
  const apiData = data?.data || [];
  const paginationInfo = data?.pagination || {
    page: 1,
    limit: 5,
    total: 0,
    totalPage: 1,
  };

  // Calculate total items for pagination display
  const totalItems = paginationInfo.total || apiData.length;

  if (isLoading) {
    return (
      <div className="flex flex-col w-5/12 h-96 p-5 bg-white rounded-lg shadow-sm items-center justify-center">
        <Spin size="default" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col w-5/12 h-96 p-5 bg-white rounded-lg shadow-sm items-center justify-center">
        <p className="text-red-500">Error loading category data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/12 h-[445px] p-5 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top Categories</h2>
        <Select
          defaultValue="This Month"
          style={{ width: 150 }}
          onChange={(value) => {
            setTimeRange(value);
            setCurrentPage(1); // Reset to first page when changing time range
          }}
          className="border rounded-full"
          options={[
            { value: 'This Month', label: 'This Month' },
            { value: 'Last Month', label: 'Last Month' },
            { value: 'This Year', label: 'This Year' },
          ]}
        />
      </div>

      {/* Scrollable area with hidden scrollbar */}
      <div
        className="flex-grow space-y-4 overflow-y-auto"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE/Edge */
        }}
      >
        {/* Custom CSS class for Webkit browsers */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="pr-2 hide-scrollbar">
          {apiData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No category data available</p>
            </div>
          ) : (
            apiData.map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3.5 h-3.5 border border-orange-500 rounded-full"></div>
                  <div className="ml-2">
                    <span className="text-gray-800">{item.category}</span>
                    <span className="block text-sm text-gray-500">{item.district}</span>
                  </div>
                </div>
                <div className="w-20 px-4 py-1 font-medium text-center text-white bg-orange-500 rounded-md">
                  {item.count}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Rows per page:</span>
          <Select
            defaultValue={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1); // Reset to first page when changing page size
            }}
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
            {apiData.length > 0 ?
              `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}` :
              '0-0 of 0'}
          </span>
          <div className="flex">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, paginationInfo.totalPage || 1))
              }
              disabled={currentPage >= (paginationInfo.totalPage || 1)}
              className="p-1 text-gray-400 disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategory;