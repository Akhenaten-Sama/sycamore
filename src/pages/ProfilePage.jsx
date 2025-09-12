import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, Avatar, Space, Divider, Row, Col, message } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CalendarOutlined, StarOutlined, IdcardOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import colors from '../styles/colors';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio
    });
  };

  const handleSave = async (values) => {
    try {
      await updateProfile(values);
      setEditing(false);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  if (!user) {
    return (
      <Card style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={3}>Please sign in to view your profile</Title>
      </Card>
    );
  }

  return (
    <div style={{ background: colors.background, minHeight: '100vh', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: colors.textPrimary }}>
          <IdcardOutlined style={{ marginRight: '8px', color: colors.primary }} />
          My Profile
        </Title>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card 
            style={{ 
              textAlign: 'center',
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.mint}`,
              borderRadius: '12px'
            }}
          >
            <Avatar 
              size={120} 
              src={user.profilePicture} 
              icon={<UserOutlined />}
              style={{ 
                marginBottom: 16,
                border: `3px solid ${colors.primary}`,
                backgroundColor: colors.primary
              }}
            />
            <Title level={4} style={{ color: colors.textPrimary }}>
              {user.firstName} {user.lastName}
            </Title>
            <Text type="secondary" style={{ color: colors.textSecondary }}>
              {user.email}
            </Text>
            <Divider style={{ borderColor: colors.mint }} />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: colors.textPrimary }}>
                <strong style={{ color: colors.primary }}>
                  <CalendarOutlined style={{ marginRight: '4px' }} />
                  Member Since:
                </strong> {new Date(user.createdAt || '2025-01-01').toLocaleDateString()}
              </Text>
              <Text style={{ color: colors.textPrimary }}>
                <strong style={{ color: colors.success }}>
                  <StarOutlined style={{ marginRight: '4px' }} />
                  Status:
                </strong> Active Member
              </Text>
              <Text style={{ color: colors.textPrimary }}>
                <strong style={{ color: colors.warning }}>
                  <UserOutlined style={{ marginRight: '4px' }} />
                  Role:
                </strong> {user.role || 'Member'}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card 
            title={
              <span style={{ color: colors.textPrimary }}>
                Personal Information
              </span>
            }
            style={{
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.mint}`,
              borderRadius: '12px'
            }}
            headStyle={{
              backgroundColor: colors.surfaceBackground,
              borderBottom: `1px solid ${colors.mint}`
            }}
            extra={
              !editing ? (
                <Button 
                  icon={<EditOutlined />} 
                  onClick={handleEdit}
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    color: colors.textWhite
                  }}
                >
                  Edit Profile
                </Button>
              ) : null
            }
          >
            {!editing ? (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: colors.primary }}>First Name:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.firstName}</Text>
                </div>
                <div>
                  <Text strong style={{ color: colors.primary }}>Last Name:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.lastName}</Text>
                </div>
                <div>
                  <Text strong style={{ color: colors.primary }}>Email:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.email}</Text>
                </div>
                <div>
                  <Text strong style={{ color: colors.primary }}>Phone:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.phone || 'Not provided'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: colors.primary }}>Address:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.address || 'Not provided'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: colors.primary }}>Bio:</Text>
                  <br />
                  <Text style={{ color: colors.textPrimary }}>{user.bio || 'No bio provided'}</Text>
                </div>
              </Space>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="phone" label="Phone">
                  <Input />
                </Form.Item>

                <Form.Item name="address" label="Address">
                  <Input />
                </Form.Item>

                <Form.Item name="bio" label="Bio">
                  <TextArea rows={4} placeholder="Tell us about yourself..." />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SaveOutlined />}
                      style={{
                        backgroundColor: colors.success,
                        borderColor: colors.success
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      style={{
                        borderColor: colors.textSecondary,
                        color: colors.textSecondary
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
