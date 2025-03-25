// App.jsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Select, Typography, Row, Col, ConfigProvider, Modal, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

function ProductManagementTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const router = useNavigate();
  const [filters, setFilters] = useState({
    category: null,
    seller: null,
    location: null,
    status: null,
  });
  const [sortConfig, setSortConfig] = useState({
    field: null,
    order: null,
  });
  const [originalData, setOriginalData] = useState([
    {
      key: '1',
      listingDate: '12 March 25',
      productTitle: 'iPhone 12',
      category: 'Electronics',
      seller: 'John Doe',
      location: 'Mogadishu',
      price: '$450',
      status: 'Available',
    },
    {
      key: '2',
      listingDate: '12 March 25',
      productTitle: 'iPhone 12',
      category: 'Electronics',
      seller: 'Mogadishu',
      location: 'Mogadishu',
      price: '$450',
      status: 'Sold',
      soldDate: '12 March 25',
    },
    {
      key: '3',
      listingDate: '12 March 25',
      productTitle: 'Samsung Galaxy',
      category: 'Electronics',
      seller: 'John Doe',
      location: 'Mogadishu',
      price: '$450',
      status: 'Available',
    },
    {
      key: '4',
      listingDate: '12 March 25',
      productTitle: 'MacBook Pro',
      category: 'Electronics',
      seller: 'Mogadishu',
      location: 'Mogadishu',
      price: '$1200',
      status: 'Sold',
      soldDate: '12 March 25',
    },
    {
      key: '5',
      listingDate: '12 March 25',
      productTitle: 'Dress Shirt',
      category: 'Clothing',
      seller: 'John Doe',
      location: 'Mogadishu',
      price: '$45',
      status: 'Available',
    },
    {
      key: '6',
      listingDate: '12 March 25',
      productTitle: 'Dining Table',
      category: 'Furniture',
      seller: 'Mogadishu',
      location: 'Mogadishu',
      price: '$350',
      status: 'Sold',
      soldDate: '12 March 25',
    },
    {
      key: '7',
      listingDate: '12 March 25',
      productTitle: 'Office Chair',
      category: 'Furniture',
      seller: 'John Doe',
      location: 'Mogadishu',
      price: '$150',
      status: 'Available',
    },
    {
      key: '8',
      listingDate: '12 March 25',
      productTitle: 'Jeans',
      category: 'Clothing',
      seller: 'Mogadishu',
      location: 'Mogadishu',
      price: '$55',
      status: 'Sold',
      soldDate: '12 March 25',
    },
    {
      key: '9',
      listingDate: '12 March 25',
      productTitle: 'iPad Mini',
      category: 'Electronics',
      seller: 'John Doe',
      location: 'Mogadishu',
      price: '$350',
      status: 'Available',
    },
    {
      key: '10',
      listingDate: '12 March 25',
      productTitle: 'Sofa Set',
      category: 'Furniture',
      seller: 'Mogadishu',
      location: 'Mogadishu',
      price: '$750',
      status: 'Sold',
      soldDate: '12 March 25',
    },
    ...Array.from({ length: 30 }, (_, i) => ({
      key: `${i + 11}`,
      listingDate: '15 March 25',
      productTitle: `Product ${i + 11}`,
      category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Clothing' : 'Furniture',
      seller: i % 2 === 0 ? 'John Doe' : 'Mogadishu',
      location: 'Mogadishu',
      price: `$${Math.floor(Math.random() * 1000) + 50}`,
      status: i % 2 === 0 ? 'Available' : 'Sold',
      soldDate: i % 2 === 0 ? null : '15 March 25',
    })),
  ]);

  // Filter, search and sort logic
  useEffect(() => {
    let result = [...originalData];
    
    // Apply filters
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    
    if (filters.seller) {
      result = result.filter(item => item.seller === filters.seller);
    }
    
    if (filters.location) {
      result = result.filter(item => item.location === filters.location);
    }
    
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }
    
    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(item => 
        item.productTitle.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.seller.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sortConfig.field) {
      const column = columns.find(col => col.key === sortConfig.field || col.dataIndex === sortConfig.field);
      if (column && column.sorter) {
        result.sort((a, b) => {
          const compareResult = column.sorter(a, b);
          return sortConfig.order === 'descend' ? -compareResult : compareResult;
        });
      }
    }
    
    setTotalItems(result.length);
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, searchText, originalData, sortConfig]);

  // Get data for current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  // Filter change handlers
  const handleFilterChange = (value, filterType) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Pagination handlers
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Row selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleUserClick = (id) => {
    router(`/product-details/${id}`)
  }

  // Delete functions
  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      content: `Product: ${record.productTitle}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered:true,
      onOk() {
        handleDelete([record.key]);
      },
    });
  };

  const showBulkDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete the selected items?',
      content: `${selectedRowKeys.length} items will be deleted`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true, 
      onOk() {
        handleDelete(selectedRowKeys);
      },
    });
  };

  const handleDelete = (keysToDelete) => {
    setOriginalData(prevData => prevData.filter(item => !keysToDelete.includes(item.key)));
    setSelectedRowKeys(prevKeys => prevKeys.filter(key => !keysToDelete.includes(key)));
  };

  // Handle table sorting
  const handleTableChange = (pagination, filters, sorter) => {
    setSortConfig({
      field: sorter.field,
      order: sorter.order,
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Listing Date',
      dataIndex: 'listingDate',
      key: 'listingDate',
      sorter: (a, b) => {
        // Convert dates to timestamps for comparison
        const dateA = new Date(a.listingDate).getTime();
        const dateB = new Date(b.listingDate).getTime();
        return dateA - dateB;
      },
    },
    {
      title: 'Product Title',
      dataIndex: 'productTitle',
      key: 'productTitle',
      sorter: (a, b) => a.productTitle.localeCompare(b.productTitle),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Seller',
      dataIndex: 'seller',
      key: 'seller',
      sorter: (a, b) => a.seller.localeCompare(b.seller),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => {
        // Extract numeric value from price string
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceA - priceB;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text, record) => (
        <span style={{ color: text === 'Available' ? '#52c41a' : '#f5222d' }}>
          {text}
          {record.soldDate && <div style={{ fontSize: '12px' }}>{record.soldDate}</div>}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="See">
            <Button onClick={() => handleUserClick(record.key)} type="text" icon={<EyeOutlined />} />
          </Tooltip> 
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  // Get available filter options from data
  const categoryOptions = [...new Set(originalData.map(item => item.category))];
  const sellerOptions = [...new Set(originalData.map(item => item.seller))];
  const locationOptions = [...new Set(originalData.map(item => item.location))];
  const statusOptions = [...new Set(originalData.map(item => item.status))];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <div className="p-4 bg-white rounded-lg">
        <Title level={3}>Product Management</Title>
        
        <div className="mb-5 filters">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6} lg={5}>
              <Select 
                placeholder="Category" 
                style={{ width: '100%' }}
                allowClear
                onChange={(value) => handleFilterChange(value, 'category')}
              >
                {categoryOptions.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6} lg={5}>
              <Select 
                placeholder="District" 
                style={{ width: '100%' }}
                allowClear
                onChange={(value) => handleFilterChange(value, 'location')}
              >
                {locationOptions.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Select 
                placeholder="Status" 
                style={{ width: '100%' }}
                allowClear
                onChange={(value) => handleFilterChange(value, 'status')}
              >
                {statusOptions.map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Input 
                placeholder="Search..." 
                prefix={<SearchOutlined />} 
                style={{ width: '100%' }}
                onChange={handleSearch}
                value={searchText}
              />
            </Col>
          </Row>
        </div>

        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              danger 
              onClick={showBulkDeleteConfirm}
              icon={<DeleteOutlined />}
            >
              Bulk Delete ({selectedRowKeys.length})
            </Button>
          </div>
        )}

        <div className="table-container">
          <Table 
            rowSelection={rowSelection}
            columns={columns} 
            dataSource={getCurrentPageData()}
            pagination={false}
            size="middle"
            onChange={handleTableChange}
          />
          <div className="pagination-container">
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
            <span style={{ margin: '0 16px' }}>
              {totalItems === 0 
                ? '0-0 of 0' 
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`}
            </span>
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              disabled={currentPage === 1} 
              onClick={handlePrevPage}
              style={{ marginRight: '8px' }} 
            />
            <Button 
              type="text" 
              icon={<RightOutlined />} 
              disabled={currentPage >= Math.ceil(totalItems / pageSize)}
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default ProductManagementTable;