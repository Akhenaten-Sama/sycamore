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
  BarChartOutlined,
  GlobalOutlined,
  HomeOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Giving = ({ user }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [donationModal, setDonationModal] = useState(false);
  const [givingHistory, setGivingHistory] = useState([]);
  const [givingStats, setGivingStats] = useState({});
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState('NGN');

  // Paystack configuration
  const PAYSTACK_PUBLIC_KEY = 'pk_test_847967189b962acc11e39b8ed4b1d11ecafe0cb3';

  // Currency configurations
  const currencies = {
    NGN: { symbol: '₦', name: 'Nigerian Naira', paystack: true },
    USD: { symbol: '$', name: 'US Dollar', paystack: true },
    EUR: { symbol: '€', name: 'Euro', paystack: false },
    GBP: { symbol: '£', name: 'British Pound', paystack: false },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', paystack: false },
    GHS: { symbol: 'GH₵', name: 'Ghana Cedi', paystack: true },
    ZAR: { symbol: 'R', name: 'South African Rand', paystack: true },
    KES: { symbol: 'KSh', name: 'Kenyan Shilling', paystack: true }
  };

  const getCurrencySymbol = (currencyCode) => {
    return currencies[currencyCode]?.symbol || '$';
  };

  const isPaystackSupported = (currencyCode) => {
    return currencies[currencyCode]?.paystack || false;
  };

  useEffect(() => {
    if (user) {
      loadGivingHistory();
      loadGivingStats();
    }
  }, [user]);

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadGivingHistory = async () => {
    try {
      const response = await ApiClient.getGivingHistory(user.memberId || user.id);
      
      // ApiClient already extracts the data part from { success: true, data: [...] }
      if (response && Array.isArray(response)) {
        setGivingHistory(response);
      } else {
        setGivingHistory([]);
      }
    } catch (error) {
      console.error('Failed to load giving history:', error);
      setGivingHistory([]);
    }
  };

  const loadGivingStats = async () => {
    try {
      const response = await ApiClient.getGivingStats(user.memberId || user.id);
      
      // ApiClient already extracts the data part from { success: true, data: {...} }
      if (response && (response.totalGiving !== undefined || response.yearlyGiving !== undefined)) {
        setGivingStats({
          yearlyTotal: response.yearlyGiving || 0,
          monthlyTotal: response.monthlyBreakdown?.reduce((sum, month) => {
            const currentMonth = new Date().getMonth() + 1;
            return month.month === currentMonth ? sum + month.total : sum;
          }, 0) || 0,
          totalDonations: response.totalDonations || 0,
          givingStreak: 0 // This needs to be calculated separately
        });
      } else {
        setGivingStats({
          yearlyTotal: 0,
          monthlyTotal: 0,
          totalDonations: 0,
          givingStreak: 0
        });
      }
    } catch (error) {
      console.error('Failed to load giving stats:', error);
      setGivingStats({
        yearlyTotal: 0,
        monthlyTotal: 0,
        totalDonations: 0,
        givingStreak: 0
      });
    }
  };

  const handlePaystackPayment = (amount, email, currency, onSuccess, onClose) => {
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Convert to kobo/cents
      currency: currency,
      callback: function(response) {
        onSuccess(response);
      },
      onClose: function() {
        onClose();
      }
    });
    
    handler.openIframe();
  };

  const handleDonation = async (values) => {
    if (!user) {
      message.warning('Please sign in to make a donation');
      return;
    }

    // Check if Paystack supports the selected currency
    if (!isPaystackSupported(currency)) {
      message.error(`Sorry, Paystack doesn't support ${currency}. Please select NGN, USD, GHS, ZAR, or KES for online payments.`);
      return;
    }

    try {
      setLoading(true);
      
      const donationData = {
        ...values,
        userId: user.memberId || user.id,
        currency,
        timestamp: new Date().toISOString(),
      };

      // Process payment with Paystack
      await new Promise((resolve, reject) => {
        handlePaystackPayment(
          values.amount,
          user.email,
          currency,
          async (response) => {
            try {
              // Send donation data to backend with Paystack reference
              const donationWithPayment = {
                ...donationData,
                paymentReference: response.reference,
                method: 'paystack',
                status: 'completed'
              };

              const result = await ApiClient.processDonation(donationWithPayment);
              
              message.success('Thank you for your generous donation!');
              form.resetFields();
              loadGivingHistory();
              loadGivingStats();
              setDonationModal(false); // Ensure modal closes
              resolve();
            } catch (error) {
              console.error('Error processing donation:', error);
              message.error('Failed to process donation. Please contact support.');
              reject(error);
            }
          },
          () => {
            message.info('Payment cancelled');
            reject(new Error('Payment cancelled'));
          }
        );
      });
    } catch (error) {
      if (error.message !== 'Payment cancelled') {
        message.error('Failed to process payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const givingCategories = [
    { key: 'tithe', icon: <HeartOutlined />, label: 'Tithe', description: 'Regular tithe offering' },
    { key: 'offering', icon: <GiftOutlined />, label: 'General Offering', description: 'General church offering' },
    { key: 'missions', icon: <GlobalOutlined />, label: 'Missions', description: 'Support missionary work' },
    { key: 'building', icon: <HomeOutlined />, label: 'Building Fund', description: 'Church building and maintenance' },
    { key: 'youth', icon: <TeamOutlined />, label: 'Youth Ministry', description: 'Support youth programs' },
    { key: 'outreach', icon: <UsergroupAddOutlined />, label: 'Community Outreach', description: 'Help local community' },
    { key: 'special', icon: <StarOutlined />, label: 'Special Projects', description: 'Special church initiatives' },
  ];

  const StatsSection = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#999' : '#666' }}>This Year</span>}
            value={givingStats.yearlyTotal || 0}
            prefix={getCurrencySymbol(currency)}
            precision={2}
            valueStyle={{ color: isDarkMode ? '#4a9d9d' : '#1890ff', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#999' : '#666' }}>This Month</span>}
            value={givingStats.monthlyTotal || 0}
            prefix={getCurrencySymbol(currency)}
            precision={2}
            valueStyle={{ color: isDarkMode ? '#4a9d9d' : '#4A7C23', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#999' : '#666' }}>Total Gifts</span>}
            value={givingStats.totalDonations || 0}
            prefix="#"
            valueStyle={{ color: isDarkMode ? '#9b59b6' : '#722ed1', fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#999' : '#666' }}>Giving Streak</span>}
            value={givingStats.givingStreak || 0}
            suffix="months"
            prefix={<TrophyOutlined />}
            valueStyle={{ color: isDarkMode ? '#e67e22' : '#fa8c16', fontSize: 18 }}
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
            style={{ 
              textAlign: 'center', 
              height: 150,
              background: isDarkMode ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8, color: isDarkMode ? '#4a9d9d' : '#1890ff' }}>
              {category.icon}
            </div>
            <Title level={4} style={{ margin: 0, color: isDarkMode ? '#fff' : '#000' }}>
              {category.label}
            </Title>
            <Text style={{ fontSize: 12, color: isDarkMode ? '#999' : '#666' }}>
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
    <Card 
      title={
        <span style={{ color: isDarkMode ? '#fff' : '#000' }}>
          <BarChartOutlined style={{ marginRight: 8 }} />
          Giving History
        </span>
      }
      style={{ 
        marginTop: 24,
        background: isDarkMode ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
      }}
    >
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
                    <span style={{ color: isDarkMode ? '#fff' : '#000' }}>{getCategoryLabel(donation.category)}</span>
                    <Text strong style={{ color: isDarkMode ? '#fff' : '#000' }}>
                      {getCurrencySymbol(donation.currency)}{donation.amount.toFixed(2)} {donation.currency}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <Space wrap>
                      <Tag icon={<CalendarOutlined />}>
                        {new Date(donation.date).toLocaleDateString()}
                      </Tag>
                      <Tag icon={<CreditCardOutlined />}>
                        {donation.method || donation.paymentMethod}
                      </Tag>
                      <Tag color="green" icon={<CheckOutlined />}>
                        {donation.status || 'Completed'}
                      </Tag>
                    </Space>
                    {donation.note && (
                      <div style={{ marginTop: 4 }}>
                        <Text style={{ fontStyle: 'italic', color: isDarkMode ? '#999' : '#666' }}>
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
          <GiftOutlined style={{ fontSize: 64, color: isDarkMode ? '#444' : '#d9d9d9', marginBottom: 16 }} />
          <Title level={4} style={{ color: isDarkMode ? '#999' : '#666' }}>No giving history yet</Title>
          <Paragraph style={{ color: isDarkMode ? '#888' : '#999' }}>Your donations will appear here</Paragraph>
          <Button 
            type="primary" 
            onClick={() => setDonationModal(true)}
            style={{
              background: isDarkMode ? '#2d7a7a' : '#1890ff',
              borderColor: isDarkMode ? '#2d7a7a' : '#1890ff'
            }}
          >
            Make Your First Donation
          </Button>
        </div>
      )}
    </Card>
  );

  const getCategoryColor = (category) => {
    const colors = {
      tithe: '#1890ff',
      offering: '#4A7C23', 
      missions: '#722ed1',
      building: '#fa8c16',
      youth: '#4A7C23',
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
    <div style={{ 
      padding: 0,
      background: isDarkMode ? '#121212' : '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ 
        padding: '16px',
        background: isDarkMode ? '#121212' : '#f5f5f5'
      }}>
        <Title 
          level={3} 
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000',
            marginBottom: 8,
            fontSize: '20px',
            fontWeight: 700
          }}
        >
          <HeartOutlined style={{ marginRight: 8 }} />
          Give
        </Title>
        <Paragraph 
          style={{ 
            color: isDarkMode ? '#999' : '#666',
            fontSize: '14px',
            marginBottom: 0
          }}
        >
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
        </Paragraph>
      </div>

      <div style={{ padding: '0 16px 16px' }}>

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
          
          <Card 
            title={
              <span style={{ color: isDarkMode ? '#fff' : '#000' }}>
                <DollarOutlined style={{ marginRight: 8 }} />
                Choose Your Giving
              </span>
            } 
            style={{ 
              marginBottom: 24,
              background: isDarkMode ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
            }}
          >
            <GivingOptions />
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<HeartOutlined />}
                onClick={() => setDonationModal(true)}
                style={{
                  background: isDarkMode ? '#2d7a7a' : '#1890ff',
                  borderColor: isDarkMode ? '#2d7a7a' : '#1890ff',
                  height: '48px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
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
        title={
          <span>
            <GiftOutlined style={{ marginRight: 8 }} />
            Make a Donation
          </span>
        }
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

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="amount"
                label={`Amount (${currency})`}
                rules={[
                  { required: true, message: 'Please enter amount' },
                  { type: 'number', min: 1, message: 'Amount must be at least 1' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix={getCurrencySymbol(currency)}
                  placeholder="0.00"
                  step={0.01}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Currency">
                <Select 
                  value={currency} 
                  onChange={setCurrency}
                  placeholder="Select currency"
                >
                  {Object.entries(currencies).map(([code, info]) => (
                    <Option key={code} value={code}>
                      {info.symbol} {code} {info.paystack ? <CreditCardOutlined /> : <BankOutlined />}
                    </Option>
                  ))}
                </Select>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  <CreditCardOutlined /> = Paystack supported, <BankOutlined /> = Contact church for other payment methods
                </div>
              </Form.Item>
            </Col>
          </Row>

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
            message="Secure Payment via Paystack"
            description="Your payment will be processed securely via Paystack. You will receive an email confirmation after your donation is processed."
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
                Donate
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
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
