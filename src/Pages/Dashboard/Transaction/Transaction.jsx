import React, { useState } from 'react';
import { Table, Checkbox, Button, Select, Dropdown, Space, ConfigProvider } from 'antd';
import { AiOutlineEye, AiOutlineDown, AiOutlineUp, AiOutlineFilter } from 'react-icons/ai';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './TransactionTable.css';

const TransactionTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  // Sample data generation
  const generateData = () => {
    return Array(1000).fill().map((_, index) => ({
      key: index,
      date: '22 Feb 25',
      transactionId: `T${2000 + index}`,
      sellerName: 'Angelique Morse',
      product: 'Smartphone',
      amount: 500 + Math.floor(Math.random() * 500),
      platformShare: 50 + Math.floor(Math.random() * 50),
      platformSharePercentage: 10,
    }));
  };

  const [data, setData] = useState(generateData());

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    const newData = data.filter(item => !selectedRows.includes(item.key));
    setData(newData);
    setSelectedRows([]);
    
    // Adjust current page if we deleted all items on the current page
    if (newData.length <= (currentPage - 1) * pageSize) {
      setCurrentPage(Math.max(1, currentPage - 1));
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
    setCurrentPage(1); // Reset to first page when sorting
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

  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, record.key]);
            } else {
              setSelectedRows(selectedRows.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
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
      render: (text) => (
        <div className="seller-info">
          <div className="avatar">
            <img src="https://i.ibb.co.com/QF3711qv/Frame-2147226793.png" alt="Seller avatar" />
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
          onClick={() => {
            setData(data.filter(item => item.key !== record.key));
            // Adjust current page if we deleted the last item on the current page
            if (data.length % pageSize === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        />
      ),
    },
  ];

  const handleSelectAll = (e) => {
    const currentPageKeys = paginatedData.map(item => item.key);
    if (e.target.checked) {
      // Add all page items to selection (avoiding duplicates)
      setSelectedRows([...new Set([...selectedRows, ...currentPageKeys])]);
    } else {
      // Remove all page items from selection
      setSelectedRows(selectedRows.filter(key => !currentPageKeys.includes(key)));
    }
  };

  // Calculate current page data
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Check if all items on current page are selected
  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every(item => selectedRows.includes(item.key));

  // Check if some items on current page are selected
  const isIndeterminate = paginatedData.some(item => selectedRows.includes(item.key)) && 
    !isAllSelected;

  // Custom table header
  const tableHeader = () => (
    <div className="custom-table-header">
      <Checkbox 
        onChange={handleSelectAll}
        checked={isAllSelected}
        indeterminate={isIndeterminate}
      />
      <span className="header-title">Transaction</span>
      <div className="header-actions">
        {selectedRows.length > 0 && (
          <Button 
            type="primary" 
            danger
            onClick={handleBulkDelete}
            style={{ marginRight: '10px' }}
          >
            Bulk Delete ({selectedRows.length})
          </Button>
        )}
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
          <Button style={{border:"1px solid gray",padding:"10px", fontWeight:"unset"}} type="text">
            <Space>
              Short
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
    setCurrentPage(1); // Reset to first page when changing page size
  };

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
          <Table 
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            rowClassName="transaction-row"
            onChange={(pagination, filters, sorter) => {
              if (sorter && sorter.field) {
                handleSort(sorter.field);
              }
            }}
          />
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
              {data.length > 0 ? 
                `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, data.length)} of ${data.length}` 
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
              disabled={currentPage * pageSize >= data.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-button"
            >
              <IoIosArrowForward size={22} />
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TransactionTable;