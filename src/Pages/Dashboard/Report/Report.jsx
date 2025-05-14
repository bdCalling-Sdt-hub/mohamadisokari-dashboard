import { DeleteOutlined, DownloadOutlined, EyeOutlined, FilterOutlined, LeftOutlined, ReloadOutlined, RightOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Dropdown, Input, Modal, Select, Table, Tag, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { useDeleteReportMutation, useGetAllReportQuery } from "../../../features/Report/ReportApi";
import DetailsModal from "./DetailsModal";
import ReportChart from "./ReportChart";


function Report() {
  // Enhanced state management
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortState, setSortState] = useState({
    field: 'date',
    order: 'desc'
  });
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [tableSettings, setTableSettings] = useState({
    dense: false,
    showBorders: true,
    pageSize: 10,
    currentPage: 1
  });

  // RTK Query hooks
  const {
    data: reportsData = [],
    isLoading,
    refetch
  } = useGetAllReportQuery();

  console.log(reportsData?.data?.reports)

  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  // Format the API data for table use
  const userData = useMemo(() => {
    if (!reportsData || !reportsData?.data?.reports) return [];

    return reportsData?.data?.reports.map(report => ({
      key: report._id || report.id,
      reportID: report.reportID || `R${report.id}`,
      serviceProvider: report.serviceProvider,
      reportedBy: report.reportedBy,
      status: report.status,
      date: report.date || report.createdAt,
      priority: report.priority,
      description: report.description,
      ...report // Keep all original properties
    }));
  }, [reportsData]);

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Pagination handlers
  const handlePageSizeChange = (value) => {
    setTableSettings(prev => ({
      ...prev,
      pageSize: Number(value),
      currentPage: 1 // Reset to first page when page size changes
    }));
  };

  const handlePrevPage = () => {
    if (tableSettings.currentPage > 1) {
      setTableSettings(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(processedData.length / tableSettings.pageSize);
    if (tableSettings.currentPage < totalPages) {
      setTableSettings(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  // Enhanced handlers
  const handleDeleteSelected = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete each selected report sequentially
      for (const key of selectedRowKeys) {
        await deleteReport(key).unwrap();
      }
      setSelectedRowKeys([]);
      setIsDeleteModalVisible(false);
      // Refresh the data
      refetch();
    } catch (error) {
      console.error("Error deleting reports:", error);
      // Handle error (you might want to show a notification here)
    }
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
    setTableSettings(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when searching
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status === filterStatus ? null : status);
    setTableSettings(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filtering
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    setTableSettings(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filtering by month
  };

  const handleRefresh = () => {
    // Clear filters and refresh data
    setSearchText('');
    setFilterStatus(null);
    setSelectedMonth(null);
    setTableSettings(prev => ({ ...prev, currentPage: 1 }));
    refetch();
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    if (processedData.length === 0) return;

    // Create CSV header
    const headers = columns
      .filter(col => col.key !== 'action') // Exclude action column
      .map(col => col.dataIndex)
      .join(',');

    // Create CSV rows
    const rows = processedData.map(item => {
      return columns
        .filter(col => col.key !== 'action') // Exclude action column
        .map(col => {
          const value = item[col.dataIndex];

          // Format date
          if (col.dataIndex === 'date') {
            return new Date(value).toLocaleDateString();
          }

          // Handle string values with commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }

          return value;
        })
        .join(',');
    }).join('\n');

    // Combine header and rows
    const csv = `${headers}\n${rows}`;

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reports_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table data processing with memoization
  const processedData = useMemo(() => {
    if (!userData || userData.length === 0) return [];

    let result = [...userData];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(item =>
        (item.reportID && item.reportID.toLowerCase().includes(searchLower)) ||
        (item.serviceProvider && item.serviceProvider.toLowerCase().includes(searchLower)) ||
        (item.reportedBy && item.reportedBy.toLowerCase().includes(searchLower))
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

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (tableSettings.currentPage - 1) * tableSettings.pageSize;
    const endIndex = startIndex + tableSettings.pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, tableSettings.currentPage, tableSettings.pageSize]);

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
                  loading={isLoading}
                  className="flex items-center justify-center"
                />
              </Tooltip>

              <Tooltip title="Export to CSV">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportCSV}
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
                  loading={isDeleting}
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
            dataSource={paginatedData}
            loading={isLoading}
            size={tableSettings.dense ? "small" : "middle"}
            pagination={false}
            rowClassName="hover:bg-gray-50 transition-colors"
            bordered={tableSettings.showBorders}
            className={tableSettings.showBorders ? "" : "table-borderless"}
          />

          {/* Custom Pagination */}
          <div className="flex items-center justify-end mt-4 pagination-container">
            <Select
              defaultValue="10"
              style={{ width: 120 }}
              onChange={handlePageSizeChange}
              options={[
                { value: '10', label: '10 / page' },
                { value: '20', label: '20 / page' },
                { value: '50', label: '50 / page' },
              ]}
              value={String(tableSettings.pageSize)}
            />
            <span style={{ margin: '0 16px' }}>
              {processedData.length === 0
                ? '0-0 of 0'
                : `${(tableSettings.currentPage - 1) * tableSettings.pageSize + 1}-${Math.min(tableSettings.currentPage * tableSettings.pageSize, processedData.length)} of ${processedData.length}`}
            </span>
            <Button
              type="text"
              icon={<LeftOutlined />}
              disabled={tableSettings.currentPage === 1}
              onClick={handlePrevPage}
              style={{ marginRight: '8px' }}
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              disabled={tableSettings.currentPage >= Math.ceil(processedData.length / tableSettings.pageSize)}
              onClick={handleNextPage}
            />
          </div>

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
              <Button key="delete" danger type="primary" onClick={confirmDelete} loading={isDeleting}>
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