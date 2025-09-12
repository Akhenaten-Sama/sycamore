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
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../services/apiClient';
import colors from '../styles/colors';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const RequestFormsPage = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getForms();
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
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.mint}`,
        borderRadius: '12px',
        height: '100%'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '48px', 
          color: formData.color,
          marginBottom: '12px'
        }}>
          {formData.icon}
        </div>
        <Tag 
          style={{ 
            backgroundColor: formData.color,
            color: colors.textWhite,
            border: 'none',
            borderRadius: '12px'
          }}
        >
          {formData.category}
        </Tag>
      </div>
      
      <Title level={4} style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: '8px' }}>
        {formData.title}
      </Title>
      
      <Paragraph style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: '20px' }}>
        {formData.description}
      </Paragraph>
      
      <Button 
        type="primary"
        block
        style={{
          backgroundColor: formData.color,
          borderColor: formData.color,
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
        onClick={() => openForm(formData)}
      >
        Open Form
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
        <Card style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Title level={3} style={{ color: colors.textPrimary }}>
            <FormOutlined style={{ marginRight: '8px', color: colors.primary }} />
            Request Forms
          </Title>
          <Paragraph style={{ color: colors.textSecondary }}>
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
    <div style={{ background: colors.background, minHeight: '100vh', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ color: colors.textPrimary }}>
          <FormOutlined style={{ marginRight: '8px', color: colors.primary }} />
          Request Forms
        </Title>
        <Paragraph style={{ color: colors.textSecondary, maxWidth: '600px', margin: '0 auto' }}>
          Submit requests for prayer, events, counseling, and more. Our team will review and respond to your request promptly.
        </Paragraph>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: colors.textPrimary }}>Loading request forms...</div>
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
          description="No request forms available" 
          style={{ color: colors.textSecondary }}
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
              <Paragraph style={{ color: colors.textSecondary }}>
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
                  style={{
                    backgroundColor: selectedForm.color,
                    borderColor: selectedForm.color
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
