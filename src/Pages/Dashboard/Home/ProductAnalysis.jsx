import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useGetProductsAnalysisQuery } from '../../../features/ProductManagement/ProductManagementApi';

const ProductAnalysis = () => {
  // States for filters
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [hiddenBars, setHiddenBars] = useState([]);

  // Query the API with params
  const {
    data: productStats,
    isLoading,
    error
  } = useGetProductsAnalysisQuery({
    location: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
    year: selectedYear === 'All Years' ? '' : selectedYear
  });

  // Process API data when it arrives
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (productStats?.data) {
      // Transform API response to the format expected by the chart
      const transformedData = productStats.data.map(item => ({
        name: item.month.substring(0, 3), // Short month name
        fullMonth: item.month,
        available: item.availableCount,
        sold: item.soldCount,
        // Add the selected district and year to each data point
        district: selectedDistrict,
        year: selectedYear === 'All Years' ? new Date().getFullYear() : parseInt(selectedYear)
      }));

      setChartData(transformedData);
    }
  }, [productStats, selectedDistrict, selectedYear]);

 const districtOptions  = [
  // Banaadir (Mogadishu)
  { value: 'Abdiaziz', label: 'Abdiaziz' },
  { value: 'Bondhere', label: 'Bondhere' },
  { value: 'Daynile', label: 'Daynile' },
  { value: 'Dharkenley', label: 'Dharkenley' },
  { value: 'Hamar-Jajab', label: 'Hamar-Jajab' },
  { value: 'Hamar-Weyne', label: 'Hamar-Weyne' },
  { value: 'Hodan', label: 'Hodan' },
  { value: 'Howl-Wadag', label: 'Howl-Wadag' },
  { value: 'Karan', label: 'Karan' },
  { value: 'Shangani', label: 'Shangani' },
  { value: 'Shingani', label: 'Shingani' },
  { value: 'Waberi', label: 'Waberi' },
  { value: 'Wadajir', label: 'Wadajir' },
  { value: 'Wartanabada', label: 'Wartanabada' },
  { value: 'Yaqshid', label: 'Yaqshid' },

  // Galmudug
  { value: 'Adado', label: 'Adado' },
  { value: 'Balad', label: 'Balad' },
  { value: 'Dhusamareb', label: 'Dhusamareb' },
  { value: 'El Dher', label: 'El Dher' },
  { value: 'El Buur', label: 'El Buur' },
  { value: 'Galgaduud', label: 'Galgaduud' },
  { value: 'Guriel', label: 'Guriel' },
  { value: 'Harardhere', label: 'Harardhere' },
  { value: 'Hobyo', label: 'Hobyo' },

  // Hirshabelle
  { value: 'Belet Weyne', label: 'Belet Weyne' },
  { value: 'Buloburde', label: 'Buloburde' },
  { value: 'Jalalassi', label: 'Jalalassi' },
  { value: 'Mahas', label: 'Mahas' },
  { value: 'Mataban', label: 'Mataban' },

  // Jubaland
  { value: 'Afmadow', label: 'Afmadow' },
  { value: 'Badhadhe', label: 'Badhadhe' },
  { value: 'Buale', label: 'Buale' },
  { value: 'Bardera', label: 'Bardera' },
  { value: 'Dhobley', label: 'Dhobley' },
  { value: 'El Wak', label: 'El Wak' },
  { value: 'Garbaharey', label: 'Garbaharey' },
  { value: 'Kismayo', label: 'Kismayo' },
  { value: 'Luuq', label: 'Luuq' },

  // Puntland
  { value: 'Bosaso', label: 'Bosaso' },
  { value: 'Galkayo', label: 'Galkayo' },
  { value: 'Garowe', label: 'Garowe' },
  { value: 'Qardho', label: 'Qardho' },
  { value: 'Burtinle', label: 'Burtinle' },
  { value: 'Eyl', label: 'Eyl' },
  { value: 'Ufayn', label: 'Ufayn' },
  { value: 'Bandarbeyla', label: 'Bandarbeyla' },
  { value: 'Iskushuban', label: 'Iskushuban' },

  // South West
  { value: 'Baidoa', label: 'Baidoa' },
  { value: 'Barawe', label: 'Barawe' },
  { value: 'Bur Hakaba', label: 'Bur Hakaba' },
  { value: 'Dinsoor', label: 'Dinsoor' },
  { value: 'Qansax Dheere', label: 'Qansax Dheere' },
  { value: 'Tiyeglow', label: 'Tiyeglow' },
  { value: 'Wanlaweyn', label: 'Wanlaweyn' },
  { value: 'Xudur', label: 'Xudur' },

  // Somaliland
  { value: 'Berbera', label: 'Berbera' },
  { value: 'Burao', label: 'Burao' },
  { value: 'Borama', label: 'Borama' },
  { value: 'Erigavo', label: 'Erigavo' },
  { value: 'Gabiley', label: 'Gabiley' },
  { value: 'Hargeisa', label: 'Hargeisa' },
  { value: 'Las Anod', label: 'Las Anod' },
  { value: 'Zeila', label: 'Zeila' }
];

  // Generate year options for the last 5 years from current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  // No need for additional filtering since the API handles it
  const filteredData = chartData;

  // Updated CustomTooltip component to show both values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find the full data for this month
      const monthData = filteredData.find(item => item.name === label);

      if (!monthData) return null;

      return (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <p className="m-0 font-bold text-gray-700">{monthData.fullMonth}</p>
          <div className="mt-1">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FF6B35' }}></div>
              <p className="m-0"><span className="font-medium">Available:</span> {monthData.available}</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FFCBA5' }}></div>
              <p className="m-0"><span className="font-medium">Sold:</span> {monthData.sold}</p>
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

  // Loading state handler
  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-[445px]  bg-white shadow rounded-lg"><Spin size="small" /></div>;
  }

  // Error state handler
  if (error) {
    return <div className="p-4 text-red-500">Error loading product statistics. Please try again later.</div>;
  }

  // Show message if no data available after filtering
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col justify-start w-full h-full p-6 mx-auto bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
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
        <div className="flex items-center justify-center w-full h-64">
          No data available for the selected filters. Try different selections.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start w-full h-[445px] p-6 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
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
        <ResponsiveContainer width="100%" height={400}>
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
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Legend
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '20px' }}
              onClick={(e) => handleLegendClick(e.dataKey)}
              payload={[
                {
                  value: 'Available', dataKey: 'available', type: 'circle', color: '#FF6B35',
                  payload: { strokeDasharray: hiddenBars.includes('available') ? '3 3' : '0', fill: '#FF6B35' }
                },
                {
                  value: 'Sold', dataKey: 'sold', type: 'circle', color: '#FFCBA5',
                  payload: { strokeDasharray: hiddenBars.includes('sold') ? '3 3' : '0', fill: '#FFCBA5' }
                },
              ]}
              formatter={(value, entry) => (
                <span style={{ color: hiddenBars.includes(entry.dataKey) ? '#999' : '#333', cursor: 'pointer' }}>
                  {value}
                </span>
              )}
            />
            {!hiddenBars.includes('available') && (
              <Bar dataKey="available" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList
                  dataKey="available"
                  position="top"
                  content={({ x, y, width, value, index }) => {
                    // Only show label for the highest value
                    const highestIndex = filteredData.reduce((maxIndex, item, i, arr) =>
                      item.available > arr[maxIndex].available ? i : maxIndex, 0);

                    if (index !== highestIndex || value === 0) return null;

                    return (
                      <g>
                        <rect x={x + width / 2 - 20} y={y - 26} width="40" height="22" rx="5" fill="#FF6B35" />
                        <text x={x + width / 2} y={y - 12} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="12">
                          {value}
                        </text>
                      </g>
                    );
                  }}
                />
              </Bar>
            )}
            {!hiddenBars.includes('sold') && (
              <Bar dataKey="sold" fill="#FFCBA5" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList
                  dataKey="sold"
                  position="top"
                  content={({ x, y, width, value, index }) => {
                    // Only show label for the highest value
                    const highestIndex = filteredData.reduce((maxIndex, item, i, arr) =>
                      item.sold > arr[maxIndex].sold ? i : maxIndex, 0);

                    if (index !== highestIndex || value === 0) return null;

                    return (
                      <g>
                        <rect x={x + width / 2 - 20} y={y - 26} width="40" height="22" rx="5" fill="#FFCBA5" />
                        <text x={x + width / 2} y={y - 12} fill="#000" textAnchor="middle" dominantBaseline="middle" fontSize="12">
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

export default ProductAnalysis;