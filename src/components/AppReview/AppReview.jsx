import { Button, Card, Checkbox, Col, ConfigProvider, Modal, Progress, Row, Select, Spin, Table, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaRegStar, FaStar, FaStarHalfAlt, FaTrash } from 'react-icons/fa';
import { useDeleteReviewMutation, useGetReviewAnalysisQuery, useGetReviewQuery } from '../../features/AppReview/AppReviewApi';
import './AppReview.css';

const { Title, Text } = Typography;

const App = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // API hooks
  const { data: reviewAnalysis, isLoading: isReviewAnalysisLoading } = useGetReviewAnalysisQuery();
  const { data: reviewData, isLoading: isReviewLoading, refetch } = useGetReviewQuery({
    page: currentPage,
    limit: pageSize
  });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Extract data from API responses
  const reviews = reviewData?.data || [];
  const pagination = reviewData?.pagination || {};
  const analysisData = reviewAnalysis?.data || {};

  // Calculate star counts from rating distribution
  const starCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  if (analysisData.ratingDistribution) {
    analysisData.ratingDistribution.forEach(item => {
      const roundedRating = Math.round(item.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        starCounts[roundedRating] += item.count;
      }
    });
  }

  const totalReviews = analysisData.reviewCount || 0;
  const averageRating = parseFloat(analysisData.averageRating) || 0;

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
    if (currentPage < (pagination.totalPage || 1)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle select all on current page
  const handleSelectAll = (e) => {
    const currentPageKeys = reviews.map(item => item._id);
    if (e.target.checked) {
      setSelectedRowKeys([...new Set([...selectedRowKeys, ...currentPageKeys])]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(key => !currentPageKeys.includes(key)));
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (e, record) => {
    if (e.target.checked) {
      setSelectedRowKeys([...selectedRowKeys, record._id]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== record._id));
    }
  };

  // Check if all items on current page are selected
  const isAllSelected = reviews.length > 0 &&
    reviews.every(item => selectedRowKeys.includes(item._id));

  // Check if some items on current page are selected
  const isIndeterminate = reviews.some(item => selectedRowKeys.includes(item._id)) &&
    !isAllSelected;

  const handleDeleteClick = (record) => {
    setDeleteItemId(record._id);
    setIsDeleteModalVisible(true);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map(id => deleteReview(id).unwrap()));
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error deleting reviews:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(deleteItemId).unwrap();
      setIsDeleteModalVisible(false);
      setDeleteItemId(null);
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
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
          checked={selectedRowKeys.includes(record._id)}
          onChange={(e) => handleCheckboxChange(e, record)}
        />
      )
    },
    {
      title: 'Customer ID',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      align: 'start',
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CustomStarRating value={rating} />
        </div>
      )
    },
    {
      title: 'Review',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Delete Review">
          <FaTrash
            className="delete-icon"
            onClick={() => handleDeleteClick(record)}
          />
        </Tooltip>
      ),
    },
  ];

  if (isReviewAnalysisLoading || isReviewLoading) {
    return <div className="flex items-center justify-center h-[400px]"><Spin size="default" /></div>;
  }

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
                  <Text strong style={{ fontSize: '20px', color: 'white' }}>{averageRating.toFixed(1)}</Text>
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
                      percent={totalReviews > 0 ? (starCounts[stars] / totalReviews) * 100 : 0}
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
              loading={isDeleting}
            >
              Bulk Delete ({selectedRowKeys.length})
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={reviews}
          pagination={false}
          rowKey="_id"
          loading={isReviewLoading}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          marginTop: '16px',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {selectedRowKeys.length > 0 && (
              <Text style={{ marginRight: '16px' }}>{selectedRowKeys.length} item(s) selected</Text>
            )}
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ margin: '0 16px' }}>
              {pagination.total === 0
                ? '0-0 of 0'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, pagination.total)} of ${pagination.total}`}
            </span>
            <Button
              type="text"
              icon={<FaAngleLeft />}
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              style={{ marginRight: '8px' }}
            />
            <Button
              type="text"
              icon={<FaAngleRight />}
              disabled={currentPage >= (pagination.totalPage || 1)}
              onClick={handleNextPage}
            />
          </div>
        </div>

        <Modal
          title="Confirm Delete"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Delete"
          cancelText="Cancel"
          centered
          okButtonProps={{ danger: true, loading: isDeleting }}
        >
          <p>Are you sure you want to delete this review?</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default App;