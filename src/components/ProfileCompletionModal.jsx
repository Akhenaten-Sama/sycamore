import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import apiClient from '../services/apiClient';

const { Option } = Select;

const ProfileCompletionModal = ({ visible, onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const profileData = {
        userId: user?.memberId || user?.id || user?._id,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        address: values.address,
        kinName: values.kinName,
        kinPhone: values.kinPhone,
        kinRelationship: values.kinRelationship,
      };

      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );

      const response = await apiClient.updateProfile(cleanData);
      
      if (response && response.success !== false) {
        await updateProfile(cleanData);
        message.success(response.message || 'Profile updated successfully!');
        onClose();
      } else {
        const errorMessage = response?.message || 'Failed to update profile. Please try again.';
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modalStyles = {
    content: {
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      padding: '24px',
    },
    header: {
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderBottom: 'none',
      padding: '24px 24px 16px',
    },
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
      closable={false}
      styles={modalStyles}
      style={{ top: 20 }}
    >
      <div style={{ background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text, marginBottom: '8px' }}>
            Profile Completion
          </h2>
          <p style={{ fontSize: '14px', color: isDarkMode ? '#888' : '#666', margin: 0 }}>
            Help us serve you better by completing your profile
          </p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            phone: user?.phone || '',
            dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
            address: user?.address || '',
            kinName: user?.kinName || '',
            kinPhone: user?.kinPhone || '',
            kinRelationship: user?.kinRelationship || '',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '16px' }}>
              Personal Details
            </h3>
            <Form.Item name="phone" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Phone number</span>} rules={[{ required: true, message: 'Phone number is required' }]} style={{ marginBottom: '16px' }}>
              <Input placeholder="Enter phone number" style={{ background: isDarkMode ? '#121212' : '#ffffff', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 16px', color: colors.text, height: '48px' }} />
            </Form.Item>
            <Form.Item name="dateOfBirth" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Date of birth</span>} rules={[{ required: true, message: 'Date of birth is required' }]} style={{ marginBottom: '16px' }}>
              <DatePicker placeholder="dd/mm/yyyy" format="DD/MM/YYYY" style={{ width: '100%', background: isDarkMode ? '#121212' : '#ffffff', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 16px', height: '48px' }} disabledDate={(current) => current && current > dayjs().endOf('day')} />
            </Form.Item>
            <Form.Item name="address" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Address</span>} rules={[{ required: true, message: 'Address is required' }]} style={{ marginBottom: 0 }}>
              <Input placeholder="Enter your address" style={{ background: isDarkMode ? '#121212' : '#ffffff', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 16px', color: colors.text, height: '48px' }} />
            </Form.Item>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '16px' }}>Next of Kin Details</h3>
            <Form.Item name="kinName" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Next of kin's name</span>} style={{ marginBottom: '16px' }}>
              <Input placeholder="Enter full name" style={{ background: isDarkMode ? '#121212' : '#ffffff', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 16px', color: colors.text, height: '48px' }} />
            </Form.Item>
            <Form.Item name="kinPhone" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Phone number</span>} style={{ marginBottom: '16px' }}>
              <Input placeholder="Enter phone number" style={{ background: isDarkMode ? '#121212' : '#ffffff', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 16px', color: colors.text, height: '48px' }} />
            </Form.Item>
            <Form.Item name="kinRelationship" label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Relationship</span>} style={{ marginBottom: 0 }}>
              <Select placeholder="Relationship to next of kin" style={{ width: '100%', height: '48px' }} dropdownStyle={{ background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
                <Option value="Parent">Parent</Option>
                <Option value="Spouse">Spouse</Option>
                <Option value="Sibling">Sibling</Option>
                <Option value="Brother">Brother</Option>
                <Option value="Sister">Sister</Option>
                <Option value="Child">Child</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <Button onClick={onClose} style={{ flex: 1, height: '48px', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, background: 'transparent', color: colors.text, fontSize: '16px', fontWeight: '500' }}>
              Skip for now
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 1, height: '48px', borderRadius: '8px', background: '#2d7a7a', borderColor: '#2d7a7a', color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
              Complete Profile
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ProfileCompletionModal;
