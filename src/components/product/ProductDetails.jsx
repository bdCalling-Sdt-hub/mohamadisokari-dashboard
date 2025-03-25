import React from 'react';
import { Card, Row, Col, Typography, Tag, Space, Avatar, Divider, Badge } from 'antd';
import { FaHeart, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const { Title, Text, Paragraph } = Typography;

const MarketplaceListing = () => {
  return (
    <Card>
      <Row gutter={[24, 24]}>
        {/* Product Image Section */}
        <Col style={{ maxWidth: 400}} xs={24} md={12}>
          <div style={{ position: 'relative' }}>
            <img 
              src="https://i.ibb.co.com/qfZfZyn/2432ead54ddc4dde16b04ac2b970331e.png" 
              alt="MacBook Pro" 
              style={{ width: '100%', borderRadius: 8 }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              padding: '10px', 
              background: '#ff8c00', 
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaHeart /> <span style={{ marginLeft: 8 }}>20 People liked</span>
            </div>
          </div>
          
          <div style={{ marginTop: 12 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4} style={{ margin: 0 }}>MacBook Pro</Title>
                <Text type="secondary">Electronics</Text>
              </Col>
              <Col>
                <Title level={3} style={{ color: '#ff8c00', margin: 0 }}>$450</Title>
              </Col>
            </Row>
            <Text type="secondary">Posted 10 days ago</Text>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Product Status</Title>
            <Space>
              <Badge status="error" />
              <Text>Sold (20 March 25)</Text>
            </Space>
          </div>
        </Col>
        
        {/* Product Details Section */}
        <Col xs={24} md={12}>
          <div>
            <Title level={5}>Description</Title>
            <Paragraph>
              Get a 2nd hand MacBook Pro in excellent condition, featuring powerful performance, sleek
              design, and reliable battery life <Text strong>See all</Text>
              <br />
              Ideal for professionals, students, and creatives. Available at a budget-friendly price!
            </Paragraph>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Product Condition</Title>
            <Text>Used but Good Conditions</Text>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Additional Info</Title>
            <Text>
              I used it very lightly. No internal & external Problem in this laptop.
            </Text>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Location</Title>
            <Text>Mogadishu</Text>
          </div>
          
          <Divider />
          
          {/* Seller Information */}
          <div>
            <Title level={5}>Seller Information</Title>
            <Card bordered={false} style={{ padding: 0 }}>
              <Space>
                <Avatar size={40}>MA</Avatar>
                <div>
                  <Text strong>Mohammad Abudullah</Text>
                  <div>
                    <Space direction="vertical" size={4}>
                      <Space>
                        <FaMapMarkerAlt /> <Text>Xamar Wayne Street</Text>
                      </Space>
                      <Space>
                        <FaPhone /> <Text>+252 61 234 5678</Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
          
          {/* Buyer Information */}
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Buyer Information</Title>
            <Card bordered={false} style={{ padding: 0 }}>
              <Space>
                <Avatar size={40}>AA</Avatar>
                <div>
                  <Text strong>Asim Abudullah</Text>
                  <div>
                    <Space direction="vertical" size={4}>
                      <Space>
                        <FaMapMarkerAlt /> <Text>Xamar Wayne Street</Text>
                      </Space>
                      <Space>
                        <FaPhone /> <Text>+252 61 234 5678</Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MarketplaceListing;