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
import { useUserAnalysisQuery } from '../../../features/userManagement/UserManagementApi';

const UserAnalysis = () => {
  // District options
  const districtOptions = [
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

  // State for selections
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [hiddenBars, setHiddenBars] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Generate year options for the last 5 years from current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // API call
  const { data: apiResponse, isLoading, refetch } = useUserAnalysisQuery({
    location: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
    year: selectedYear === 'All Years' ? '' : selectedYear
  });

  // Transform API data to chart format
  useEffect(() => {
    if (apiResponse?.data) {
      const transformedData = apiResponse.data.map(item => ({
        name: item.month.substring(0, 3), // Shorten month name (Jan, Feb, etc.)
        users: item.count
      }));
      setChartData(transformedData);
    }
  }, [apiResponse]);

  // Refetch data when filters change
  useEffect(() => {
    refetch();
  }, [selectedDistrict, selectedYear, refetch]);

  // CustomTooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <p className="m-0 font-bold text-gray-700">{label}</p>
          <div className="mt-1">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FF6B35' }}></div>
              <p className="m-0"><span className="font-medium">Users:</span> {payload[0].value}</p>
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
      <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">User Analytics</h2>
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


      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          <Spin size="small" />
        </div>
      ) : (
        <div className="flex flex-grow w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
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
                domain={[0, 'dataMax + 10']} // Auto adjust based on data
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '20px' }}
                onClick={(e) => handleLegendClick(e.dataKey)}
                payload={[
                  {
                    value: 'Users',
                    dataKey: 'users',
                    type: 'circle',
                    color: '#FF6B35',
                    payload: { strokeDasharray: hiddenBars.includes('users') ? '3 3' : '0', fill: '#FF6B35' }
                  },
                ]}
                formatter={(value, entry) => (
                  <span style={{ color: hiddenBars.includes(entry.dataKey) ? '#999' : '#333', cursor: 'pointer' }}>
                    {value}
                  </span>
                )}
              />
              {!hiddenBars.includes('users') && (
                <Bar dataKey="users" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={20}>
                  <LabelList
                    dataKey="users"
                    position="top"
                    formatter={(value) => value > 0 ? value : null} // Only show labels for non-zero values
                  />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

export default UserAnalysis;