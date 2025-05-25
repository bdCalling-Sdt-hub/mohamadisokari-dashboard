import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Button, Pagination, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBuyerHistoryQuery } from '../../features/userManagement/UserManagementApi';


const { Title, Text } = Typography;

const BuyingHistory = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState('descend'); // Default to newest first

  const { data: response, isLoading } = useGetBuyerHistoryQuery(id);
  console.log(response)
  const salesData = response?.data || [];
  const paginationInfo = response?.pagination || { total: 0 };

  // Format the data for the table
  const formattedData = salesData.map((sale) => ({
    key: sale._id,
    productName: sale.productId?.title || 'N/A',
    date: new Date(sale.createdAt).toLocaleDateString(),
    location: sale.sellerId?.location || 'Unknown',
    price: `$${sale.totalPrice.toFixed(2)}`,
    buyer: sale.sellerId?.name || 'Unknown',
    status: sale.status,
    orderNumber: sale.orderNumber,
    createdAt: sale.createdAt
  }));

  // Sort the data based on current sort order
  const sortedData = [...formattedData].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'ascend' ? dateA - dateB : dateB - dateA;
  });

  // Calculate pagination
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = () => {
    setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Product ID',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
      align: 'right',
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Buying History</Title>
        <Button
          onClick={toggleSort}
          icon={sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          className="bg-white"
        >
          Sort {sortOrder === 'ascend' ? 'Oldest First' : 'Newest First'}
        </Button>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        loading={isLoading}
        pagination={false}
        scroll={{ x: true }}
      />

      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={paginationInfo.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default BuyingHistory;