import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import Imformation from './Imformation';
import SalesHistory from './SalesHistory';
import BuyingHistory from './BuyingHistory';

const { Sider, Content } = Layout;

const UserDetails = () => {
  const [activeMenu, setActiveMenu] = useState('profile');

  const handleMenuClick = (key) => {
    setActiveMenu(key);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return <Imformation />;
      case 'sales':
        return <SalesHistory />;
      case 'buying':
        return <BuyingHistory />;
      default:
        return <Imformation />;
    }
  };

  return (
    <div className="">
      <Layout className="p-6 overflow-hidden bg-white rounded-lg shadow-md ">
        <Sider 
          width={250} 
          style={{ backgroundColor: '#ffffff', borderRight: '1px solid #ddd' }}
          className="p-6"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 mb-3 overflow-hidden rounded-full">
              <img 
                src="https://i.ibb.co.com/qfZfZyn/2432ead54ddc4dde16b04ac2b970331e.png" 
                alt="Amina Ali" 
                className="object-cover w-full h-full"
              />
            </div>
            <Typography.Title level={4} className="mb-1">Amina Ali</Typography.Title>
            <Typography.Text type="secondary">Member Since March 2025</Typography.Text>
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            onClick={({ key }) => handleMenuClick(key)}
            style={{ border: 'none' }}
            theme="light"
          >
            <Menu.Item 
              key="profile" 
              icon={<UserOutlined />}
              className={`${activeMenu === 'profile' ? 'ant-menu-item-selected' : ''}`}
            >
              <span className={activeMenu === 'profile' ? 'text-white' : ''}>Profile</span>
            </Menu.Item>
            <Menu.Item 
              key="sales" 
              icon={<ShoppingOutlined />}
              className={`${activeMenu === 'sales' ? 'ant-menu-item-selected' : ''}`}
            >
              <span className={activeMenu === 'sales' ? 'text-white' : ''}>Sales History</span>
            </Menu.Item>
            <Menu.Item 
              key="buying" 
              icon={<ShoppingCartOutlined />}
              className={`${activeMenu === 'buying' ? 'ant-menu-item-selected' : ''}`}
            >
              <span className={activeMenu === 'buying' ? 'text-white' : ''}>Buying History</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="p-6 bg-white min-h-[500px]">
          {renderContent()}
        </Content>
      </Layout>
    </div>
  );
};

export default UserDetails;