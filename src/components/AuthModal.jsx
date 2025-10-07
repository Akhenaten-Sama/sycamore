import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const AuthModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        onClose();
        loginForm.resetFields();
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = values;
      const result = await register(userData);
      if (result.success) {
        onClose();
        registerForm.resetFields();
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginContent = (
    <Form
      form={loginForm}
      layout="vertical"
      onFinish={handleLogin}
      size="large"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="your.email@example.com"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Your password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          icon={<LoginOutlined />}
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );

  const registerContent = (
    <Form
      form={registerForm}
      layout="vertical"
      onFinish={handleRegister}
      size="large"
    >
      <Space direction="horizontal" style={{ width: '100%' }}>
        <Form.Item
          name="title"
          label="Title"
          style={{ flex: 0.3 }}
          rules={[{ required: true, message: 'Please select title' }]}
        >
          <Select placeholder="Title">
            <Option value="Mr">Mr</Option>
            <Option value="Mrs">Mrs</Option>
            <Option value="Miss">Miss</Option>
            <Option value="Dr">Dr</Option>
            <Option value="Prof">Prof</Option>
            <Option value="Rev">Rev</Option>
            <Option value="Pastor">Pastor</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="John"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Doe"
          />
        </Form.Item>
      </Space>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="your.email@example.com"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="+1234567890"
        />
      </Form.Item>

      <Form.Item
        name="dateOfBirth"
        label="Date of Birth (Optional)"
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder="Select your birth date"
        />
      </Form.Item>

      <Form.Item
        name="maritalStatus"
        label="Marital Status"
        initialValue="single"
      >
        <Select placeholder="Select marital status">
          <Option value="single">Single</Option>
          <Option value="married">Married</Option>
          <Option value="divorced">Divorced</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="yearsAttending"
        label="When did you start attending SYC?"
        rules={[{ required: true, message: 'Please select when you started attending' }]}
      >
        <Select placeholder="Select when you started attending">
          <Option value="first_timer">I am a first timer</Option>
          <Option value="not_attending">I do not attend Sycamore</Option>
          {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => {
            const year = 2014 + i;
            return <Option key={year} value={year.toString()}>{year}</Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: 'Please select your location' }]}
      >
        <Select placeholder="Select your location">
          <Option value="lagos">Lagos</Option>
          <Option value="ibadan">Ibadan</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter your password' },
          { min: 6, message: 'Password must be at least 6 characters' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Choose a strong password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm your password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          icon={<UserAddOutlined />}
        >
          Join Our Church Family
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    {
      key: 'login',
      label: 'Sign In',
      children: (
        <div>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
            Welcome Back! 🙏
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
            Sign in to access your church community
          </Text>
          {loginContent}
        </div>
      ),
    },
    {
      key: 'register',
      label: 'Join Us',
      children: (
        <div>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
            Join Our Family! ✨
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
            Become part of the Sycamore Church community
          </Text>
          {registerContent}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/images/sycamore-logo-hd.svg" 
            alt="Sycamore Church" 
            style={{ height: 40, marginBottom: 8 }}
          />
          <div>Sycamore Church</div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={items}
      />
      
      <Divider />
      
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          By signing up, you agree to join our church community
        </Text>
      </div>
    </Modal>
  );
};

export default AuthModal;
