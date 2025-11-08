import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Typography,
  Alert,
  Progress,
} from 'antd';
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;

const PasswordChangeModal = ({ visible, onClose, isFirstTime = false }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: [] };
    
    const checks = [
      { test: /.{8,}/, message: 'At least 8 characters' },
      { test: /[A-Z]/, message: 'At least one uppercase letter' },
      { test: /[a-z]/, message: 'At least one lowercase letter' },
      { test: /\d/, message: 'At least one number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'At least one special character' },
    ];

    const passed = checks.filter(check => check.test.test(password));
    const failed = checks.filter(check => !check.test.test(password));
    
    return {
      score: (passed.length / checks.length) * 100,
      passed: passed.map(check => check.message),
      failed: failed.map(check => check.message),
    };
  };

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, passed: [], failed: [] });

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getStrengthColor = (score) => {
    if (score < 40) return '#ff4d4f';
    if (score < 80) return '#faad14';
    return '#4A7C23';
  };

  const getStrengthText = (score) => {
    if (score < 40) return 'Weak';
    if (score < 80) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await apiClient.changePassword(
        values.currentPassword,
        values.newPassword,
        isFirstTime
      );

      if (response.success) {
        message.success('Password changed successfully! 🔒');
        form.resetFields();
        onClose();
      } else {
        message.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      message.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            {isFirstTime ? 'Set Your New Password 🔐' : 'Change Password 🔐'}
          </Title>
          <Text type="secondary">
            {isFirstTime 
              ? 'Please create a secure password for your account'
              : 'Update your password to keep your account secure'
            }
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
      closable={!isFirstTime} // Don't allow closing if it's first time
      maskClosable={!isFirstTime}
    >
      {isFirstTime && (
        <Alert
          message="Password Change Required"
          description="For security reasons, you must change your temporary password before continuing."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        {!isFirstTime && (
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please enter your current password' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your current password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        )}

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters long' },
            {
              validator: (_, value) => {
                const strength = checkPasswordStrength(value);
                if (strength.score < 60) {
                  return Promise.reject(new Error('Password is too weak'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your new password"
            onChange={handlePasswordChange}
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        {/* Password Strength Indicator */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong>Password Strength:</Text>
            <Text style={{ color: getStrengthColor(passwordStrength.score) }}>
              {getStrengthText(passwordStrength.score)}
            </Text>
          </div>
          <Progress
            percent={passwordStrength.score}
            strokeColor={getStrengthColor(passwordStrength.score)}
            showInfo={false}
            size="small"
          />
          
          {/* Password Requirements */}
          <div style={{ marginTop: 12 }}>
            {passwordStrength.passed.map((requirement, index) => (
              <div key={index} style={{ color: '#4A7C23', fontSize: '12px' }}>
                <CheckCircleOutlined /> {requirement}
              </div>
            ))}
            {passwordStrength.failed.map((requirement, index) => (
              <div key={index} style={{ color: '#ff4d4f', fontSize: '12px' }}>
                <CloseCircleOutlined /> {requirement}
              </div>
            ))}
          </div>
        </div>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your new password"
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            disabled={passwordStrength.score < 60}
          >
            {isFirstTime ? 'Set New Password' : 'Change Password'}
          </Button>
          
          {!isFirstTime && (
            <Button
              type="text"
              onClick={onClose}
              style={{ marginTop: 8 }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default PasswordChangeModal;