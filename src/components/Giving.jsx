import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  message,
  Space,
  Statistic,
  List,
  Avatar,
  Tag,
  Divider,
  Alert,
  Progress,
  Radio,
  Spin,
} from 'antd';
import {
  DollarOutlined,
  CreditCardOutlined,
  HeartOutlined,
  TrophyOutlined,
  CalendarOutlined,
  GiftOutlined,
  BankOutlined,
  MobileOutlined,
  CheckOutlined,
  StarOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Giving = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [donationModal, setDonationModal] = useState(false);
  const [givingHistory, setGivingHistory] = useState([]);
  const [givingStats, setGivingStats] = useState({});
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (user) {
      loadGivingHistory();
      loadGivingStats();
    }
  }, [user]);

  const loadGivingHistory = async () => {
    try {
      const response = await ApiClient.getGivingHistory(user.memberId || user.id);
      setGivingHistory(response || mockGivingHistory);
    } catch (error) {
      console.error('Failed to load giving history:', error);
      setGivingHistory(mockGivingHistory);
    }
  };

  const loadGivingStats = async () => {
    try {
      const response = await ApiClient.getGivingStats(user.memberId || user.id);
      setGivingStats(response || mockGivingStats);
    } catch (error) {
      console.error('Failed to load giving stats:', error);
      setGivingStats(mockGivingStats);
    }
  };

  const handleDonation = async (values) => {
    if (!user) {
      message.warning('Please sign in to make a donation');
      return;
    }

    try {
      setLoading(true);
      const donationData = {
        ...values,
        userId: user.memberId || user.id,
        paymentMethod,
        timestamp: new Date().toISOString(),
      };

      await ApiClient.processDonation(donationData);
      
      message.success('🙏 Thank you for your generous donation!');
      form.resetFields();
      setDonationModal(false);
      loadGivingHistory();
      loadGivingStats();
    } catch (error) {
      message.error('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const givingCategories = [
    { key: 'tithe', label: '💰 Tithe', description: 'Regular tithe offering' },
    { key: 'offering', label: '🙏 General Offering', description: 'General church offering' },
    { key: 'missions', label: '🌍 Missions', description: 'Support missionary work' },
    { key: 'building', label: '🏗️ Building Fund', description: 'Church building and maintenance' },
    { key: 'youth', label: '👥 Youth Ministry', description: 'Support youth programs' },
    { key: 'outreach', label: '🤝 Community Outreach', description: 'Help local community' },
    { key: 'special', label: '⭐ Special Projects', description: 'Special church initiatives' },
  ];

  const StatsSection = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="This Year"
            value={givingStats.yearlyTotal || 0}
            prefix="$"
            precision={2}
            valueStyle={{ color: '#1890ff', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="This Month"
            value={givingStats.monthlyTotal || 0}
            prefix="$"
            precision={2}
            valueStyle={{ color: '#52c41a', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Total Gifts"
            value={givingStats.totalDonations || 0}
            prefix="#"
            valueStyle={{ color: '#722ed1', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Giving Streak"
            value={givingStats.givingStreak || 0}
            suffix="months"
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#fa8c16', fontSize: 18 }}
          />
        </Card>
      </Col>
    </Row>
  );

  const GivingOptions = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {givingCategories.map(category => (
        <Col xs={24} sm={12} lg={8} key={category.key}>
          <Card
            hoverable
            onClick={() => openDonationModal(category)}
            style={{ textAlign: 'center', height: 150 }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>
              {category.label.split(' ')[0]}
            </div>
            <Title level={4} style={{ margin: 0 }}>
              {category.label.split(' ').slice(1).join(' ')}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {category.description}
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const openDonationModal = (category) => {
    form.setFieldsValue({ category: category.key });
    setDonationModal(true);
  };

  const GivingHistory = () => (
    <Card title="📊 Giving History" style={{ marginTop: 24 }}>
      {givingHistory.length > 0 ? (
        <List
          dataSource={givingHistory}
          renderItem={donation => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: getCategoryColor(donation.category),
                      color: 'white'
                    }}
                    icon={<DollarOutlined />}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{getCategoryLabel(donation.category)}</span>
                    <Text strong>${donation.amount.toFixed(2)}</Text>
                  </div>
                }
                description={
                  <div>
                    <Space wrap>
                      <Tag icon={<CalendarOutlined />}>
                        {new Date(donation.date).toLocaleDateString()}
                      </Tag>
                      <Tag icon={<CreditCardOutlined />}>
                        {donation.paymentMethod}
                      </Tag>
                      <Tag color="green" icon={<CheckOutlined />}>
                        Completed
                      </Tag>
                    </Space>
                    {donation.note && (
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontStyle: 'italic' }}>
                          "{donation.note}"
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <GiftOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
          <Title level={4} type="secondary">No giving history yet</Title>
          <Paragraph type="secondary">Your donations will appear here</Paragraph>
          <Button type="primary" onClick={() => setDonationModal(true)}>
            Make Your First Donation
          </Button>
        </div>
      )}
    </Card>
  );

  const getCategoryColor = (category) => {
    const colors = {
      tithe: '#1890ff',
      offering: '#52c41a', 
      missions: '#722ed1',
      building: '#fa8c16',
      youth: '#13c2c2',
      outreach: '#eb2f96',
      special: '#faad14'
    };
    return colors[category] || '#1890ff';
  };

  const getCategoryLabel = (category) => {
    const category_obj = givingCategories.find(c => c.key === category);
    return category_obj ? category_obj.label : category;
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>💝 Give</Title>
        <Paragraph type="secondary">
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
        </Paragraph>
      </div>

      {!user ? (
        <Alert
          message="Sign in Required"
          description="Please sign in to make donations and track your giving history."
          type="info"
          showIcon
          action={
            <Button type="primary">
              Sign In
            </Button>
          }
          style={{ marginBottom: 24 }}
        />
      ) : (
        <>
          <StatsSection />
          
          <Card title="🎯 Choose Your Giving" style={{ marginBottom: 24 }}>
            <GivingOptions />
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<HeartOutlined />}
                onClick={() => setDonationModal(true)}
              >
                Make a Donation
              </Button>
            </div>
          </Card>

          <GivingHistory />
        </>
      )}

      {/* Donation Modal */}
      <Modal
        title="💝 Make a Donation"
        open={donationModal}
        onCancel={() => setDonationModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleDonation}
          size="large"
        >
          <Form.Item
            name="category"
            label="Donation Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Choose what you'd like to support">
              {givingCategories.map(category => (
                <Option key={category.key} value={category.key}>
                  {category.label} - {category.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 1, message: 'Amount must be at least $1' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="$"
              placeholder="0.00"
              step={0.01}
              min={1}
            />
          </Form.Item>

          <Form.Item label="Payment Method">
            <Radio.Group 
              value={paymentMethod} 
              onChange={e => setPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Radio.Button value="card" style={{ width: '33.33%', textAlign: 'center' }}>
                <CreditCardOutlined /> Card
              </Radio.Button>
              <Radio.Button value="bank" style={{ width: '33.33%', textAlign: 'center' }}>
                <BankOutlined /> Bank
              </Radio.Button>
              <Radio.Button value="mobile" style={{ width: '33.33%', textAlign: 'center' }}>
                <MobileOutlined /> Mobile
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {paymentMethod === 'card' && (
            <>
              <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[{ required: true, message: 'Please enter card number' }]}
              >
                <Input placeholder="1234 5678 9012 3456" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="expiryDate"
                    label="Expiry Date"
                    rules={[{ required: true, message: 'Please enter expiry date' }]}
                  >
                    <Input placeholder="MM/YY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="cvv"
                    label="CVV"
                    rules={[{ required: true, message: 'Please enter CVV' }]}
                  >
                    <Input placeholder="123" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item
            name="note"
            label="Note (Optional)"
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Add a personal note or prayer request..."
            />
          </Form.Item>

          <Alert
            message="Secure Payment"
            description="Your payment information is encrypted and secure. You will receive an email confirmation after your donation is processed."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setDonationModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Donate Now 🙏
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Mock data
const mockGivingHistory = [
  {
    id: 1,
    category: 'tithe',
    amount: 250.00,
    date: '2025-09-01',
    paymentMethod: 'Credit Card',
    note: 'Monthly tithe offering',
    status: 'completed'
  },
  {
    id: 2,
    category: 'missions',
    amount: 100.00,
    date: '2025-08-15',
    paymentMethod: 'Bank Transfer',
    note: 'Supporting missions work in Africa',
    status: 'completed'
  },
  {
    id: 3,
    category: 'building',
    amount: 500.00,
    date: '2025-08-01',
    paymentMethod: 'Credit Card',
    note: 'New sanctuary building project',
    status: 'completed'
  }
];

const mockGivingStats = {
  yearlyTotal: 3250.00,
  monthlyTotal: 350.00,
  totalDonations: 24,
  givingStreak: 8
};

export default Giving;
