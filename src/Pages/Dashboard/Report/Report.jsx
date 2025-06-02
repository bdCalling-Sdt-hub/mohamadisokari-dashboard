import { DeleteOutlined, DownloadOutlined, EyeOutlined, FilterOutlined, LeftOutlined, ReloadOutlined, RightOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Dropdown, Input, Modal, Select, Table, Tag, Tooltip, message } from "antd";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../components/common/Spinner";
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
  } = useGetAllReportQuery(tableSettings.currentPage);

  const { data: particularReport, loading: particularReportLoading } = useGetPerticularReportQuery(selectedRecord?._id);

  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  // Format the API data for table use - FIXED to match your data structure
  const userData = useMemo(() => {
    if (!reportsData || !reportsData?.data?.reports) return [];

    return reportsData?.data?.reports.map(report => ({
      key: report._id,
      reportID: report.reportId,
      serviceProvider: report.sellerId?.name || "Unknown Provider",
      reportedBy: report.customerId?.name || "Unknown User",
      status: report.status || "pending",
      date: report.createdAt || report.updatedAt,
      priority: getPriorityFromType(report.type) || "Medium",
      description: report.reason || "",
      type: report.type || "",
      location: report.location || "",
      image: report.image || "",
      customerLocation: report.customerId?.location || "",
      sellerImage: report.sellerId?.image || "",
      customerImage: report.customerId?.image || "",
      ...report // Keep all original properties
    }));
  }, [reportsData]);

  // Helper function to determine priority based on report type
  function getPriorityFromType(type) {
    if (!type) return "Medium";

    const highPriorityTypes = ["fraud", "fake", "scam", "Product Not Received", "fanke"];
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
      currentPage: 1
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
      for (const key of selectedRowKeys) {
        await deleteReport(key).unwrap();
      }
      setSelectedRowKeys([]);
      setIsDeleteModalVisible(false);
      message.success(`${selectedRowKeys.length} report(s) deleted successfully`);
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
    try {
      await updateStatus({ id: reportId, status: newStatus }).unwrap();
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
    setTableSettings(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status === filterStatus ? null : status);
    setTableSettings(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    setTableSettings(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilterStatus(null);
    setSelectedMonth(null);
    setTableSettings(prev => ({ ...prev, currentPage: 1 }));
    refetch();
  };

  // CSV Export functionality - FIXED to match new data structure
  const handleExportCSV = () => {
    if (!reportsData?.data?.reports || reportsData.data.reports.length === 0) return;

    const headers = [
      'Report ID',
      'Service Provider',
      'Reported By',
      'Status',
      'Date',
      'Priority',
      'Type',
      'Description',
      'Location'
    ];

    const rows = reportsData.data.reports.map(item => {
      return [
        item.reportId || `R${item._id}`,
        item.sellerId?.name || "Unknown Provider",
        item.customerId?.name || "Unknown User",
        item.status || "pending",
        new Date(item.createdAt).toLocaleDateString(),
        getPriorityFromType(item.type) || "Medium",
        item.type || "",
        `"${item.reason || ""}"`, // Wrap in quotes to handle commas
        item.location || ""
      ].join(',');
    }).join('\n');

    const csv = `${headers.join(',')}\n${rows}`;

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
        (item.reportedBy && item.reportedBy.toLowerCase().includes(searchLower)) ||
        (item.type && item.type.toLowerCase().includes(searchLower)) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
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

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortState.order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return result;
  }, [userData, searchText, filterStatus, selectedMonth, sortState]);

  // Status change menu items - FIXED to match your status values
  const getStatusMenuItems = (record) => {
    const statusOptions = ['resolved', 'under review', 'pending', 'rejected'];
    return {
      items: statusOptions
        .filter(status => status !== record.status) // Don't show current status
        .map(status => ({
          key: status,
          label: status.charAt(0).toUpperCase() + status.slice(1),
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
      render: (text) => <span className="font-medium text-blue-600">{text}</span>,
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
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {record.sellerImage && (
            <img
              src={record.sellerImage}
              alt={text}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Reported By",
      dataIndex: "reportedBy",
      key: "reportedBy",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {record.customerImage && (
            <img
              src={record.customerImage}
              alt={text}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <div>{text}</div>
            {record.customerLocation && (
              <div className="text-xs text-gray-500">{record.customerLocation}</div>
            )}
          </div>
        </div>
      ),
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
            <Tag color={color} className="cursor-pointer capitalize">
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue" className="capitalize">
          {type}
        </Tag>
      ),
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
                {reportsData?.data?.meta?.total || processedData.length} {(reportsData?.data?.meta?.total || processedData.length) === 1 ? 'report' : 'reports'} found
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
                  disabled={!reportsData?.data?.reports || reportsData.data.reports.length === 0}
                >
                  Export
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-1 gap-3">
              <Input
                placeholder="Search by ID, provider, reporter, type..."
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
            scroll={{ x: 1200 }}
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
                : `1-${processedData.length} of ${processedData.length}`}
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
          {particularReportLoading ? (
            <Spinner />
          ) : (
            isModalOpen && (
              <DetailsModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                data={particularReport?.data}
                onStatusChange={(newStatus) => handleUpdateStatus(selectedRecord.key, newStatus)}
              />
            )
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