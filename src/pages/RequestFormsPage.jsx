import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Space, Empty, Modal, Form, Input, Select, DatePicker, message, Spin } from 'antd';
import { 
  FormOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  TeamOutlined,
  BookOutlined,
  CarOutlined,
  HomeOutlined,
  PlusOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import ApiClient from '../services/apiClient';
import { getColors } from '../styles/colors';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const RequestFormsPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const colors = getColors(isDarkMode);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // Get category from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');

  // Icon mapping for form categories
  const iconMap = {
    'Spiritual': <HeartOutlined />,
    'Events': <CalendarOutlined />,
    'Community': <TeamOutlined />,
    'Support': <CarOutlined />,
    'Facilities': <HomeOutlined />,
    'Counseling': <BookOutlined />,
    'General': <FormOutlined />
  };

  // Color mapping for form categories
  const colorMap = {
    'Spiritual': colors.error,
    'Events': colors.primary,
    'Community': colors.success,
    'Support': colors.warning,
    'Facilities': colors.info,
    'Counseling': colors.secondary,
    'General': colors.primary
  };

  useEffect(() => {
    loadForms();
  }, [category]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getForms(category);
      console.log('Forms response:', response);
      
      if (response?.success && response?.data) {
        // Map the backend data to include icons and colors
        const mappedForms = response.data.map(form => ({
          ...form,
          icon: iconMap[form.category] || iconMap['General'],
          color: colorMap[form.category] || colorMap['General']
        }));
        setForms(mappedForms);
      } else {
        setForms([]);
      }
    } catch (error) {
      console.error('Failed to load forms:', error);
      message.error('Failed to load request forms');
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (formData) => {
    setSelectedForm(formData);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    if (!user) {
      message.error('Please sign in to submit a request');
      return;
    }

    setSubmitting(true);
    try {
      const submissionData = {
        responses: values,
        submitterName: `${user.firstName} ${user.lastName}`,
        submitterEmail: user.email
      };

      const response = await ApiClient.submitForm(selectedForm.id, submissionData);
      
      if (response?.success) {
        message.success('Request submitted successfully! We will contact you soon.');
        setIsModalVisible(false);
        form.resetFields();
      } else {
        throw new Error(response?.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const FormCard = ({ formData }) => (
    <Card
      hoverable
      style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : colors.mint}`,
        borderRadius: '12px',
        height: '100%'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '40px', 
          color: formData.color,
          marginBottom: '12px'
        }}>
          {formData.icon}
        </div>
        <Tag 
          style={{ 
            backgroundColor: formData.color,
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          {formData.category}
        </Tag>
      </div>
      
      <Title level={4} style={{ color: colors.text, textAlign: 'center', marginBottom: '12px' }}>
        {formData.title}
      </Title>
      
      <Paragraph 
        style={{ 
          color: colors.text, 
          opacity: 0.8, 
          textAlign: 'center', 
          marginBottom: '24px',
          minHeight: '60px'
        }}
        ellipsis={{ rows: 3 }}
      >
        {formData.description}
      </Paragraph>
      
      <Button 
        type="primary"
        block
        size="large"
        icon={<SendOutlined />}
        onClick={() => openForm(formData)}
        style={{
          background: '#2d7a7a',
          borderColor: '#2d7a7a',
          borderRadius: '8px',
          fontWeight: 600
        }}
      >
        Submit Request
      </Button>
    </Card>
  );

  const renderFormField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={field.required ? [{ required: true, message: `Please select ${field.label.toLowerCase()}` }] : []}
          >
            <Select placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}>
              {field.options?.map(option => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }] : []}
          >
            <TextArea rows={4} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
      case 'date':
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={field.required ? [{ required: true, message: `Please select ${field.label.toLowerCase()}` }] : []}
          >
            <DatePicker style={{ width: '100%' }} placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
      case 'email':
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              ...(field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }] : []),
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input type="email" placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
      case 'phone':
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }] : []}
          >
            <Input type="tel" placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }] : []}
          >
            <Input placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
    }
  };

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
            <FormOutlined style={{ marginRight: '8px', color: colors.primary }} />
            Request Forms
          </Title>
          <Paragraph style={{ color: colors.text, opacity: 0.7 }}>
            Please sign in to access and submit request forms.
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
            {category === 'Prayer' ? (
              <><HeartOutlined style={{ marginRight: '8px', color: '#f5222d' }} />Prayer Needs</>
            ) : (
              <><FormOutlined style={{ marginRight: '8px', color: colors.primary }} />Request Forms</>
            )}
          </Title>
          <Paragraph style={{ color: colors.text, opacity: 0.7, margin: 0 }}>
            {category === 'Prayer' 
              ? 'We\'d love to stand in prayer with you. Share your prayer needs here.'
              : 'Need support or help with church events? Submit your request here!'}
          </Paragraph>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: colors.text }}>Loading request forms...</div>
        </div>
      ) : forms.length > 0 ? (
        <Row gutter={[16, 16]}>
          {forms.map(formData => (
            <Col xs={24} sm={12} lg={8} key={formData.id}>
              <FormCard formData={formData} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: colors.text, opacity: 0.7 }}>
              Nothing here yet - check back soon for updates
            </span>
          }
        />
      )}

      {/* Form Modal */}
      <Modal
        title={
          <Space>
            {selectedForm?.icon}
            <span>{selectedForm?.title}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedForm && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <div style={{ marginBottom: '20px' }}>
              <Paragraph style={{ color: colors.text, opacity: 0.7 }}>
                {selectedForm.description}
              </Paragraph>
            </div>

            {selectedForm.fields.map(field => renderFormField(field))}

            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submitting}
                  icon={<SendOutlined />}
                  style={{
                    background: '#2d7a7a',
                    borderColor: '#2d7a7a',
                    fontWeight: 600
                  }}
                >
                  Submit Request
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default RequestFormsPage;
