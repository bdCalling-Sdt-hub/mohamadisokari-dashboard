import React, { useState } from 'react';
import { Table, Progress, Card, Typography, Checkbox, Row, Col, Button, Modal, Pagination, ConfigProvider, Tooltip } from 'antd';
import { FaTrash, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './AppReview.css';

const { Title, Text } = Typography;

const App = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  
  // Sample data
  const starCounts = {
    5: 200,
    4: 150,
    3: 90,
    2: 30,
    1: 20
  };
  
  const totalReviews = 320;
  const averageRating = 4.5;
  
  // Generate sample reviews
  const generateReviews = (count) => {
    const reviewTexts = [
      'Great experience, easy to use!',
      'This app has been very helpful for my daily tasks.',
      'Good app but could use some improvements.',
      'I love the interface, very intuitive!',
      'Decent functionality but has some bugs.'
    ];
    
    const names = [
      'Alice Hales', 'Bob Smith', 'Carol Johnson', 'David Williams', 
      'Emma Brown', 'Frank Miller', 'Grace Davis', 'Henry Wilson'
    ];
    
    const dates = [
      '15 March 25', '14 March 25', '10 March 25', '5 March 25',
      '28 Feb 25', '21 Feb 25', '15 Feb 25', '10 Feb 25'
    ];
    
    return Array(count).fill().map((_, index) => ({
      key: index,
      name: names[index % names.length],
      rating: Math.floor(Math.random() * 5) + 1,
      review: reviewTexts[index % reviewTexts.length],
      date: dates[index % dates.length]
    }));
  };
  
  const allReviews = generateReviews(1000);
  
  // Custom star rating component
  const CustomStarRating = ({ value }) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half-filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />);
      }
    }
    
    return <div className="custom-star-rating">{stars}</div>;
  };

  // Get current page data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReviews = allReviews.slice(startIndex, endIndex);

  // Handle select all on current page
  const handleSelectAll = (e) => {
    const currentPageKeys = paginatedReviews.map(item => item.key);
    if (e.target.checked) {
      // Add all page items to selection (avoiding duplicates)
      setSelectedRowKeys([...new Set([...selectedRowKeys, ...currentPageKeys])]);
    } else {
      // Remove all page items from selection
      setSelectedRowKeys(selectedRowKeys.filter(key => !currentPageKeys.includes(key)));
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (e, record) => {
    if (e.target.checked) {
      setSelectedRowKeys([...selectedRowKeys, record.key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
    }
  };

  // Check if all items on current page are selected
  const isAllSelected = paginatedReviews.length > 0 && 
    paginatedReviews.every(item => selectedRowKeys.includes(item.key));

  // Check if some items on current page are selected
  const isIndeterminate = paginatedReviews.some(item => selectedRowKeys.includes(item.key)) && 
    !isAllSelected;

  const handleDeleteClick = (record) => {
    setDeleteItemId(record.key);
    setIsDeleteModalVisible(true);
  };

  const handleBulkDelete = () => {
    console.log('Deleting selected items:', selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting item:', deleteItemId);
    setIsDeleteModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteItemId(null);
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
        />
      ),
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.key)} 
          onChange={(e) => handleCheckboxChange(e, record)}
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <CustomStarRating value={rating} />
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Delete Review"><FaTrash 
          className="delete-icon" 
          onClick={() => handleDeleteClick(record)} 
        /></Tooltip> 
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
      <div style={{ padding: '20px', margin: '0 auto' }}>
        <Card style={{ marginBottom: '24px' }}>
          <Row align="middle" gutter={[24, 0]}>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div className="rating-circle">
                  <Text strong style={{ fontSize: '20px', color: 'white' }}>{averageRating}</Text>
                </div>
                <div>
                  <div className='w-full m-2 mx-auto text-center'>
                    <CustomStarRating value={averageRating} />
                  </div>
                  <div>{totalReviews} reviews</div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={18}>
              {[5, 4, 3, 2, 1].map(stars => (
                <Row key={stars} align="middle" style={{ margin: '8px 0' }}>
                  <Col span={3}>
                    <Text>{stars} stars</Text>
                  </Col>
                  <Col span={18}>
                    <Progress 
                      percent={(starCounts[stars] / totalReviews) * 100} 
                      showInfo={false}
                      strokeColor="#ff9800"
                      trailColor="#f0f0f0"
                      strokeWidth={12}
                    />
                  </Col>
                  <Col span={3} style={{ paddingLeft: '12px' }}>
                    <Text>{starCounts[stars]}</Text>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Card>

        <Title level={4} style={{ margin: '24px 0 16px 0' }}>App Reviews</Title>
        
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              danger 
              onClick={handleBulkDelete}
              icon={<FaTrash />}
            >
              Bulk Delete ({selectedRowKeys.length})
            </Button>
          </div>
        )}
        
        <Table 
          columns={columns} 
          dataSource={paginatedReviews}
          pagination={false}
          rowKey="key"
        />
        
        <Row justify="space-between" align="middle" style={{ marginTop: '16px' }}>
          <Col>
            {selectedRowKeys.length > 0 && (
              <Text>{selectedRowKeys.length} item(s) selected</Text>
            )}
          </Col>
          <Col>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={allReviews.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </Col>
        </Row>

        <Modal
          title="Confirm Delete"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Delete"
          cancelText="Cancel"
          centered
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this review?</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default App;