import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Dropdown, 
  Menu, 
  Badge, 
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  message,
  Modal,
  Form,
  Select,
  DatePicker,
  ConfigProvider
} from 'antd';
import { 
  SearchOutlined, 
  MoreOutlined, 
  ExportOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  SortDescendingOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './UserManagement.css'; // For additional styling
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManagement = () => {
  const router = useNavigate();
  // Sample data
  const initialData = [
    {
      key: '1',
      name: 'Angelique Morse',
      email: 'benny18@yahoo.com',
      phone: '+46 8 123 456',
      address: 'Al Faisaliah Tower, King Fahd Road, Olaya District, Riyadh 11491',
      status: 'Active',
      createdAt: '2023-01-15',
    },
    // ... rest of the initial data
  ];

  // Generate more mock data for pagination demo
  const generateMoreData = () => {
    const additionalData = [];
    for (let i = 11; i <= 100; i++) {
      additionalData.push({
        key: i.toString(),
        name: `User ${i}`,
        email: `user${i}@example.com`,
        phone: '+46 8 123 456',
        address: 'Al Faisaliah Tower, King Fahd Road, Olaya District, Riyadh 11491',
        status: i % 3 === 0 ? 'Banned' : 'Active',
        createdAt: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      });
    }
    return [...initialData, ...additionalData];
  };

  const allData = generateMoreData();

  // State
  const [data, setData] = useState(allData);
  const [filteredData, setFilteredData] = useState(allData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ascend');
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [isBulkActionModalVisible, setIsBulkActionModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form] = Form.useForm();

  // Effect to handle pagination
  useEffect(() => {
    const paginatedData = applyPagination(filteredData);
    setData(paginatedData);
  }, [currentPage, pageSize, filteredData]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allData];
    
    // Apply search filter
    if (searchText) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.address.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phone.includes(searchText)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    // Apply sorting
    if (sortField && sortOrder) {
      result = result.sort((a, b) => {
        if (sortOrder === 'ascend') {
          return a[sortField].localeCompare(b[sortField]);
        } else {
          return b[sortField].localeCompare(a[sortField]);
        }
      });
    }
    
    setFilteredData(result);
  }, [searchText, statusFilter, dateRange, sortField, sortOrder]);

  // Pagination logic
  const applyPagination = (data) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // User click handler - logs the user ID


  // Name click handler - logs the particular data
  const handleNameClick = (record, e) => {
    e.stopPropagation(); // Prevent row click from triggering
    router(`/user-management/user-details/${record?.key}`)
  };

  // Filtering handler
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Status filter handler
  const handleStatusFilter = (status) => {
    setStatusFilter(status === 'all' ? null : status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Sort handler
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
  };



  // Bulk actions handler
  const handleBulkAction = (action) => {
    setLoading(true);
    
    // Simulate bulk action process
    setTimeout(() => {
      if (action === 'delete') {
        message.success(`${selectedRowKeys.length} users deleted successfully`);
      } else if (action === 'activate') {
        message.success(`${selectedRowKeys.length} users activated successfully`);
      } else if (action === 'ban') {
        message.success(`${selectedRowKeys.length} users banned successfully`);
      }
      
      setSelectedRowKeys([]);
      setLoading(false);
      setIsBulkActionModalVisible(false);
    }, 1500);
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Action menu for each row
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item 
        key="2" 
        danger
        onClick={() => {
          Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
              message.success(`User ${record.name} deleted successfully`);
            },
          });
        }}
      >
        Delete
      </Menu.Item>
      <Menu.Item 
        key="3"
        onClick={() => {
          const newStatus = record.status === 'Active' ? 'Banned' : 'Active';
          message.success(`User status changed to ${newStatus}`);
        }}
      >
        {record.status === 'Active' ? 'Ban User' : 'Activate User'}
      </Menu.Item>
    </Menu>
  );

  // Status filter menu
  const statusMenu = (
    <Menu onClick={({key}) => handleStatusFilter(key)}>
      <Menu.Item key="all">All</Menu.Item>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Banned">Banned</Menu.Item>
    </Menu>
  );

  // Sort menu
  const sortMenu = (
    <Menu>
      <Menu.Item 
        key="name" 
        onClick={() => handleSort('name', 'ascend')}
        icon={<SortAscendingOutlined />}
      >
        Sort by Name (A-Z)
      </Menu.Item>
      <Menu.Item 
        key="name-desc" 
        onClick={() => handleSort('name', 'descend')}
        icon={<SortDescendingOutlined />}
      >
        Sort by Name (Z-A)
      </Menu.Item>
      <Menu.Item 
        key="status" 
        onClick={() => handleSort('status', 'ascend')}
        icon={<SortAscendingOutlined />}
      >
        Sort by Status
      </Menu.Item>
      <Menu.Item 
        key="date" 
        onClick={() => handleSort('createdAt', 'ascend')}
        icon={<SortAscendingOutlined />}
      >
        Sort by Newest
      </Menu.Item>
      <Menu.Item 
        key="date-desc" 
        onClick={() => handleSort('createdAt', 'descend')}
        icon={<SortDescendingOutlined />}
      >
        Sort by Oldest
      </Menu.Item>
    </Menu>
  );

  // Bulk action menu
  const bulkActionMenu = (
    <Menu onClick={() => setIsBulkActionModalVisible(true)}>
      <Menu.Item key="active">Activate Selected</Menu.Item>
      <Menu.Item key="ban">Ban Selected</Menu.Item>
      <Menu.Item key="delete" danger>Delete Selected</Menu.Item>
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor:"pointer" }}
          onClick={(e) => handleNameClick(record, e)}
        >
          <Avatar src={`https://randomuser.me/api/portraits/women/${parseInt(record.key) % 70 + 1}.jpg`} />
          <div style={{ marginLeft: 12 }}>
            <div>{text}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Banned', value: 'Banned' },
      ],
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'error'} 
          text={status} 
          style={{ 
            color: status === 'Active' ? '#52c41a' : '#f5222d',
            fontWeight: 'medium'
          }} 
        />
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <Card bodyStyle={{ padding: '0px' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong style={{ fontSize: '18px' }}>User Management</Text>
            </Col>
            <Col>
              <Space size="middle">
                <Input 
                  placeholder="Search..." 
                  prefix={<SearchOutlined />} 
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchText}
                  style={{ width: 200 }}
                  allowClear
                />
                <Dropdown overlay={statusMenu}>
                  <Button icon={<FilterOutlined />}>
                    {statusFilter ? `Status: ${statusFilter}` : 'Filter'}
                  </Button>
                </Dropdown>
                <Dropdown overlay={sortMenu}>
                  <Button 
                    icon={sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                    onClick={toggleSortOrder}
                  >
                    Sort
                  </Button>
                </Dropdown>
                <Button 
                  type="primary" 
                  icon={<ExportOutlined />}
                  onClick={() => setIsExportModalVisible(true)}
                >
                  Export
                </Button>
                {selectedRowKeys.length > 0 && (
                  <Dropdown overlay={bulkActionMenu}>
                    <Button type="primary">
                      Actions ({selectedRowKeys.length})
                    </Button>
                  </Dropdown>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={data}
          loading={loading}
         
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            onChange: (page) => setCurrentPage(page),
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              setCurrentPage(1); // Reset to first page when changing page size
            }
          }}
          onChange={(pagination, filters, sorter) => {
            if (sorter && sorter.field) {
              setSortField(sorter.field);
              setSortOrder(sorter.order || 'ascend');
            }
            
            if (filters && filters.status) {
              setStatusFilter(filters.status[0]);
            }
          }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </ConfigProvider>
  );
};

export default UserManagement;