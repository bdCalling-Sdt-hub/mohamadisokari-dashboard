import { Select } from 'antd';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useGetReportChartQuery } from '../../../features/Report/ReportApi';

const ReportChart = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  // Get current month in YYYY-MM format
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  const [hiddenBars, setHiddenBars] = useState([]);

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

  // Generate month options for the last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return {
      value: `${year}-${month}`,
      label: `${year}-${month}`
    };
  }).reverse();

  // The key fix: Pass parameters correctly to useGetReportChartQuery
  // RTK Query expects a single argument, so we pass an object containing all params
  const { data, isLoading, error } = useGetReportChartQuery({
    location: selectedDistrict,
    month: selectedMonth
  });

  // Transform API data to match chart expectations with proper error handling
 const dayToMonthMap = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

const chartData = data?.data ? Object.entries(data.data).map(([key, value]) => ({
  name: dayToMonthMap[key] || `Day ${key}`, // fallback if key is not 1-12
  review: value['under review'] || 0,
  resolve: value.resolved || 0
})) : [];

  // Updated CustomTooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <p className="m-0 font-bold text-gray-700">{label}</p>
          <div className="mt-1">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FF6B35' }}></div>
              <p className="m-0"><span className="font-medium">Under Review:</span> {payload[0].value}</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#FFCBA5' }}></div>
              <p className="m-0"><span className="font-medium">Resolved:</span> {payload[1].value}</p>
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

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64">Error loading data: {error.message || 'Could not fetch report data'}</div>;

  return (
    <div className="flex flex-col justify-start w-full h-full p-6 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">Report Statistics</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            style={{ width: 200 }}
            placeholder="Select District"
            options={[
              { value: '', label: 'All Districts' },
              ...districtOptions
            ]}
          />
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            style={{ width: 200 }}
            placeholder="Select Month"
            options={monthOptions}
          />
        </div>
      </div>

      <div className="flex flex-grow w-full mt-6">
        <ResponsiveContainer width="100%" height={550}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
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
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Legend
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '20px' }}
              onClick={(e) => handleLegendClick(e.dataKey)}
              payload={[
                {
                  value: 'Under Review',
                  dataKey: 'review',
                  type: 'circle',
                  color: '#FF6B35'
                },
                {
                  value: 'Resolved',
                  dataKey: 'resolve',
                  type: 'circle',
                  color: '#FFCBA5'
                },
              ]}
              formatter={(value, entry) => (
                <span style={{ color: hiddenBars.includes(entry.dataKey) ? '#999' : '#333', cursor: 'pointer' }}>
                  {value}
                </span>
              )}
            />
            {!hiddenBars.includes('review') && (
              <Bar dataKey="review" fill="#FF6B35" radius={[4, 4, 0, 0]} barSize={20} />
            )}
            {!hiddenBars.includes('resolve') && (
              <Bar dataKey="resolve" fill="#FFCBA5" radius={[4, 4, 0, 0]} barSize={20} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportChart;