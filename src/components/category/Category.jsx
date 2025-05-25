import { CloseCircleOutlined, CloudUploadOutlined, ExclamationCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Image, Input, message, Modal, Select, Space, Spin, Table, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoryQuery, useUpdateCategoryMutation } from '../../features/category/CategoryApi';
import { baseURL } from '../../utils/BaseURL';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [deleteKey, setDeleteKey] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query hooks
  const { data: categories, isLoading: isCategoryLoading, refetch } = useGetCategoryQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  // Transform API data to match table format
  const [data, setData] = useState([]);

  useEffect(() => {
  if (categories) {
    const formattedData = categories?.data?.map((category) => ({
      key: category._id,
      name: category.name,
      image: category.image,
      totalProducts: category.countCat || 0, // Changed from countCat to totalProducts
      originalData: category
    }));
    setData(formattedData);
  }
}, [categories]);

  // Function to show modal for adding new category
  const showAddModal = () => {
    setIsEditing(false);
    setUploadedImage(null);
    form.resetFields();
    setIsEditModalVisible(true);
  };

  // Function to show modal for editing category
  const showEditModal = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    setUploadedImage(record.image);
    form.setFieldsValue({
      name: record.name,
      image: record.image,
    });
    setIsEditModalVisible(true);
  };

  // Show delete confirmation modal
  const showDeleteConfirmModal = (key) => {
    setDeleteKey(key);
    setIsModalVisible(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setDeleteKey(null);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));

      if (uploadedImage instanceof File) {
        formData.append('image', uploadedImage);
      }

      if (isEditing) {
        // Updated API call structure to match the fixed API
        await updateCategory({
          id: editingKey,
          data: formData
        }).unwrap();
        toast.success('Category updated successfully');
        refetch();
      } else {
        await createCategory(formData).unwrap();
        toast.success('Category created successfully');
      }

      refetch();
      setIsEditModalVisible(false);
      form.resetFields();
      setUploadedImage(null);
    } catch (err) {
      message.error(err.data?.message || 'Something went wrong');
    }
  };

  // Handle modal cancel for edit/add modal
  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setUploadedImage(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      if (deleteKey) {
        await deleteCategory(deleteKey).unwrap();
        message.success('Category deleted successfully');
      } else if (selectedRowKeys.length > 0) {
        for (const key of selectedRowKeys) {
          await deleteCategory(key).unwrap();
        }
        message.success(`${selectedRowKeys.length} categories deleted successfully`);
      }

      refetch();
      setIsModalVisible(false);
      setDeleteKey(null);
      setSelectedRowKeys([]);
    } catch (err) {
      message.error(err.data?.message || 'Failed to delete category');
    }
  };

  // Handle delete modal cancel
  const handleDeleteModalCancel = () => {
    setIsModalVisible(false);
    setDeleteKey(null);
  };

  // Handle row selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      setUploadedImage(info.file.originFileObj);
    }
  };

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // Table columns
  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          src={`${baseURL}${image}`}
          alt="category"
          width={40}
          height={40}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
        {
        title: 'Total Products',
        dataIndex: 'totalProducts',
        key: 'totalProducts',
        render: (countCat) => <span className='flex items-center ml-10'>{countCat}</span>,
      },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FaEdit style={{ color: '#1890ff' }} />}
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            icon={<FaTrash style={{ color: '#ff4d4f' }} />}
            onClick={() => showDeleteConfirmModal(record.key)}
          />
        </Space>
      ),
    },
  ];

  // Bulk delete button
  const BulkDeleteButton = () => {
    if (selectedRowKeys.length === 0) return null;

    return (
      <Button
        type="primary"
        danger
        onClick={handleBulkDelete}
        style={{ marginLeft: '10px' }}
        loading={isDeleting}
      >
        <FaTrash style={{ marginRight: '8px' }} />
        Delete {selectedRowKeys.length} Selected
      </Button>
    );
  };

  if (isCategoryLoading) {
    return <div className='flex items-center justify-center h-[400px]'><Spin size="default" /></div>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <div className=''>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h2>Category List</h2>
          <div>
            <Button
              type="primary"
              style={{ backgroundColor: '#ff6600', borderColor: '#ff6600' }}
              onClick={showAddModal}
              loading={isCreating}
            >
              <FaPlus style={{ marginRight: '8px' }} /> Add Category
            </Button>
            <BulkDeleteButton />
          </div>
        </div>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          columns={columns}
          dataSource={getPaginatedData()}
          pagination={false}
          loading={isCategoryLoading}
        />

        {/* Custom Pagination */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center' }}>
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
              {data.length === 0
                ? '0-0 of 0'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, data.length)} of ${data.length}`}
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
              disabled={currentPage >= Math.ceil(data.length / pageSize)}
              onClick={handleNextPage}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title={deleteKey ? "Delete Category" : "Delete Selected Categories"}
          open={isModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteModalCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
          centered
          confirmLoading={isDeleting}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <ExclamationCircleOutlined
              style={{
                color: '#faad14',
                fontSize: '24px',
                marginRight: '16px'
              }}
            />
            {deleteKey
              ? "Are you sure you want to delete this category?"
              : `Are you sure you want to delete ${selectedRowKeys.length} selected categories?`}
          </div>
          <p style={{ marginLeft: '40px', color: '#8c8c8c' }}>
            This action cannot be undone and will remove the selected categor{deleteKey ? "y" : "ies"} permanently.
          </p>
        </Modal>

        {/* Edit/Add Category Modal */}
        <Modal
          title={isEditing ? "Edit Category" : "Add Category"}
          open={isEditModalVisible}
          onCancel={handleEditModalCancel}
          footer={null}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter category name" }]}
            >
              <Input
                placeholder="Enter Category Name"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item label="Category Image">
              {uploadedImage ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Image
                    src={uploadedImage instanceof File
                      ? URL.createObjectURL(uploadedImage)
                      : `${baseURL}${uploadedImage}`}
                    alt="Uploaded"
                    width={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <CloseCircleOutlined
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      fontSize: '16px',
                      background: 'white',
                      borderRadius: '50%'
                    }}
                    onClick={() => setUploadedImage(null)}
                  />
                </div>
              ) : (
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    setUploadedImage(file);
                    return false;
                  }}
                  accept="image/*"
                >
                  <div style={{ padding: '10px' }}>
                    <CloudUploadOutlined style={{ fontSize: 24 }} />
                    <div>Upload</div>
                  </div>
                </Upload>
              )}
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button
                type="default"
                onClick={handleEditModalCancel}
                style={{ marginRight: '10px' }}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#ff6600', borderColor: '#ff6600' }}
                loading={isCreating || isUpdating}
              >
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default CategoryList;