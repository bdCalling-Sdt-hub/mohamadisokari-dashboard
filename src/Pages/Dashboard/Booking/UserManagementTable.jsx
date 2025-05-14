import * as XLSX from 'xlsx';
import {
  ExportOutlined,
  FilterOutlined,
  LeftOutlined,
  MoreOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Dropdown,
  Input,
  Menu,
  message,
  Space,
  Table,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUserQuery, useUpdateUserStatusMutation } from '../../../features/userManagement/UserManagementApi';
import './UserManagement.css';
import toast from 'react-hot-toast';

const { Text } = Typography;

const UserManagementTable = () => {
  const router = useNavigate();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // API fetch with current page
  const { data: userData, isLoading, refetch } = useGetAllUserQuery(currentPage);
  const [updateStatus, { isLoading: updatingStatusLoading }] = useUpdateUserStatusMutation();
  
  // Extract data and pagination info from API response
  const users = userData?.data || [];
  const pagination = userData?.pagination || { total: 0, totalPage: 0, page: 1, limit: 10 };
  
  // State for filters and sorting
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ascend');
  
  // Reset selected rows when users data changes
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [users]);

  // Handle client-side filtering when search, status filter changes
  const getFilteredData = () => {
    let result = [...users];

    // Apply search filter
    if (searchText) {
      result = result.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.contactNumber && item.contactNumber.includes(searchText))
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }

    // Apply sorting
    if (sortField && sortOrder) {
      result = result.sort((a, b) => {
        if (a[sortField] === undefined || b[sortField] === undefined) return 0;
        
        if (sortOrder === 'ascend') {
          return a[sortField]?.toString().localeCompare(b[sortField]?.toString());
        } else {
          return b[sortField]?.toString().localeCompare(a[sortField]?.toString());
        }
      });
    }

    return result;
  };

  // Export handler
  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one user to export');
      return;
    }

    // Get selected users data
    const selectedUsers = users.filter(user => selectedRowKeys.includes(user._id));
    
    // Prepare data for Excel
    const exportData = selectedUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      'Phone Number': user.contactNumber ? `+${user.contactNumber}` : '',
      Address: user.location || '',
      Status: user.status === 'active' ? 'Active' : 'Banned'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    
    // Generate file and download
    XLSX.writeFile(wb, `users_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Name click handler
  const handleNameClick = (record, e) => {
    e.stopPropagation();
    router(`/user-management/user-details/${record._id}`);
  };

  // Search handler 
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Status filter handler
  const handleStatusFilter = (status) => {
    setStatusFilter(status === 'all' ? null : status);
  };

  // Sort handler
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Previous page handler
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page handler
  const handleNextPage = () => {
    if (currentPage < pagination.totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle status change for a single user
  const handleStatusChange = async (userId, newStatus) => {
    try {
     const response =  await updateStatus({ id: userId, status: newStatus }).unwrap();
     console.log(response)
      toast.success(`User status changed to ${newStatus}`);
      refetch(); // Refresh data after status change
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    columnWidth: 40,
  };

  // Action menu for each row
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="status-change"
        onClick={() => {
          const newStatus = record.status === 'active' ? 'banned' : 'active';
          handleStatusChange(record._id, newStatus);
        }}
      >
        {record.status === 'active' ? 'Ban User' : 'Activate User'}
      </Menu.Item>
    </Menu>
  );

  // Sort and filter menu
  const sortFilterMenu = (
    <Menu>
      <Menu.Item
        key="name-asc"
        onClick={() => handleSort('name', 'ascend')}
      >
        Sort by Name (A-Z)
      </Menu.Item>
      <Menu.Item
        key="name-desc"
        onClick={() => handleSort('name', 'descend')}
      >
        Sort by Name (Z-A)
      </Menu.Item>
      <Menu.Item
        key="date-asc"
        onClick={() => handleSort('createdAt', 'ascend')}
      >
        Sort by Oldest
      </Menu.Item>
      <Menu.Item
        key="date-desc"
        onClick={() => handleSort('createdAt', 'descend')}
      >
        Sort by Newest
      </Menu.Item>
      <Menu.Divider />
      <Menu.ItemGroup title="Filter by Status">
        <Menu.Item key="all" onClick={() => handleStatusFilter('all')}>
          All
        </Menu.Item>
        <Menu.Item key="active" onClick={() => handleStatusFilter('active')}>
          Active
        </Menu.Item>
        <Menu.Item key="banned" onClick={() => handleStatusFilter('banned')}>
          Banned
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : null,
      render: (text, record) => (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }}
          onClick={(e) => handleNameClick(record, e)}
        >
          <Avatar src={record.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random`} size={40} />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phone number',
      dataIndex: 'contactNumber',
      key: 'phone',
      align: 'left',
      render: (phone) => (
        <span>+{phone || '48 8 123 456'}</span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      render: (location) => (
        <div>
          {location || 'Al Faisaliah Tower, King Fahd Road, Olaya District, Riyadh 11461'}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Banned', value: 'banned' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <div 
          style={{ 
            color: status === 'active' ? '#22c55e' : '#ef4444', 
            fontWeight: 500,
            backgroundColor: status === 'banned' ? '#fff5f5' : '#f0fdf4',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          {status === 'active' ? 'Active' : 'Banned'}
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Dropdown overlay={() => actionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Get filtered and sorted data
  const filteredData = getFilteredData();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF6600',
          colorBgContainer: '#ffffff',
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: '#f9fafb',
            headerColor: '#374151',
            rowHoverBg: '#f3f4f6',
          },
          Checkbox: {
            colorPrimary: '#22c55e',
          },
          Button: {
            colorPrimary: '#22c55e',
          }
        }
      }}
    >
      <Card bodyStyle={{ padding: '0px' }} bordered={false}>
        <div style={{ 
          padding: '20px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Text strong style={{ fontSize: '18px' }}>User Management</Text>
          <Space size="middle">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
              style={{ width: 240, borderRadius: 6 }}
              allowClear
            />
            <Dropdown overlay={sortFilterMenu} placement="bottomRight">
              <Button 
                icon={<FilterOutlined />}
                style={{ borderRadius: 6 }}
              >
                Filter
              </Button>
            </Dropdown>
            <Button
              icon={<ExportOutlined />}
              style={{ borderRadius: 6 }}
              onClick={handleExport}
            >
              Export
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={isLoading || updatingStatusLoading}
          pagination={false}
          rowKey="_id"
          size="middle"
          scroll={{ x: 'max-content' }}
          onChange={(pagination, filters, sorter) => {
            if (sorter.field) {
              handleSort(sorter.field, sorter.order);
            }
          }}
        />

        <div style={{ 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '16px' }}>
              Rows per page: 
              <span style={{ fontWeight: 500, margin: '0 4px' }}>
                {pageSize}
              </span>
              <Dropdown
                overlay={
                  <Menu onClick={e => setPageSize(Number(e.key))}>
                    <Menu.Item key="10">10</Menu.Item>
                    <Menu.Item key="20">20</Menu.Item>
                    <Menu.Item key="50">50</Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <span style={{ cursor: 'pointer' }}>▼</span>
              </Dropdown>
            </span>
            <span style={{ marginRight: '16px' }}>
              {pagination.total === 0
                ? '0-0 of 0'
                : `${(currentPage - 1) * pagination.limit + 1}-${Math.min(currentPage * pagination.limit, pagination.total)} of ${pagination.total}`}
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
              disabled={currentPage >= pagination.totalPage}
              onClick={handleNextPage}
            />
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
};

export default UserManagementTable;