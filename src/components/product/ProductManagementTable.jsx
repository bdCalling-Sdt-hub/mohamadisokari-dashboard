import { DeleteOutlined, EyeOutlined, LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Input, Modal, Row, Select, Space, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteMultipleProductMutation,
  useDeleteProductMutation,
  useGetAllProductQuery,
} from '../../features/ProductManagement/ProductManagementApi';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

function ProductManagementTable() {
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const router = useNavigate();

  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: '',
  });

  // Prepare query params object
  const queryParams = {
    searchTerm: searchText,
    category: filters.category,
    location: filters.location,
    status: filters.status, // Send status as-is to match API expectations
    page: currentPage
  };

  // Fetch data from API with all filters and pagination
  const { data: productsResponse, isLoading, refetch } = useGetAllProductQuery(queryParams);

  // Delete mutations
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deleteMultipleProduct, { isLoading: isDeletingMultiple }] = useDeleteMultipleProductMutation();

  // Extract data from API response
  const productData = productsResponse?.data || [];
  const totalItems = productsResponse?.pagination?.total || 0;
  const totalPages = productsResponse?.pagination?.totalPage || 1;

  // Format data for table
  const formattedData = productData.map((product) => ({
    key: product._id,
    listingDate: new Date(product.createdAt).toLocaleDateString(),
    productTitle: product.title,
    category: product.category,
    seller: product.sellerId, // You may need to adjust this if your API returns seller info differently
    location: product.location,
    price: `${product.price}`,
    status: product.status === 'available' ? 'Available' : 'Sold',
    soldDate: product.status === 'sold' ? new Date(product.updatedAt).toLocaleDateString() : null,
    rawStatus: product.status, // Store the original status value from API
  }));

  // Get unique filter options from API data
  const categoryOptions = [...new Set(productData.map(item => item.category))];
  const locationOptions = [...new Set(productData.map(item => item.location))];
  const statusOptions = ['available', 'sold']; // Match exactly with API values

  // Filter change handlers
  const handleFilterChange = (value, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value || ''
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, refetch]);

  // Refetch data when filters or page changes
  useEffect(() => {
    refetch();
  }, [filters, currentPage, refetch]);

  // Pagination handlers
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
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
    router(`/product-details/${id}`);
  };

  // Delete functions
  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      content: `Product: ${record.productTitle}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk() {
        handleDelete(record.key);
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
        handleBulkDelete(selectedRowKeys);
      },
    });
  };

  // Single product delete
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      Modal.error({
        title: 'Delete Failed',
        content: 'Failed to delete the product. Please try again.',
      });
    }
  };

  // Multiple product delete
  const handleBulkDelete = async (ids) => {
    console.log(ids)
    try {
      const response = await deleteMultipleProduct({ productIds: ids }).unwrap();
      console.log(response)
      setSelectedRowKeys([]);
      refetch();
    } catch (error) {
      console.error('Error deleting multiple products:', error);
      Modal.error({
        title: 'Bulk Delete Failed',
        content: 'Failed to delete the selected products. Please try again.',
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Listing Date',
      dataIndex: 'listingDate',
      key: 'listingDate',
      sorter: (a, b) => {
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
      sorter: (a, b) => String(a.seller).localeCompare(String(b.seller)),
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
            loading={isDeleting}
          />
        </Space>
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
      <div className="p-4 bg-white rounded-lg mt-10">
        <Title level={3}>Product Management</Title>

        <div className="mb-5 filters">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6} lg={5}>
              <Select
                placeholder="Category"
                style={{ width: '100%' }}
                allowClear
                onChange={(value) => handleFilterChange(value, 'category')}
                value={filters.category || undefined}
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
                value={filters.location || undefined}
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
                value={filters.status || undefined}
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
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                allowClear
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
              loading={isDeletingMultiple}
            >
              Bulk Delete ({selectedRowKeys.length})
            </Button>
          </div>
        )}

        <div className="table-container">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={formattedData}
            loading={isLoading || isDeleting || isDeletingMultiple}
            pagination={false}
            size="middle"
          />

          <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', alignItems: 'center' }}>
            <Select
              value={pageSize.toString()}
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
              disabled={currentPage >= totalPages}
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default ProductManagementTable;