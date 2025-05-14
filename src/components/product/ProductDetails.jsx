import { Avatar, Badge, Button, Card, Col, Divider, Row, Space, Spin, Typography } from 'antd';
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetParticularProductQuery } from '../../features/ProductManagement/ProductManagementApi';
import { baseURL } from '../../utils/BaseURL';

const { Title, Text, Paragraph } = Typography;

const MarketplaceListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetParticularProductQuery(id);
  const product = data?.data;

  const handleGoBack = () => {
    navigate(-1);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  if (isLoading) return <div className='flex justify-center items-center h-[400px]'><Spin size='default' /></div>;
  if (isError) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Button
        icon={<FaArrowLeft />}
        onClick={handleGoBack}
        style={{
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          border: '1px solid #d9d9d9'
        }}
      >
        <span style={{ marginLeft: 8 }}>Back</span>
      </Button>

      <Card>
        <Row style={{ width: "1200px" }} gutter={[24, 24]}>
          {/* Left Column - Product Image and Basic Info */}
          <Col xs={24} md={12}>
            <div style={{ position: 'relative', maxWidth: '100%' }}>
              <img
                src={
                  product?.images?.length
                    ? `${baseURL}${product.images[0]}`
                    : "https://i.ibb.co.com/qfZfZyn/2432ead54ddc4dde16b04ac2b970331e.png"
                }
                alt={product?.title}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  height: 300,
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                background: 'rgba(255, 140, 0, 0.8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaHeart style={{ marginRight: 8 }} />
                <Text style={{ color: 'white' }}>
                  {product?.liked || 0} {product?.liked === 1 ? 'Person likes' : 'People like'} this
                </Text>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ margin: 0 }}>{product?.title}</Title>
                  <Text type="secondary">{product?.category}</Text>
                </Col>
                <Col>
                  <Title level={3} style={{ color: '#ff8c00', margin: 0 }}>
                    ${product?.price?.toLocaleString()}
                  </Title>
                </Col>
              </Row>

              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Posted on {new Date(product?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Product Status</Title>
              <Space>
                <Badge
                  status={product?.status === 'available' ? 'success' : 'error'}
                />
                <Text>
                  {product?.status === 'available'
                    ? 'Available for purchase'
                    : `Sold on ${new Date(product?.updatedAt).toLocaleDateString()}`
                  }
                </Text>
              </Space>
            </div>
          </Col>

          {/* Right Column - Product Details */}
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>Description</Title>
              <Paragraph>
                {product?.description}
                {product?.description?.length > 200 && (
                  <Text strong style={{ marginLeft: 8, cursor: 'pointer' }}>Read more</Text>
                )}
              </Paragraph>
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Product Condition</Title>
              <Text>{product?.condition || 'Not specified'}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Additional Information</Title>
              <Text>
                {product?.additionalInfo || 'No additional information provided'}
              </Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Location</Title>
              <Space>
                <FaMapMarkerAlt />
                <Text>{product?.location}</Text>
              </Space>
            </div>

            <Divider />

            {/* Seller Information */}
            <div>
              <Title level={5}>Seller Information</Title>
              <Card bordered={false} style={{ padding: 0, marginTop: 8 }}>
                <Space size="middle">
                  <Avatar size={48} style={{ backgroundColor: '#ff8c00' }}>
                    {getInitials(product?.sellerId?.name)}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {product?.sellerId?.name}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Space direction="vertical" size={4}>
                        <Space>
                          <FaMapMarkerAlt style={{ color: '#888' }} />
                          <Text type="secondary">{product?.sellerId?.location}</Text>
                        </Space>
                        <Space>
                          <FaPhone style={{ color: '#888' }} />
                          <Text type="secondary">{product?.sellerId?.contactNumber}</Text>
                        </Space>
                        {product?.sellerId?.email && (
                          <Space>
                            <span style={{ color: '#888', width: 16 }}>@</span>
                            <Text type="secondary">{product.sellerId.email}</Text>
                          </Space>
                        )}
                      </Space>
                    </div>
                  </div>
                </Space>
              </Card>
            </div>

            {/* Buyer Information (Conditional) */}
            {product?.buyerId && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>Buyer Information</Title>
                <Card bordered={false} style={{ padding: 0, marginTop: 8 }}>
                  <Space size="middle">
                    <Avatar size={48} style={{ backgroundColor: '#1890ff' }}>
                      {getInitials(product.buyerId.name)}
                    </Avatar>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        {product.buyerId.name}
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        <Space direction="vertical" size={4}>
                          <Space>
                            <FaMapMarkerAlt style={{ color: '#888' }} />
                            <Text type="secondary">{product.buyerId.location}</Text>
                          </Space>
                          <Space>
                            <FaPhone style={{ color: '#888' }} />
                            <Text type="secondary">{product.buyerId.contactNumber}</Text>
                          </Space>
                          {product.buyerId.email && (
                            <Space>
                              <span style={{ color: '#888', width: 16 }}>@</span>
                              <Text type="secondary">{product.buyerId.email}</Text>
                            </Space>
                          )}
                        </Space>
                      </div>
                    </div>
                  </Space>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MarketplaceListing;