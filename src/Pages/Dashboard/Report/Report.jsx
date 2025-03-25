import React, { useState, useEffect, useMemo } from "react";
import { Table, ConfigProvider, Button, DatePicker, Input, Tag, Tooltip, Dropdown, Space, Modal } from "antd";
import { SearchOutlined, FilterOutlined, SortAscendingOutlined, SortDescendingOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import DetailsModal from "./DetailsModal";
import ReportChart from "./ReportChart";

function Report() {
  // Enhanced state management
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortState, setSortState] = useState({
    field: 'date',
    order: 'desc'
  });
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [tableSettings, setTableSettings] = useState({
    dense: false,
    showBorders: true,
    pageSize: 10
  });

  // Simulating data fetching
  useEffect(() => {
    setLoading(true);
    // Simulating API call delay
    setTimeout(() => {
      setUserData(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Enhanced handlers
  const handleDeleteSelected = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setUserData(userData.filter((user) => !selectedRowKeys.includes(user.key)));
    setSelectedRowKeys([]);
    setIsDeleteModalVisible(false);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleSort = (field) => {
    setSortState({
      field,
      order: sortState.field === field && sortState.order === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status === filterStatus ? null : status);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setUserData(sampleData);
      setLoading(false);
      setSearchText('');
      setFilterStatus(null);
      setSelectedMonth(null);
    }, 500);
  };

  // Table data processing with memoization
  const processedData = useMemo(() => {
    let result = [...userData];
    
    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(item => 
        item.reportID.toLowerCase().includes(searchLower) ||
        item.serviceProvider.toLowerCase().includes(searchLower) ||
        item.reportedBy.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }
    
    // Apply month filter
    if (selectedMonth) {
      const month = selectedMonth.month();
      const year = selectedMonth.year();
      result = result.filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortState.field];
      const bValue = b[sortState.field];
      
      if (sortState.field === 'date') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortState.order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (typeof aValue === 'string') {
        return sortState.order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortState.order === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return result;
  }, [userData, searchText, filterStatus, selectedMonth, sortState]);

  // Enhanced columns with sorting and filtering
  const columns = [
    {
      title: (
        <div className="flex items-center justify-between">
          <span>Report ID</span>
          <Button 
            type="text" 
            size="small" 
            icon={sortState.field === 'reportID' 
              ? (sortState.order === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) 
              : <SortAscendingOutlined className="text-gray-400" />}
            onClick={() => handleSort('reportID')}
          />
        </div>
      ),
      dataIndex: "reportID",
      key: "reportID",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>Service Provider</span>
          <Button 
            type="text" 
            size="small" 
            icon={sortState.field === 'serviceProvider' 
              ? (sortState.order === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) 
              : <SortAscendingOutlined className="text-gray-400" />}
            onClick={() => handleSort('serviceProvider')}
          />
        </div>
      ),
      dataIndex: "serviceProvider",
      key: "serviceProvider",
    },
    {
      title: "Reported By",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <span>Status</span>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'all',
                  label: 'All Statuses',
                  onClick: () => setFilterStatus(null)
                },
                {
                  key: 'resolved',
                  label: 'Resolved',
                  onClick: () => handleFilterStatus('Resolved')
                },
                {
                  key: 'under-review',
                  label: 'Under Review',
                  onClick: () => handleFilterStatus('Under Review')
                },
                {
                  key: 'pending',
                  label: 'Pending',
                  onClick: () => handleFilterStatus('Pending')
                },
                {
                  key: 'rejected',
                  label: 'Rejected',
                  onClick: () => handleFilterStatus('Rejected')
                }
              ]
            }}
            trigger={['click']}
          >
            <FilterOutlined 
              className={`cursor-pointer ${filterStatus ? 'text-blue-500' : 'text-gray-400'}`} 
            />
          </Dropdown>
        </div>
      ),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = 'default';
        if (status === 'Resolved') color = 'success';
        else if (status === 'Under Review') color = 'processing';
        else if (status === 'Pending') color = 'warning';
        else if (status === 'Rejected') color = 'error';
        
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <span>Date</span>
          <Button 
            type="text" 
            size="small" 
            icon={sortState.field === 'date' 
              ? (sortState.order === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) 
              : <SortAscendingOutlined className="text-gray-400" />}
            onClick={() => handleSort('date')}
          />
        </div>
      ),
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const date = new Date(text);
        return (
          <Tooltip title={date.toLocaleString()}>
            {date.toLocaleDateString()}
          </Tooltip>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const colors = {
          High: 'error',
          Medium: 'warning',
          Low: 'success'
        };
        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="View Details">
            <EyeOutlined
              className="text-lg cursor-pointer hover:text-blue-500"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              className="text-lg cursor-pointer hover:text-red-500"
              onClick={() => {
                setSelectedRowKeys([record.key]);
                setIsDeleteModalVisible(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];



  return (
   <div className="flex flex-col gap-4">
     <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
          borderRadius: 6,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Table: {
            rowSelectedBg: "rgba(24, 160, 251, 0.1)",
            headerBg: "#f0f7ff",
            headerSplitColor: tableSettings.showBorders ? "#e5e7eb" : "transparent",
            headerBorderRadius: 6,
            cellFontSize: tableSettings.dense ? "14px" : "16px",
            rowHoverBg: "rgba(24, 160, 251, 0.05)",
            borderColor: tableSettings.showBorders ? "#e5e7eb" : "transparent",
          },
          Pagination: {
            borderRadius: 6,
            itemActiveBg: "#18a0fb",
          },
          Button: {
            defaultHoverBg: "rgba(24, 160, 251, 0.1)",
            defaultHoverColor: "#18a0fb",
            defaultHoverBorderColor: "#18a0fb",
          },
          Tag: {
            defaultBg: "#f0f7ff",
            defaultColor: "#18a0fb",
          },
        },
      }}
    >

        <ReportChart />
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Report Issues</h1>
            <p className="mt-1 text-gray-500">
              {processedData.length} {processedData.length === 1 ? 'report' : 'reports'} found
              {filterStatus ? ` with status "${filterStatus}"` : ''}
              {searchText ? ` matching "${searchText}"` : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Tooltip title="Refresh Data">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
                className="flex items-center justify-center"
              />
            </Tooltip>
            
            <Tooltip title="Export to CSV">
              <Button 
                icon={<DownloadOutlined />} 
                className="flex items-center justify-center"
              >
                Export
              </Button>
            </Tooltip>
            
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-1 gap-3">
            <Input
              placeholder="Search by ID, provider, or reporter..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="max-w-md"
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
            
            <DatePicker 
              picker="month" 
              placeholder="Filter by month"
              className="w-40"
              onChange={handleMonthChange}
              value={selectedMonth}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              icon={sortState.order === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => handleSort('date')}
              type={sortState.field === 'date' ? "primary" : "default"}
              ghost={sortState.field === 'date'}
              className="flex items-center"
            >
              Sort by Date
            </Button>

            {selectedRowKeys.length > 0 && (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDeleteSelected}
                danger
                type="primary"
                className="flex items-center"
              >
                Delete {selectedRowKeys.length} Selected
              </Button>
            )}
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={processedData}
          loading={loading}
          size={tableSettings.dense ? "small" : "middle"}
          pagination={{
            defaultPageSize: tableSettings.pageSize,
            pageSize: tableSettings.pageSize,
            position: ["bottomRight"],
            size: "default",
            total: processedData.length,
            
           
            
          }}
          rowClassName="hover:bg-gray-50 transition-colors"
          bordered={tableSettings.showBorders}
          className={tableSettings.showBorders ? "" : "table-borderless"}
        />

        {/* View Details Modal */}
        {isModalOpen && selectedRecord && (
          <DetailsModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            record={selectedRecord}
          />
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalVisible}
          centered
          onCancel={() => setIsDeleteModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="delete" danger type="primary" onClick={confirmDelete}>
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete {selectedRowKeys.length} selected {selectedRowKeys.length === 1 ? 'item' : 'items'}?</p>
          <p className="mt-2 text-gray-500">This action cannot be undone.</p>
        </Modal>
      </div>
    </ConfigProvider>
   </div>
  );
}

export default Report;

// Enhanced data with more fields and expanded status options
const sampleData = [
  {
    key: 1,
    reportID: "R001",
    serviceProvider: "Provider 1",
    reportedBy: "John Smith",
    status: "Under Review",
    date: "2024-12-11",
    priority: "High",
    description: "Service was interrupted for 2 hours without prior notice"
  },
  {
    key: 2,
    reportID: "R002",
    serviceProvider: "Provider 2",
    reportedBy: "Sarah Johnson",
    status: "Resolved",
    date: "2024-06-11",
    priority: "Medium",
    description: "Billing discrepancy resolved after verification"
  },
  {
    key: 3,
    reportID: "R003",
    serviceProvider: "Provider 3",
    reportedBy: "Michael Brown",
    status: "Resolved",
    date: "2024-12-05",
    priority: "Low",
    description: "Minor UI issues in the dashboard"
  },
  {
    key: 4,
    reportID: "R004",
    serviceProvider: "Provider 4",
    reportedBy: "Emma Wilson",
    status: "Under Review",
    date: "2024-10-01",
    priority: "High",
    description: "Customer data was not properly synced between systems"
  },
  {
    key: 5,
    reportID: "R005",
    serviceProvider: "Provider 1",
    reportedBy: "Robert Garcia",
    status: "Pending",
    date: "2024-12-18",
    priority: "Medium",
    description: "Service quality degradation during peak hours"
  },
  {
    key: 6,
    reportID: "R006",
    serviceProvider: "Provider 5",
    reportedBy: "Jennifer Lee",
    status: "Rejected",
    date: "2024-11-24",
    priority: "Low",
    description: "Feature request outside of service agreement scope"
  },
  {
    key: 7,
    reportID: "R007",
    serviceProvider: "Provider 2",
    reportedBy: "David Miller",
    status: "Resolved",
    date: "2024-12-03",
    priority: "High",
    description: "Critical security vulnerability that was patched"
  },
  {
    key: 8,
    reportID: "R008",
    serviceProvider: "Provider 3",
    reportedBy: "Lisa Taylor",
    status: "Pending",
    date: "2024-12-15",
    priority: "Medium",
    description: "Integration issue with third-party API"
  },
];