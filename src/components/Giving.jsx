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
  CalendarOutlined,
  GiftOutlined,
  BankOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import { useTheme } from '../contexts/ThemeContext';

// Import giving category icons
import TitheIcon from '../assets/icons/giving/tithe.svg';
import GeneralOfferingIcon from '../assets/icons/giving/general_offering.svg';
import MissionsIcon from '../assets/icons/giving/missions.svg';
import BuildingFundIcon from '../assets/icons/giving/building_fund.svg';
import YouthMinistryIcon from '../assets/icons/giving/youth_ministry.svg';
import SpecialProjectIcon from '../assets/icons/giving/special_project.svg';
import CommunityOutreachIcon from '../assets/icons/giving/community_outreach.svg';

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
    console.log('🔍 User changed:', user);
    if (user) {
      console.log('✅ User exists, loading data...');
      loadGivingHistory();
      loadGivingStats();
    } else {
      console.log('❌ No user, skipping data load');
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
      console.log('💰 Loading giving history for user:', user?.memberId || user?.id);
      const response = await ApiClient.getGivingHistory(user.memberId || user.id);
      console.log('💰 Giving history response:', response);
      
      // Response structure: { success: true, data: [...] }
      if (response && response.success && Array.isArray(response.data)) {
        console.log('💰 Setting giving history:', response.data.length, 'donations');
        setGivingHistory(response.data);
      } else if (response && Array.isArray(response)) {
        // Fallback: if ApiClient already extracted data
        console.log('💰 Setting giving history (fallback):', response.length, 'donations');
        setGivingHistory(response);
      } else {
        console.log('💰 No valid giving history data');
        setGivingHistory([]);
      }
    } catch (error) {
      console.error('❌ Failed to load giving history:', error);
      setGivingHistory([]);
    }
  };

  const loadGivingStats = async () => {
    try {
      console.log('📊 Loading giving stats for user:', user?.memberId || user?.id);
      const response = await ApiClient.getGivingStats(user.memberId || user.id);
      console.log('📊 Giving stats response:', response);
      
      // Response structure: { success: true, data: {...} }
      const statsData = response?.data || response;
      console.log('📊 Extracted statsData:', statsData);
      console.log('📊 statsData.totalGiving:', statsData?.totalGiving);
      console.log('📊 statsData.yearlyGiving:', statsData?.yearlyGiving);
      console.log('📊 statsData.totalDonations:', statsData?.totalDonations);
      
      if (statsData && (statsData.totalGiving !== undefined || statsData.yearlyGiving !== undefined)) {
        const currentMonth = new Date().getMonth() + 1;
        console.log('📊 Current month:', currentMonth);
        console.log('📊 monthlyBreakdown:', statsData.monthlyBreakdown);
        
        let monthlyTotal = 0;
        if (statsData.monthlyBreakdown && Array.isArray(statsData.monthlyBreakdown)) {
          for (const monthData of statsData.monthlyBreakdown) {
            console.log(`   - Checking month ${monthData.month} (current: ${currentMonth})`);
            console.log(`   - Match: ${monthData.month === currentMonth}`);
            console.log(`   - Total: ${monthData.total}`);
            if (monthData.month === currentMonth) {
              monthlyTotal += monthData.total;
            }
          }
        }
        
        console.log('📊 Final calculated monthlyTotal:', monthlyTotal);
        
        const stats = {
          yearlyTotal: statsData.yearlyGiving || 0,
          monthlyTotal: monthlyTotal,
          totalDonations: statsData.totalDonations || 0,
          givingStreak: 0 // This needs to be calculated separately
        };
        
        console.log('📊 Setting giving stats:', stats);
        setGivingStats(stats);
      } else {
        console.log('📊 No valid giving stats data, condition failed');
        console.log('📊 statsData exists?', !!statsData);
        console.log('📊 totalGiving defined?', statsData?.totalGiving !== undefined);
        console.log('📊 yearlyGiving defined?', statsData?.yearlyGiving !== undefined);
        setGivingStats({
          yearlyTotal: 0,
          monthlyTotal: 0,
          totalDonations: 0,
          givingStreak: 0
        });
      }
    } catch (error) {
      console.error('❌ Failed to load giving stats:', error);
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
    { 
      key: 'tithe', 
      icon: TitheIcon, 
      label: 'Tithe', 
      description: 'Regular tithe offering',
      color: '#f59e0b', // Orange
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'offering', 
      icon: GeneralOfferingIcon, 
      label: 'General Offering', 
      description: 'General church offering',
      color: '#296C70', // Blue
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'missions', 
      icon: MissionsIcon, 
      label: 'Missions', 
      description: 'Support missionary work',
      color: '#6A58CF', // Purple
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'building', 
      icon: BuildingFundIcon, 
      label: 'Building Fund', 
      description: 'Church building and maintenance',
      color: '#ec4899', // Pink
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'youth', 
      icon: YouthMinistryIcon, 
      label: 'Youth Ministry', 
      description: 'Support youth programs',
      color: '#26AC33', // Green
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'special', 
      icon: SpecialProjectIcon, 
      label: 'Special Project', 
      description: 'Special church initiatives',
      color: '#cb201c', // Red
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
    { 
      key: 'outreach', 
      icon: CommunityOutreachIcon, 
      label: 'Community Outreach', 
      description: 'Help local community',
      color: '#1969FD', // Blue
      bgColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)'
    },
  ];

  const StatsSection = () => (
    <>
      {/* Divider line */}
      <div style={{ 
        height: '1px', 
        background: isDarkMode ? '#2a2a2a' : '#e8e8e8',
        margin: '32px 0 24px 0'
      }} />
      
      <Title 
        level={4} 
        style={{ 
          color: isDarkMode ? '#ffffff' : '#000000',
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: 700
        }}
      >
        Analytics
      </Title>
      
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDarkMode ? 'none' : '1px solid #e0e0e0'
          }}>
            <div style={{
              background: isDarkMode ? '#000000' : '#f5f5f5',
              padding: '12px 16px'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#999' : '#666', 
                fontSize: '13px',
                display: 'block'
              }}>
                This Year
              </Text>
            </div>
            <div style={{ 
              padding: '16px',
              background: isDarkMode ? '#1a1a1a' : '#ffffff'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000', 
                fontSize: '24px',
                fontWeight: 700,
                display: 'block'
              }}>
                ₦{(givingStats.yearlyTotal || 0).toLocaleString()}
              </Text>
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDarkMode ? 'none' : '1px solid #e0e0e0'
          }}>
            <div style={{
              background: isDarkMode ? '#000000' : '#f5f5f5',
              padding: '12px 16px'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#999' : '#666', 
                fontSize: '13px',
                display: 'block'
              }}>
                This Month
              </Text>
            </div>
            <div style={{ 
              padding: '16px',
              background: isDarkMode ? '#1a1a1a' : '#ffffff'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000', 
                fontSize: '24px',
                fontWeight: 700,
                display: 'block'
              }}>
                ₦{(givingStats.monthlyTotal || 0).toLocaleString()}
              </Text>
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDarkMode ? 'none' : '1px solid #e0e0e0'
          }}>
            <div style={{
              background: isDarkMode ? '#000000' : '#f5f5f5',
              padding: '12px 16px'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#999' : '#666', 
                fontSize: '13px',
                display: 'block'
              }}>
                Total Gifts
              </Text>
            </div>
            <div style={{ 
              padding: '16px',
              background: isDarkMode ? '#1a1a1a' : '#ffffff'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000', 
                fontSize: '24px',
                fontWeight: 700,
                display: 'block'
              }}>
                {givingStats.totalDonations || 0}
              </Text>
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDarkMode ? 'none' : '1px solid #e0e0e0'
          }}>
            <div style={{
              background: isDarkMode ? '#000000' : '#f5f5f5',
              padding: '12px 16px'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#999' : '#666', 
                fontSize: '13px',
                display: 'block'
              }}>
                Giving Streak
              </Text>
            </div>
            <div style={{ 
              padding: '16px',
              background: isDarkMode ? '#1a1a1a' : '#ffffff'
            }}>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000', 
                fontSize: '24px',
                fontWeight: 700,
                display: 'block'
              }}>
                {givingStats.givingStreak || 2} Months
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );  const GivingOptions = () => (
    <>
      <Title 
        level={4} 
        style={{ 
          color: isDarkMode ? '#ffffff' : '#000000',
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: 700
        }}
      >
        Giving Options
      </Title>
      
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
      {givingCategories.map(category => (
        <Col xs={12} key={category.key}>
          <Card
            hoverable
            onClick={() => openDonationModal(category)}
            style={{ 
              background: category.bgColor,
              border: 'none',
              borderRadius: '16px',
              height: '100%',
              minHeight: '80px'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: category.color,
                display: 'flex',
                marginRight: '16px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '12px',
                fontSize: '24px',
                color: '#fff'
              }}>
                <img 
                  src={category.icon} 
                  alt={category.label}
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    filter: 'brightness(0) invert(1)' // Makes SVG white
                  }} 
                />
              </div>
              <Text style={{ 
                fontSize: '15px',
                fontWeight: 600,
                color: isDarkMode ? '#fff' : '#000',
              
              }}>
                {category.label}
              </Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    </>
  );

  const openDonationModal = (category) => {
    form.setFieldsValue({ category: category.key });
    setDonationModal(true);
  };

  const GivingHistory = () => (
    <Card 
      style={{ 
        marginTop: 20,
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: 'none',
        borderRadius: '24px',
        overflow: 'hidden'
      }}
      styles={{ body: { padding: '40px 24px' } }}
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
                      <Tag icon={<CalendarOutlined />} style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', border: 'none', color: isDarkMode ? '#999' : '#666' }}>
                        {new Date(donation.date).toLocaleDateString()}
                      </Tag>
                      <Tag icon={<CreditCardOutlined />} style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', border: 'none', color: isDarkMode ? '#999' : '#666' }}>
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
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ color: isDarkMode ? '#fff' : '#000', marginBottom: 12 }}>
            No giving history to display yet
          </Title>
          <Paragraph style={{ color: isDarkMode ? '#999' : '#666', marginBottom: 24, fontSize: '14px' }}>
            Your donations will appear here when you give
          </Paragraph>
          <Button 
            onClick={() => setDonationModal(true)}
            style={{
              background: '#2d7a7a',
              borderColor: '#2d7a7a',
              color: '#fff',
              height: '48px',
              padding: '0 32px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            Make your first donation
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
        padding: '20px 16px',
        background: isDarkMode ? '#121212' : '#f5f5f5'
      }}>
        <Title 
          level={3} 
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000',
            marginBottom: 0,
            fontSize: '24px',
            fontWeight: 700
          }}
        >
          Give
        </Title>
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
          <GivingOptions />
          
          <StatsSection />

          <GivingHistory />
        </>
      )}

      {/* Donation Modal */}
      <Modal
        title={
          <span style={{ color: isDarkMode ? '#fff' : '#000' }}>
            <GiftOutlined style={{ marginRight: 8 }} />
            Make a Donation
          </span>
        }
        open={donationModal}
        onCancel={() => setDonationModal(false)}
        footer={null}
        width={600}
        styles={{
          content: {
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#fff' : '#000'
          },
          header: {
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleDonation}
          size="large"
        >
          <Form.Item
            name="category"
            label={<span style={{ color: isDarkMode ? '#fff' : '#000' }}>Donation Category</span>}
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select 
              placeholder="Choose what you'd like to support"
              style={{
                background: isDarkMode ? '#121212' : '#ffffff',
              }}
            >
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
                label={<span style={{ color: isDarkMode ? '#fff' : '#000' }}>Amount ({currency})</span>}
                rules={[
                  { required: true, message: 'Please enter amount' },
                  { type: 'number', min: 1, message: 'Amount must be at least 1' }
                ]}
              >
                <InputNumber
                  style={{ 
                    width: '100%',
                    background: isDarkMode ? '#121212' : '#ffffff',
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                  prefix={getCurrencySymbol(currency)}
                  placeholder="0.00"
                  step={0.01}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={{ color: isDarkMode ? '#fff' : '#000' }}>Currency</span>}>
                <Select 
                  value={currency} 
                  onChange={setCurrency}
                  placeholder="Select currency"
                  style={{
                    background: isDarkMode ? '#121212' : '#ffffff',
                  }}
                >
                  {Object.entries(currencies).map(([code, info]) => (
                    <Option key={code} value={code}>
                      {info.symbol} {code} {info.paystack ? <CreditCardOutlined /> : <BankOutlined />}
                    </Option>
                  ))}
                </Select>
                <div style={{ fontSize: '11px', color: isDarkMode ? '#888' : '#666', marginTop: '4px' }}>
                  <CreditCardOutlined /> = Paystack supported, <BankOutlined /> = Contact church for other payment methods
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="note"
            label={<span style={{ color: isDarkMode ? '#fff' : '#000' }}>Note (Optional)</span>}
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Add a personal note or prayer request..."
              style={{
                background: isDarkMode ? '#121212' : '#ffffff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#2a2a2a' : '#d9d9d9'
              }}
            />
          </Form.Item>

          <Alert
            message="Secure Payment via Paystack"
            description="Your payment will be processed securely via Paystack. You will receive an email confirmation after your donation is processed."
            type="success"
            showIcon
            style={{ 
              marginBottom: 16,
              background: isDarkMode ? 'rgba(45, 122, 122, 0.1)' : '#f6ffed',
              border: `1px solid ${isDarkMode ? 'rgba(45, 122, 122, 0.3)' : '#b7eb8f'}`,
              color: isDarkMode ? '#fff' : '#000'
            }}
          />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => setDonationModal(false)}
                style={{
                  background: isDarkMode ? '#2a2a2a' : '#f5f5f5',
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#2a2a2a' : '#d9d9d9'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                size="large"
                style={{
                  background: '#2d7a7a',
                  borderColor: '#2d7a7a'
                }}
              >
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
