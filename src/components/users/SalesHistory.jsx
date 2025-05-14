import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Button, Pagination, Table, Typography } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSellerHistoryQuery } from '../../features/userManagement/UserManagementApi';

const { Title } = Typography;

const SalesHistory = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size
  const [sortOrder, setSortOrder] = useState('ascend'); // 'ascend' or 'descend'

  const { data } = useGetSellerHistoryQuery(id);
  console.log(data);

  // Mock data for sales
  const generateSalesData = () => {
    return Array.from({ length: 100 }, (_, index) => ({
      key: index,
      productName: ['iPhone 12', 'Samsung Galaxy', 'Xiaomi Note', 'Google Pixel', 'Huawei P40'][Math.floor(Math.random() * 5)],
      date: `${Math.floor(Math.random() * 28) + 1} March 25`,
      location: ['Mogadishu', 'Hargeisa', 'Kismayo', 'Baidoa', 'Bosaso'][Math.floor(Math.random() * 5)],
      price: `$${Math.floor(Math.random() * 500) + 200}`,
      buyer: ['Hassan Mahmud', 'Amina Ali', 'Ibrahim Omar', 'Fatima Yusuf', 'Ahmed Mohamed'][Math.floor(Math.random() * 5)]
    }));
  };

  const rawSalesData = generateSalesData();

  // Sort the data based on current sort order (using date as default field)
  const salesData = [...rawSalesData].sort((a, b) => {
    if (sortOrder === 'ascend') {
      return a.date.localeCompare(b.date);
    } else {
      return b.date.localeCompare(a.date);
    }
  });

  // Calculate pagination
  const totalItems = salesData.length;
  const paginatedData = salesData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Function to toggle sort order
  const toggleSort = () => {
    setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Sales History</Title>
        <Button
          onClick={toggleSort}
          icon={sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          className="bg-white"
        >
          Sort {sortOrder === 'ascend' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        rowSelection={{ type: 'checkbox' }}
        pagination={false} // Disable built-in pagination to use custom pagination
      />

      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false} // Remove the page size changer
        />
      </div>
    </div>
  );
};

export default SalesHistory;