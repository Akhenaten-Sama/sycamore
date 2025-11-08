import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Progress,
  Typography,
  Card,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  HeartOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

const ProfileCompletionModal = ({ visible, onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();
  const [form] = Form.useForm();

  // Calculate completion percentage
  const calculateCompletion = (userData) => {
    const requiredFields = ['phone', 'dateOfBirth', 'address'];
    const optionalFields = ['maritalStatus', 'emergencyContact'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const completed = allFields.filter(field => {
      if (field === 'emergencyContact') {
        return userData.emergencyContact?.name;
      }
      return userData[field];
    }).length;
    
    return Math.round((completed / allFields.length) * 100);
  };

  const completionPercentage = calculateCompletion(user || {});

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Format the data for the API
      const profileData = {
        phone: values.phone,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        address: values.address,
        maritalStatus: values.maritalStatus,
        emergencyContact: values.emergencyName ? {
          name: values.emergencyName,
          phone: values.emergencyPhone || '',
          relationship: values.emergencyRelationship || 'Emergency Contact'
        } : undefined,
        weddingAnniversary: values.weddingAnniversary?.format('YYYY-MM-DD'),
      };

      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );

      const response = await apiClient.updateProfile(cleanData);
      
      if (response.success) {
        await updateProfile(cleanData);
        message.success('Profile updated successfully! 🎉');
        onClose();
      } else {
        message.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            Complete Your Profile 📝
          </Title>
          <Text type="secondary">
            Help us serve you better by completing your profile
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <div style={{ marginBottom: 24 }}>
        <Text strong>Profile Completion: {completionPercentage}%</Text>
        <Progress 
          percent={completionPercentage} 
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          style={{ marginTop: 8 }}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        initialValues={{
          phone: user?.phone,
          dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
          address: user?.address,
          maritalStatus: user?.maritalStatus || 'single',
          emergencyName: user?.emergencyContact?.name,
          emergencyPhone: user?.emergencyContact?.phone,
          emergencyRelationship: user?.emergencyContact?.relationship,
          weddingAnniversary: user?.weddingAnniversary ? dayjs(user.weddingAnniversary) : undefined,
        }}
      >
        <Card title="📱 Contact Information" style={{ marginBottom: 16 }}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Phone number is required' },
              { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="+1234567890"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Address is required' }]}
          >
            <Input.TextArea
              prefix={<HomeOutlined />}
              placeholder="Your full address"
              rows={3}
            />
          </Form.Item>
        </Card>

        <Card title="👤 Personal Information" style={{ marginBottom: 16 }}>
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Date of birth is required' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select your birth date"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="maritalStatus"
              label="Marital Status"
              style={{ flex: 1 }}
            >
              <Select placeholder="Select status">
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
                <Option value="widowed">Widowed</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.maritalStatus !== currentValues.maritalStatus}
          >
            {({ getFieldValue }) =>
              getFieldValue('maritalStatus') === 'married' ? (
                <Form.Item
                  name="weddingAnniversary"
                  label="Wedding Anniversary"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select anniversary date"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Card>

        <Card title="🚨 Emergency Contact" style={{ marginBottom: 24 }}>
          <Form.Item
            name="emergencyName"
            label="Emergency Contact Name"
          >
            <Input
              prefix={<ContactsOutlined />}
              placeholder="Full name of emergency contact"
            />
          </Form.Item>

          <Space direction="horizontal" style={{ width: '100%' }}>
            <Form.Item
              name="emergencyPhone"
              label="Emergency Contact Phone"
              style={{ flex: 1 }}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Emergency contact phone"
              />
            </Form.Item>

            <Form.Item
              name="emergencyRelationship"
              label="Relationship"
              style={{ flex: 1 }}
            >
              <Select placeholder="Relationship">
                <Option value="Parent">Parent</Option>
                <Option value="Spouse">Spouse</Option>
                <Option value="Sibling">Sibling</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Space>
        </Card>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>
              Skip for Now
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
            >
              Complete Profile
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default ProfileCompletionModal;