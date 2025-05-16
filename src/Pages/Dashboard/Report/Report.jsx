import { DeleteOutlined, DownloadOutlined, EyeOutlined, FilterOutlined, LeftOutlined, ReloadOutlined, RightOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Dropdown, Input, Modal, Select, Table, Tag, Tooltip, message } from "antd";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteReportMutation, useGetAllReportQuery, useGetPerticularReportQuery, useUpdateStatusMutation } from "../../../features/Report/ReportApi";
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
    data: reportsData = {},
    isLoading,
    refetch
  } = useGetAllReportQuery(tableSettings.currentPage); // Pass current page to API

  const { data: particularReport, loading: particularReportLoading } = useGetPerticularReportQuery(selectedRecord?._id);

  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  // Format the API data for table use
  const userData = useMemo(() => {
    if (!reportsData || !reportsData?.data?.reports) return [];

    return reportsData?.data?.reports.map(report => ({
      key: report._id || report.id,
      reportID: report.reportId || `R${report._id}`,
      serviceProvider: report.sellerId || "Unknown Provider",
      reportedBy: report.customerId || "Unknown User",
      status: report.status || "Pending",
      date: report.date || report.createdAt,
      priority: getPriorityFromType(report.type) || "Medium",
      description: report.reason || "",
      type: report.type || "",
      location: report.location || "",
      image: report.image || "",
      ...report // Keep all original properties
    }));
  }, [reportsData]);

  // Helper function to determine priority based on report type
  function getPriorityFromType(type) {
    if (!type) return "Medium";

    const highPriorityTypes = ["fraud", "fake", "scam", "Product Not Received"];
    const lowPriorityTypes = ["other", "question", "feedback"];

    if (highPriorityTypes.some(t => type.toLowerCase().includes(t.toLowerCase()))) {
      return "High";
    } else if (lowPriorityTypes.some(t => type.toLowerCase().includes(t.toLowerCase()))) {
      return "Low";
    }

    return "Medium";
  }

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
    const totalPages = reportsData?.data?.meta?.totalPage || 1;
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
      // Show success message
      message.success(`${selectedRowKeys.length} report(s) deleted successfully`);
      // Refresh the data
      refetch();
    } catch (error) {
      console.error("Error deleting reports:", error);
      message.error("Failed to delete reports. Please try again.");
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    console.log(newStatus);

    try {
      await updateStatus({ id: reportId, status: newStatus },).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    }
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
    if (!reportsData?.data?.reports || reportsData.data.reports.length === 0) return;

    // Create CSV header
    const headers = columns
      .filter(col => col.key !== 'action') // Exclude action column
      .map(col => col.dataIndex)
      .join(',');

    // Create CSV rows
    const rows = reportsData.data.reports.map(item => {
      const formattedItem = {
        key: item._id || item.id,
        reportID: item.reportId || `R${item._id}`,
        serviceProvider: item.sellerId || "Unknown Provider",
        reportedBy: item.customerId || "Unknown User",
        status: item.status || "Pending",
        date: item.date || item.createdAt,
        priority: getPriorityFromType(item.type) || "Medium",
        description: item.reason || "",
        type: item.type || "",
        location: item.location || "",
        image: item.image || "",
      };

      return columns
        .filter(col => col.key !== 'action') // Exclude action column
        .map(col => {
          const value = formattedItem[col.dataIndex];

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
      result = result.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());
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

  // Status change menu items
  const getStatusMenuItems = (record) => {
    const statusOptions = ['resolved'];
    return {
      items: statusOptions.map(status => ({
        key: status,
        label: status,
        disabled: record.status === status,
        onClick: () => handleUpdateStatus(record.key, status)
      }))
    };
  };

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
                  onClick: () => handleFilterStatus('resolved')
                },
                {
                  key: 'under-review',
                  label: 'Under Review',
                  onClick: () => handleFilterStatus('under review')
                },
                {
                  key: 'pending',
                  label: 'Pending',
                  onClick: () => handleFilterStatus('pending')
                },
                {
                  key: 'rejected',
                  label: 'Rejected',
                  onClick: () => handleFilterStatus('rejected')
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
      render: (status, record) => {
        let color = 'default';
        if (status.toLowerCase() === 'resolved') color = 'success';
        else if (status.toLowerCase() === 'under review') color = 'processing';
        else if (status.toLowerCase() === 'pending') color = 'warning';
        else if (status.toLowerCase() === 'rejected') color = 'error';

        return (
          <Dropdown menu={getStatusMenuItems(record)} trigger={['click']}>
            <Tag color={color} className="cursor-pointer">
              {status}
            </Tag>
          </Dropdown>
        );
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
                {reportsData?.data?.meta?.total || 0} {reportsData?.data?.meta?.total === 1 ? 'report' : 'reports'} found
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
            dataSource={processedData}
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
              {reportsData?.data?.meta
                ? `${(tableSettings.currentPage - 1) * reportsData.data.meta.limit + 1}-${Math.min(tableSettings.currentPage * reportsData.data.meta.limit, reportsData.data.meta.total)} of ${reportsData.data.meta.total}`
                : '0-0 of 0'}
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
              disabled={tableSettings.currentPage >= (reportsData?.data?.meta?.totalPage || 1)}
              onClick={handleNextPage}
            />
          </div>

          {/* View Details Modal */}
          {particularReportLoading ? <div>Loading...</div> : isModalOpen && (
            <DetailsModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              data={particularReport?.data}
              onStatusChange={(newStatus) => handleUpdateStatus(selectedRecord.key, newStatus)}
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