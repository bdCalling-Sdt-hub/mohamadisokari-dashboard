import { Button, Checkbox, ConfigProvider, Dropdown, Modal, Select, Space, Spin, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { AiOutlineDown, AiOutlineEye, AiOutlineFilter, AiOutlineUp } from 'react-icons/ai';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useGetPerticularTransactionQuery, useGetTransactionQuery } from '../../../features/Transaction/transactionApi';
import './TransactionTable.css';
import { baseURL } from '../../../utils/BaseURL';

const TransactionTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [data, setData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPage: 1
  });

  // Fetch transactions with pagination
  const { data: transactionData, isLoading: isTransactionLoading } = useGetTransactionQuery(currentPage);

  // Fetch specific transaction when selectedTransactionId changes
  const { data: perticularTransactionData, isLoading: isPerticularTransactionLoading } =
    useGetPerticularTransactionQuery(selectedTransactionId, { skip: !selectedTransactionId });

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD MMM YY');
  };

  // Process API data when it's loaded
  useEffect(() => {
    if (transactionData && transactionData.success) {
      const formattedData = transactionData.data.map((transaction, index) => ({
        key: transaction._id,
        date: formatDate(transaction.createdAt),
        transactionId: transaction.orderNumber,
        sellerId: transaction.sellerId._id,
        sellerName: transaction.sellerId.name,
        sellerImage: transaction.sellerId.image,
        product: transaction.productId,
        amount: transaction.totalPrice,
        platformShare: calculatePlatformShare(transaction.totalPrice),
        platformSharePercentage: 10,
        status: transaction.status,
        isPaid: transaction.isPaid,
        confirmBybyer: transaction.confirmBybyer,
        confirmByseller: transaction.confirmByseller,
      }));
      setData(formattedData);
      setPaginationInfo({
        total: transactionData.pagination.total,
        totalPage: transactionData.pagination.totalPage
      });
    }
  }, [transactionData]);

  // Calculate platform share (10% of total price)
  const calculatePlatformShare = (totalPrice) => {
    return (totalPrice * 0.1).toFixed(2);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    const newData = data.filter(item => !selectedRows.includes(item.key));
    setData(newData);
    setSelectedRows([]);

    // Adjust current page if we deleted all items on the current page
    if (newData.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    let order = 'asc';

    if (sortField === field) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setSortField(field);
    setSortOrder(order);

    const sortedData = [...data].sort((a, b) => {
      if (a[field] === b[field]) return 0;
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });

    setData(sortedData);
  };

  // Filter menu items
  const getFilterMenu = (field) => ({
    items: [
      {
        key: '1',
        label: (
          <div onClick={() => handleSort(field)}>
            <Space>
              <AiOutlineUp /> Ascending
            </Space>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => handleSort(field)}>
            <Space>
              <AiOutlineDown /> Descending
            </Space>
          </div>
        ),
      },
    ],
  });

  // View transaction details
  const handleViewTransaction = (id) => {
    setSelectedTransactionId(id);
    setModalVisible(true);
  };

  const columns = [
    {
      title: (
        <div className="column-header">
          Date
          <Dropdown menu={getFilterMenu('date')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: (
        <div className="column-header">
          Transaction ID
          <Dropdown menu={getFilterMenu('transactionId')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'transactionId',
      key: 'transactionId',
      sorter: true,
    },
    {
      title: (
        <div className="column-header">
          Seller Name
          <Dropdown menu={getFilterMenu('sellerName')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'sellerName',
      key: 'sellerName',
      sorter: true,
      render: (text, record) => (
        <div className="seller-info">
          <div className="avatar">
            <img
              src={record.sellerImage ? `${baseURL}${record.sellerImage}` : "https://i.ibb.co/QF37v/Frame-2147226793.png"}
              alt="Seller avatar"
            />
          </div>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="column-header">
          Product
          <Dropdown menu={getFilterMenu('product')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'product',
      key: 'product',
      sorter: true,
      render: (text) => <span>Product #{text.slice(-6)}</span>,
    },
    {
      title: (
        <div className="column-header">
          Amount
          <Dropdown menu={getFilterMenu('amount')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount) => `$${amount}`,
    },
    {
      title: (
        <div className="column-header">
          Platform Share
          <Dropdown menu={getFilterMenu('platformShare')} trigger={['click']}>
            <Button type="text" size="small" className="filter-button">
              <AiOutlineFilter />
            </Button>
          </Dropdown>
        </div>
      ),
      dataIndex: 'platformShare',
      key: 'platformShare',
      sorter: true,
      render: (share, record) => `$${share} (${record.platformSharePercentage}%)`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          icon={<AiOutlineEye size={18} />}
          className="eye-button"
          onClick={() => handleViewTransaction(record.key)}
        />
      ),
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageKeys = data.map(item => item.key);
      setSelectedRows([...new Set([...selectedRows, ...currentPageKeys])]);
    } else {
      setSelectedRows([]);
    }
  };

  // Check if all items are selected
  const isAllSelected = data.length > 0 && data.every(item => selectedRows.includes(item.key));

  // Check if some items are selected
  const isIndeterminate = data.some(item => selectedRows.includes(item.key)) && !isAllSelected;

  // Custom table header
  const tableHeader = () => (
    <div className="custom-table-header">
      <span className="header-title">Transaction</span>
      <div className="header-actions">
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: 'Sort by Date (Ascending)',
                onClick: () => handleSort('date'),
              },
              {
                key: '2',
                label: 'Sort by Date (Descending)',
                onClick: () => handleSort('date'),
              },
              {
                key: '3',
                label: 'Sort by Amount (Ascending)',
                onClick: () => handleSort('amount'),
              },
              {
                key: '4',
                label: 'Sort by Amount (Descending)',
                onClick: () => handleSort('amount'),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button style={{ border: "1px solid gray", padding: "10px", fontWeight: "unset" }} type="text">
            <Space>
              Sort
              <AiOutlineDown />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </div>
  );

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  // Transaction detail modal
  const renderTransactionModal = () => {
    if (isPerticularTransactionLoading) {
      return (
        <div className="flex justify-center items-center h-[200px]">
          <Spin size="small" />
        </div>
      );
    }

    if (!perticularTransactionData || !perticularTransactionData.success) {
      return (
        <div className="flex justify-center items-center h-[200px] text-gray-500 italic">
          No transaction details available
        </div>
      );
    }

    const transaction = perticularTransactionData.data;

    const getStatusBadgeClasses = (status) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 m-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClasses(
              transaction.status
            )}`}
          >
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </span>
        </div>

        <section className="mb-8 grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
          <DetailRow label="Order Number:" value={transaction.orderNumber} />
          <DetailRow label="Date:" value={formatDate(transaction.createdAt)} />
          <DetailRow label="Total Amount:" value={`$${transaction.totalPrice}`} />
          <DetailRow
            label="Platform Fee:"
            value={`$${calculatePlatformShare(transaction.totalPrice)} (10%)`}
          />
          <DetailRow
            label="Payment Status:"
            value={transaction.isPaid ? 'Paid' : 'Not Paid'}
            valueClass={transaction.isPaid ? 'text-green-600' : 'text-red-600'}
          />
        </section>

        <UserSection
          title="Seller Information"
          user={transaction.sellerId}
          confirmed={transaction.confirmByseller}
          showAvatar
        />

        <UserSection
          title="Customer Information"
          user={transaction.customerId}
          confirmed={transaction.confirmBybyer}
          showAvatar={false}
        />
      </div>
    );
  };

  const DetailRow = ({ label, value, valueClass = '' }) => (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-600">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );

  const UserSection = ({ title, user, confirmed, showAvatar }) => (
    <section className="mb-8">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">{title}</h4>
      <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        {showAvatar && (
          <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border border-gray-300">
            <img
              src={
                user.image
                  ? `${baseURL}${user.image}`
                  : 'https://i.ibb.co/QF37v/Frame-2147226793.png'
              }
              alt={`${user.name} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">
          <DetailRow label="Name:" value={user.name} />
          <DetailRow label="Email:" value={user.email} />
          {user.contactNumber && <DetailRow label="Contact:" value={user.contactNumber} />}
          <DetailRow
            label="Confirmation:"
            value={confirmed ? 'Confirmed' : 'Not Confirmed'}
            valueClass={confirmed ? 'text-green-600' : 'text-red-600'}
          />
        </div>
      </div>
    </section>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <div className="transaction-table-container">
        {tableHeader()}
        <div className="table-container">
          {isTransactionLoading ? (
            <div className="flex justify-center items-center h-[400px]"><Spin size="default" /></div>
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              rowClassName="transaction-row"
              onChange={(pagination, filters, sorter) => {
                if (sorter && sorter.field) {
                  handleSort(sorter.field);
                }
              }}
            />
          )}
        </div>
        <div className="pagination-container">
          <div className="flex items-center gap-4">
            <Select
              defaultValue="10"
              style={{ width: 120 }}
              onChange={handlePageSizeChange}
              options={[
                { value: '10', label: '10 / page' },
                { value: '20', label: '20 / page' },
                { value: '50', label: '50 / page' },
              ]}
            />
            <div className="page-info">
              {paginationInfo.total > 0 ?
                `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, paginationInfo.total)} of ${paginationInfo.total}`
                : 'No data'}
            </div>
          </div>
          <div className="flex items-center gap-1 pagination-controls">
            <Button
              type="text"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="pagination-button"
            >
              <IoIosArrowBack size={22} />
            </Button>
            <Button
              type="text"
              disabled={currentPage >= paginationInfo.totalPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-button"
            >
              <IoIosArrowForward size={22} />
            </Button>
          </div>
        </div>

        <Modal
          title={null}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={700}
          className="transaction-detail-modal"
        >
          {renderTransactionModal()}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TransactionTable;