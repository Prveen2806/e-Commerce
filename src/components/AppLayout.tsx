import React from 'react';
import { Layout, Menu, Badge, Button, Dropdown, Space, Typography } from 'antd';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import type { MenuProps } from 'antd';
import useAuth from '@/context/AuthContext';

const { Header, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'My Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Admin Panel',
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
    {
      key: '/checkout',
      icon: (
        <Badge count={getTotalItems()} offset={[10, 0]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: 'Cart',
      onClick: () => navigate('/checkout'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Text style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            Admin Sim
          </Text>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
            }}
          />
        </div>
        <Space>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" icon={<UserOutlined />} style={{ color: 'white' }}>
                My Account
              </Button>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Space>
      </Header>

      <Content
        style={{
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)',
          padding: '16px',
        }}
      >
        <Outlet /> 
      </Content>
    </Layout>
  );
};

export default AppLayout;
