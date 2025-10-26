import React, { useEffect } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/AuthContext';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ maxWidth: 400, width: '100%', margin: 20, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>Admin Sim</Title>
          <Paragraph>
            Sign in to access your account, manage products, and track orders.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<GoogleOutlined />}
            onClick={loginWithGoogle}
            block
          >
            Sign in with Google
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
