import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Tag, Space, Typography, message, Tabs, Modal, Form, Input, InputNumber, Select, Popconfirm } from 'antd';
import { getOrders, updateOrderStatus, Order, getProducts, getCategories, Product, Category, createProduct, updateProduct, deleteProduct } from '../api/services';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/AuthContext';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
    fetchProducts();
    fetchCategories();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setProductLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success('Order status updated');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const showProductModal = (product?: Product) => {
    setEditingProduct(product || null);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleProductSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success('Product updated successfully');
      } else {
        await createProduct(values);
        message.success('Product created successfully');
      }
      
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
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

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.slice(0, 8),
    },
    {
      title: 'Customer ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => userId.slice(0, 8),
    },
    {
      title: 'Items',
      dataIndex: 'products',
      key: 'products',
      render: (products: Order['products']) => products.length,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${total.toFixed(2)}`,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address: Order['address']) => (
        <div>
          {address.city}, {address.state}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:unknown, record: Order) => (
        <Space>
          {record.status === 'On Process' && (
            <Button
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'Shipped')}
            >
              Mark Shipped
            </Button>
          )}
          {record.status === 'Shipped' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'Delivered')}
            >
              Mark Delivered
            </Button>
          )}
          {record.status === 'Delivered' && (
            <Tag color="success">Completed</Tag>
          )}
        </Space>
      ),
    },
  ];

  const productColumns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock === 0 ? 'error' : 'success'}>
          {stock === 0 ? 'Out of Stock' : `${stock} in stock`}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showProductModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={2}>Admin Panel</Title>
      
      <Tabs defaultActiveKey="orders">
        <TabPane tab="Order Management" key="orders">
          <Table
            columns={orderColumns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: '16px', background: '#f5f5f5' }}>
                  <Title level={5}>Order Details</Title>
                  <p><strong>Products:</strong></p>
                  <ul>
                    {record.products.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Full Address:</strong></p>
                  <p>
                    {record.address.street}<br />
                    {record.address.city}, {record.address.state} {record.address.zipCode}<br />
                    {record.address.country}
                  </p>
                </div>
              ),
            }}
          />
        </TabPane>
        
        <TabPane tab="Product Management" key="products">
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showProductModal()}
            >
              Add New Product
            </Button>
          </div>
          <Table
            columns={productColumns}
            dataSource={products}
            rowKey="id"
            loading={productLoading}
          />
        </TabPane>
      </Tabs>
      
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onOk={handleProductSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingProduct ? 'Update' : 'Create'}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              precision={2} 
              style={{ width: '100%' }} 
              formatter={value => `$ ${value}`}
              parser={((value: string) => {
                const cleaned = value ? value.replace(/\$\s?|(,*)/g, '') : '';
                return cleaned === '' ? 0 : Number(cleaned);
              }) as any}
            />
          </Form.Item>
          
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Please enter image URL' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Admin;
