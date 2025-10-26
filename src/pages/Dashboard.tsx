import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Card, Row, Col, Button, List, Typography, Empty, Tag, Space } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { getProducts, getOrdersByUserId, Product, Order } from '../api/services';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user, appUser, refreshAppUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, appUser]);

  const fetchDashboardData = async () => {
    if (!user || !appUser) return;

    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProducts(),
        getOrdersByUserId(user.uid),
      ]);

      const wishlist = appUser.wishlist || [];
      const wishlistItems = productsRes.data.filter((p) => wishlist.includes(p.id));
      setWishlistProducts(wishlistItems);
      setOrders(ordersRes.data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user || !appUser) return;

    const newWishlist = (appUser.wishlist || []).filter((id) => id !== productId);
    try {
      const { updateUser } = await import('../api/services');
      await updateUser(user.uid, { wishlist: newWishlist });
      await refreshAppUser();
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
      message.success('Removed from wishlist');
    } catch (error) {
      message.error('Failed to remove from wishlist');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      'On Process': 'processing',
      'Shipped': 'warning',
      'Delivered': 'success',
    };
    return colors[status];
  };

  const items = [
    {
      key: 'wishlist',
      label: 'Wishlist',
      children: (
        <div>
          {wishlistProducts.length === 0 ? (
            <Empty description="Your wishlist is empty" />
          ) : (
            <Row gutter={[16, 16]}>
              {wishlistProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromWishlist(product.id)}
                      />,
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <Space direction="vertical" size="small">
                          <Text strong>${product.price.toFixed(2)}</Text>
                          <Text type="secondary">Stock: {product.stock}</Text>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Order History',
      children: (
        <div>
          {orders.length === 0 ? (
            <Empty description="No orders yet" />
          ) : (
            <List
              dataSource={orders}
              renderItem={(order) => (
                <Card style={{ marginBottom: 16 }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Title level={5}>Order #{order.id.slice(0, 8)}</Title>
                      <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                    </div>
                    <Text type="secondary">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </Text>
                    <div>
                      <Text strong>Items:</Text>
                      <List
                        size="small"
                        dataSource={order.products}
                        renderItem={(item) => (
                          <List.Item>
                            <Text>
                              {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                          </List.Item>
                        )}
                      />
                    </div>
                    <div>
                      <Text strong>Delivery Address:</Text>
                      <Text>
                        <br />
                        {order.address.street}, {order.address.city}
                        <br />
                        {order.address.state} {order.address.zipCode}, {order.address.country}
                      </Text>
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        Total: ${order.total.toFixed(2)}
                      </Text>
                    </div>
                  </Space>
                </Card>
              )}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={2}>My Dashboard</Title>
      <Tabs items={items} size="large" />
    </Content>
  );
};

export default Dashboard;
