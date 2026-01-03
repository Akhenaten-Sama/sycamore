import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
} from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import apiClient from '../services/apiClient';

const { Option } = Select;

const EditKinModal = ({ visible, onClose, user }) => {
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
        message.success(response.message || 'Next of kin details updated successfully!');
        onClose();
      } else {
        const errorMessage = response?.message || 'Failed to update next of kin details. Please try again.';
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Next of kin update error:', error);
      const errorMessage = error.message || 'Failed to update next of kin details. Please try again.';
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
      styles={modalStyles}
      style={{ top: 20 }}
    >
      <div style={{ background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text, marginBottom: '8px' }}>
            Edit Next of Kin Details
          </h2>
          <p style={{ fontSize: '14px', color: isDarkMode ? '#888' : '#666', margin: 0 }}>
            Update your emergency contact information
          </p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            kinName: user?.kinName || '',
            kinPhone: user?.kinPhone || '',
            kinRelationship: user?.kinRelationship || '',
          }}
        >
          <Form.Item 
            name="kinName" 
            label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Next of kin's name</span>} 
            rules={[{ required: true, message: 'Next of kin name is required' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input 
              placeholder="Enter full name" 
              style={{ 
                background: isDarkMode ? '#121212' : '#ffffff', 
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, 
                borderRadius: '8px', 
                padding: '12px 16px', 
                color: colors.text, 
                height: '48px' 
              }} 
            />
          </Form.Item>
          
          <Form.Item 
            name="kinPhone" 
            label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Phone number</span>} 
            rules={[{ required: true, message: 'Phone number is required' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input 
              placeholder="Enter phone number" 
              style={{ 
                background: isDarkMode ? '#121212' : '#ffffff', 
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, 
                borderRadius: '8px', 
                padding: '12px 16px', 
                color: colors.text, 
                height: '48px' 
              }} 
            />
          </Form.Item>
          
          <Form.Item 
            name="kinRelationship" 
            label={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Relationship</span>} 
            rules={[{ required: true, message: 'Relationship is required' }]}
            style={{ marginBottom: '24px' }}
          >
            <Select 
              placeholder="Relationship to next of kin" 
              style={{ width: '100%', height: '48px' }} 
              dropdownStyle={{ background: isDarkMode ? '#1a1a1a' : '#ffffff' }}
            >
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
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button 
              onClick={onClose} 
              style={{ 
                height: '48px', 
                borderRadius: '8px', 
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`, 
                background: 'transparent', 
                color: colors.text, 
                fontSize: '16px', 
                fontWeight: '500',
                minWidth: '100px'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              style={{ 
                height: '48px', 
                borderRadius: '8px', 
                background: '#2d7a7a', 
                borderColor: '#2d7a7a', 
                color: '#ffffff', 
                fontSize: '16px', 
                fontWeight: '500',
                minWidth: '100px'
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditKinModal;
