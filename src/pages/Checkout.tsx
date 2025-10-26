import React, { useState } from 'react';
import { Layout, Card, Button, List, Typography, Select, Space, Input, Form, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder, updateUser, Address } from '../api/services';
import useAuth from '@/context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Checkout: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, appUser, refreshAppUser } = useAuth();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddAddress = async (values) => {
    if (!user || !appUser) return;

    const newAddress: Address = {
      id: Date.now().toString(),
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
    };

    try {
      const addresses = [...(appUser.addresses || []), newAddress];
      await updateUser(user.uid, { addresses });
      await refreshAppUser();
      setShowAddressForm(false);
      form.resetFields();
      message.success('Address added successfully');
    } catch (error) {
      message.error('Failed to add address');
    }
  };

  const handleConfirmOrder = async () => {
    if (!user || !appUser) {
      message.warning('Please login to place order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      message.warning('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      message.warning('Please select a delivery address');
      return;
    }

    const address = appUser.addresses?.find((a) => a.id === selectedAddress);
    if (!address) {
      message.error('Invalid address selected');
      return;
    }

    setLoading(true);
    try {
      const order = {
        userId: user.uid,
        products: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        total: getTotalPrice(),
        address,
        status: 'On Process' as const,
        createdAt: new Date().toISOString(),
      };

      await createOrder(order);
      clearCart();
      message.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Content style={{ padding: '24px', textAlign: 'center' }}>
        <Empty description="Please login to checkout" />
        <Button type="primary" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Content>
    );
  }

  if (cart.length === 0) {
    return (
      <Content style={{ padding: '24px', textAlign: 'center' }}>
        <Empty description="Your cart is empty" />
        <Button type="primary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Content>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={2}>Checkout</Title>
      
      <Card title="Order Summary" style={{ marginBottom: 24 }}>
        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}`}
              />
              <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Title level={4}>Total: ${getTotalPrice().toFixed(2)}</Title>
        </div>
      </Card>

      <Card title="Delivery Address" style={{ marginBottom: 24 }}>
        {appUser?.addresses && appUser.addresses.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Select
              placeholder="Select delivery address"
              value={selectedAddress}
              onChange={setSelectedAddress}
              style={{ width: '100%' }}
              size="large"
            >
              {appUser.addresses.map((addr) => (
                <Option key={addr.id} value={addr.id}>
                  {addr.label} - {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                </Option>
              ))}
            </Select>
            <Button icon={<PlusOutlined />} onClick={() => setShowAddressForm(!showAddressForm)}>
              Add New Address
            </Button>
          </Space>
        ) : (
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => setShowAddressForm(true)} block>
            Add Delivery Address
          </Button>
        )}

        {showAddressForm && (
          <Form form={form} onFinish={handleAddAddress} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item name="label" label="Address Label" rules={[{ required: true }]}>
              <Input placeholder="e.g., Home, Office" />
            </Form.Item>
            <Form.Item name="street" label="Street Address" rules={[{ required: true }]}>
              <Input placeholder="123 Main St" />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input placeholder="New York" />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input placeholder="NY" />
            </Form.Item>
            <Form.Item name="zipCode" label="Zip Code" rules={[{ required: true }]}>
              <Input placeholder="10001" />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input placeholder="USA" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Save Address
                </Button>
                <Button onClick={() => setShowAddressForm(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>

      <Button
        type="primary"
        size="large"
        block
        onClick={handleConfirmOrder}
        loading={loading}
        disabled={!selectedAddress}
      >
        Confirm Order
      </Button>
    </Content>
  );
};

export default Checkout;
