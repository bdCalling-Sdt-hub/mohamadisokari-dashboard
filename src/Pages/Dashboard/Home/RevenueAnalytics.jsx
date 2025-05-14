import { Select, Spin } from 'antd';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useRevenueAnalysisQuery } from '../../../features/overview/overviewApi';

const RevenueAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: revenueData, isLoading } = useRevenueAnalysisQuery(selectedYear);
  
  // Transform the API data to match the format expected by the chart
  const transformData = (apiData) => {
    if (!apiData) return [];
    
    return apiData.map(item => ({
      month: item.month.substring(0, 3), // Shorten month name to 3 letters
      revenue: item.totalRevenue
    }));
  };

  const chartData = transformData(revenueData?.data);

  // Calculate average revenue for reference line
  const averageRevenue = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length
    : 0;

  // Generate year options for the last 5 years from current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-2 font-bold text-white bg-orange-500 rounded-md shadow-lg">
          ${payload[0].value.toFixed(2)}
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
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 200 }}
            placeholder="Select Year"
            dropdownStyle={{ overflow: 'auto' }}
            loading={isLoading}
          >
            {yearOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="h-96">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p><Spin size="default" /></p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
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
                domain={[0, 'dataMax + 100']}
                tickFormatter={(value) => `$${value}`}
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
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;