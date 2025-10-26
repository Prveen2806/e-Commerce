import React, { useEffect, useState } from 'react';
import { Layout, Input, Select, Card, Row, Col, Button, Space, Typography, Empty, Spin } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, SearchOutlined } from '@ant-design/icons';
import { getProducts, getCategories, Product, Category, updateUser } from '../api/services';
import { useCart } from '../context/CartContext';
import { message } from 'antd';
import useAuth from '@/context/AuthContext';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;
const { Title } = Typography;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user, appUser, refreshAppUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (error) {
      message.error('Failed to load products. Please ensure JSON Server is running on port 3008.');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filter by search
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

    setFilteredProducts(result);
  };

  const isInWishlist = (productId: string) => {
    return appUser?.wishlist?.includes(productId) || false;
  };

  const toggleWishlist = async (productId: string) => {
    if (!user || !appUser) {
      message.warning('Please login to use wishlist');
      return;
    }

    const wishlist = appUser.wishlist || [];
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    try {
      await updateUser(user.uid, { wishlist: newWishlist });
      await refreshAppUser();
      message.success(
        wishlist.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist'
      );
    } catch (error) {
      message.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Products</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <Search
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={6} lg={4}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="all">All Categories</Option>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6} lg={4}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="name">Sort by Name</Option>
              <Option value="price-asc">Price: Low to High</Option>
              <Option value="price-desc">Price: High to Low</Option>
            </Select>
          </Col>
        </Row>

        {filteredProducts.length === 0 ? (
          <Empty description="No products found" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
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
                      icon={isInWishlist(product.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                      onClick={() => toggleWishlist(product.id)}
                      disabled={!user}
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
                  <Meta
                    title={product.name}
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>${product.price.toFixed(2)}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          Stock: {product.stock}
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {product.category}
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </Content>
  );
};

export default Home;
