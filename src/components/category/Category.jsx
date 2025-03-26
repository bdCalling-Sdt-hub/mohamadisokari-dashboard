import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Image, Upload, ConfigProvider, Alert, Select } from 'antd';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { CloseCircleOutlined, CloudUploadOutlined, ExclamationCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

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

  const [data, setData] = useState([
    {
      key: '1',
      name: 'Electronics',
      icon: 'https://cdn-icons-png.flaticon.com/512/2777/2777154.png',
      totalProducts: 15,
    },
    {
      key: '2',
      name: 'Clothing',
      icon: 'https://cdn-icons-png.flaticon.com/512/863/863684.png',
      totalProducts: 15,
    },
    {
      key: '3',
      name: 'Furniture',
      icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040993.png',
      totalProducts: 15,
    },
    {
      key: '4',
      name: 'Books',
      icon: 'https://cdn-icons-png.flaticon.com/512/2436/2436882.png',
      totalProducts: 15,
    },
    {
      key: '5',
      name: 'Motor',
      icon: 'https://cdn-icons-png.flaticon.com/512/2061/2061870.png',
      totalProducts: 15,
    },
    {
      key: '6',
      name: 'Home Appliances',
      icon: 'https://cdn-icons-png.flaticon.com/512/2289/2289946.png',
      totalProducts: 15,
    },
    {
      key: '7',
      name: 'Health & Beauty',
      icon: 'https://cdn-icons-png.flaticon.com/512/3588/3588295.png',
      totalProducts: 15,
    },
    {
      key: '8',
      name: 'Art',
      icon: 'https://cdn-icons-png.flaticon.com/512/2950/2950154.png',
      totalProducts: 15,
    },
    {
      key: '9',
      name: 'Jewelry & Watches',
      icon: 'https://cdn-icons-png.flaticon.com/512/3109/3109867.png',
      totalProducts: 15,
    },
    {
      key: '10',
      name: 'Sports',
      icon: 'https://cdn-icons-png.flaticon.com/512/857/857455.png',
      totalProducts: 15,
    },
    {
      key: '11',
      name: 'Toys',
      icon: 'https://cdn-icons-png.flaticon.com/512/2753/2753541.png',
      totalProducts: 15,
    },
    {
      key: '12',
      name: 'Food',
      icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      totalProducts: 15,
    },
  ]);

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
    setUploadedImage(record.icon);
    form.setFieldsValue({
      name: record.name,
      icon: record.icon,
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
    setDeleteKey(null);
    setIsModalVisible(true);
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      setUploadedImage(info.file.response?.url || 'https://cdn-icons-png.flaticon.com/512/1170/1170577.png');
    }
  };

  // Mock function for image upload
  const customRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess({ url: 'https://cdn-icons-png.flaticon.com/512/1170/1170577.png' });
    }, 500);
  };

  // Handle form submission
  const handleFormSubmit = (values) => {
    const finalIcon = uploadedImage || values.icon || 'https://cdn-icons-png.flaticon.com/512/1170/1170577.png';
    
    if (isEditing) {
      // Update existing category
      const newData = [...data];
      const index = newData.findIndex(item => item.key === editingKey);
      
      if (index > -1) {
        newData[index] = {
          ...newData[index],
          name: values.name,
          icon: finalIcon,
        };
        setData(newData);
      }
    } else {
      // Add new category
      const newData = [...data];
      newData.push({
        key: `${newData.length + 1}`,
        name: values.name,
        icon: finalIcon,
        totalProducts: 0,
      });
      setData(newData);
    }
    
    setIsEditModalVisible(false);
    form.resetFields();
    setUploadedImage(null);
  };

  // Handle modal cancel for edit/add modal
  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setUploadedImage(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteKey) {
      // Single item deletion
      const newData = data.filter(item => item.key !== deleteKey);
      setData(newData);
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== deleteKey));
    } else if (selectedRowKeys.length > 0) {
      // Bulk deletion
      const newData = data.filter(item => !selectedRowKeys.includes(item.key));
      setData(newData);
      setSelectedRowKeys([]);
    }
    
    setIsModalVisible(false);
    setDeleteKey(null);
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
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: icon => <Image src={icon} alt="icon" width={40} height={40} />,
    },
    {
      title: 'Total Products',
      dataIndex: 'totalProducts',
      key: 'totalProducts',
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
      >
        <FaTrash style={{ marginRight: '8px' }} />
        Delete {selectedRowKeys.length} Selected
      </Button>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <div className='w-9/12'>
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
            
            <Form.Item label="Category Icon">
              {uploadedImage ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Image src={uploadedImage} alt="Uploaded" width={100} />
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
                <Form.Item
                  name="icon"
                  noStyle
                >
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={customRequest}
                    onChange={handleImageUpload}
                  >
                    <div style={{ padding: '10px' }}>
                      <CloudUploadOutlined style={{ fontSize: 24 }} />
                      <div>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              )}
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button 
                type="default"
                onClick={handleEditModalCancel}
                style={{ marginRight: '10px' }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ backgroundColor: '#ff6600', borderColor: '#ff6600' }}
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