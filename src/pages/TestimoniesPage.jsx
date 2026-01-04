import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Space, Empty, Modal, Form, Input, Select, message, Spin, Divider } from 'antd';
import { 
  HeartOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ApiClient from '../services/apiClient';
import { getColors } from '../styles/colors';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TestimoniesPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTestimonies();
  }, [user]);

  const loadTestimonies = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getTestimonies(1, 50, user?.memberId || user?.id);
      
      if (response?.success && response?.data) {
        setTestimonies(response.data);
      } else if (Array.isArray(response)) {
        setTestimonies(response);
      } else {
        setTestimonies([]);
      }
    } catch (error) {
      console.error('Failed to load testimonies:', error);
      message.error('Failed to load testimonies');
      setTestimonies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!user) {
      message.error('Please sign in to submit a testimony');
      return;
    }

    setSubmitting(true);
    try {
      const testimonyData = {
        title: values.title,
        testimony: values.testimony,
        category: values.category,
        submittedBy: user.memberId || user.id,
        submitterName: `${user.firstName} ${user.lastName}`,
        submitterEmail: user.email,
        isPublic: true
      };

      const response = await ApiClient.submitTestimony(testimonyData);
      
      if (response?.success) {
        message.success('Testimony submitted successfully! It will be reviewed by our team.');
        setIsModalVisible(false);
        form.resetFields();
        loadTestimonies();
      } else {
        throw new Error(response?.error || 'Failed to submit testimony');
      }
    } catch (error) {
      console.error('Testimony submission error:', error);
      message.error(error.message || 'Failed to submit testimony. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Healing': '#52c41a',
      'Financial Breakthrough': '#1890ff',
      'Salvation': '#722ed1',
      'Deliverance': '#f5222d',
      'Answered Prayer': '#faad14',
      'General': '#8c8c8c'
    };
    return colors[category] || colors['General'];
  };

  const TestimonyCard = ({ testimony }) => (
    <Card
      hoverable
      style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`,
        borderRadius: '12px',
        height: '100%'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Tag 
            style={{ 
              backgroundColor: getCategoryColor(testimony.category),
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            {testimony.category}
          </Tag>
          {testimony.isApproved ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Approved
            </Tag>
          ) : (
            <Tag color="warning" icon={<ClockCircleOutlined />}>
              Pending Review
            </Tag>
          )}
        </div>
        
        <Title level={4} style={{ color: colors.text, marginBottom: '8px' }}>
          {testimony.title}
        </Title>
        
        <Paragraph 
          style={{ 
            color: colors.text, 
            opacity: 0.8,
            marginBottom: '12px',
            whiteSpace: 'pre-wrap'
          }}
          ellipsis={{ rows: 4, expandable: true, symbol: 'Read more' }}
        >
          {testimony.testimony}
        </Paragraph>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: colors.text, opacity: 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <UserOutlined />
          <Text style={{ color: colors.text, opacity: 0.6, fontSize: '12px' }}>
            {testimony.submitterName}
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarOutlined />
          <Text style={{ color: colors.text, opacity: 0.6, fontSize: '12px' }}>
            {new Date(testimony.createdAt).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );

  if (!user) {
    return (
      <div style={{ 
        background: colors.background, 
        minHeight: '100vh', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card 
          style={{ 
            textAlign: 'center', 
            maxWidth: '400px',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
          }}
        >
          <Title level={3} style={{ color: colors.text }}>
            <HeartOutlined style={{ marginRight: '8px', color: colors.primary }} />
            Testimonies
          </Title>
          <Paragraph style={{ color: colors.text, opacity: 0.7 }}>
            Please sign in to view and submit testimonies.
          </Paragraph>
          <Button type="primary" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background, 
      minHeight: '100vh', 
      padding: '16px',
      paddingBottom: '80px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <Title level={2} style={{ color: colors.text, marginBottom: '4px' }}>
            <HeartOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
            Praise Reports
          </Title>
          <Paragraph style={{ color: colors.text, opacity: 0.7, margin: 0 }}>
            Let your story encourage others. Share what God is doing in your life here.
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size="large"
        >
          Share your praise report
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: colors.text }}>Loading testimonies...</div>
        </div>
      ) : testimonies.length > 0 ? (
        <Row gutter={[16, 16]}>
          {testimonies.map(testimony => (
            <Col xs={24} sm={12} lg={8} key={testimony._id}>
              <TestimonyCard testimony={testimony} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: colors.text, opacity: 0.7 }}>
              No testimonies yet. Be the first to share your testimony!
            </span>
          }
        >
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Share Your Testimony
          </Button>
        </Empty>
      )}

      {/* Submit Testimony Modal */}
      <Modal
        title={
          <Space>
            <HeartOutlined style={{ color: '#f5222d' }} />
            <span>Share Your Praise Report</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Paragraph style={{ color: colors.text, opacity: 0.7, marginBottom: '20px' }}>
            Your story matters! Share how God has worked in your life, and we'll review it before sharing it with your church family.
          </Paragraph>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title for your testimony' }]}
          >
            <Input placeholder="e.g., Healed from Cancer, Financial Breakthrough" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select a category">
              <Option value="Healing">Healing</Option>
              <Option value="Financial Breakthrough">Financial Breakthrough</Option>
              <Option value="Salvation">Salvation</Option>
              <Option value="Deliverance">Deliverance</Option>
              <Option value="Answered Prayer">Answered Prayer</Option>
              <Option value="General">General</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="testimony"
            label="Your Testimony"
            rules={[
              { required: true, message: 'Please share your testimony' },
              { min: 50, message: 'Please share at least 50 characters' }
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="Share your testimony in detail. What happened? How did God work in your life?" 
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitting}
                icon={<PlusOutlined />}
              >
                Share your story
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestimoniesPage;
