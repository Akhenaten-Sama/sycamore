import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Checkbox,
  message,
  Typography,
  Space,
  Avatar,
  Tag,
  Alert,
  Divider,
  Row,
  Col,
  Empty,
  Spin
} from 'antd';
import {
  UserAddOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../services/apiClient';
import dayjs from 'dayjs';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';

const { Title, Text, Paragraph } = Typography;

const JuniorChurchCheckInPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadCheckInStatus();
    }
  }, [user]);

  const loadCheckInStatus = async () => {
    try {
      if (!checkInStatus) {
        setLoading(true);
      }
      setRefreshing(true);
      const memberId = user.memberId || user.id;
      const response = await ApiClient.getDailyCheckInStatus(memberId);
      
      if (response?.success) {
        setCheckInStatus(response.data);
        setChildren(response.data.children || []);
        
        // Pre-select children who aren't checked in yet
        const notCheckedIn = response.data.children
          .filter(child => !child.isCheckedIn)
          .map(child => child.childId);
        setSelectedChildren(notCheckedIn);
      }
    } catch (error) {
      console.error('Error loading check-in status:', error);
      message.error('Failed to load children');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckIn = async () => {
    if (selectedChildren.length === 0) {
      message.warning('Please select at least one child to check in');
      return;
    }

    try {
      setLoading(true);
      const memberId = user.memberId || user.id;
      
      const response = await ApiClient.dailyChildCheckIn(memberId, selectedChildren);

      if (response?.success) {
        message.success(response.message || 'Check-in successful!');
        setSelectedChildren([]);
        await loadCheckInStatus(); // Refresh the status
      }
    } catch (error) {
      console.error('Error checking in:', error);
      message.error('Failed to check in children');
    } finally {
      setLoading(false);
    }
  };

  const getClassColor = (className) => {
    const colorMap = {
      nursery: 'pink',
      toddlers: 'blue',
      preschool: 'green',
      elementary: 'purple',
      teens: 'orange'
    };
    return colorMap[className] || 'default';
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    marginBottom: '16px'
  };

  const textStyle = {
    color: colors.text
  };

  if (!user) {
    return (
      <div style={pageStyle}>
        <Alert
          message="Please log in"
          description="You need to be logged in to check in children"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        ...pageStyle,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Spin size="large" style={{ color: colors.primary }} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading children...</Text>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={textStyle}>
            Junior Church Check-In
          </Title>
          <Text style={textStyle}>
            {dayjs().format('dddd, MMMM D, YYYY')}
          </Text>
        </div>

        {/* Summary Card */}
        {checkInStatus && (
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <UserOutlined style={{ fontSize: '24px', color: colors.primary }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong style={{ ...textStyle, fontSize: '20px' }}>
                      {checkInStatus.summary.total}
                    </Text>
                    <br />
                    <Text type="secondary" style={textStyle}>Total Children</Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong style={{ ...textStyle, fontSize: '20px', color: '#52c41a' }}>
                      {checkInStatus.summary.checkedIn}
                    </Text>
                    <br />
                    <Text type="secondary" style={textStyle}>Checked In</Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong style={{ ...textStyle, fontSize: '20px', color: '#faad14' }}>
                      {checkInStatus.summary.notCheckedIn}
                    </Text>
                    <br />
                    <Text type="secondary" style={textStyle}>Not Checked In</Text>
                  </div>
                </div>
              </Col>
            </Row>
            <Divider />
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCheckInStatus}
              loading={refreshing}
              block
            >
              Refresh Status
            </Button>
          </Card>
        )}

        {/* Instructions */}
        <Alert
          message="Daily Check-In"
          description="This check-in is for today's Junior Church service. Select your children below and click 'Check In Now' to register their attendance."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        {/* Children List */}
        <Card 
          title={<Text strong style={textStyle}>Select Children to Check In</Text>}
          style={cardStyle}
        >
          {children.length === 0 ? (
            <Empty
              description={
                <Text style={textStyle}>
                  No children registered. Please add children first.
                </Text>
              }
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {children.map((child) => (
                <Card
                  key={child.childId}
                  size="small"
                  style={{
                    ...cardStyle,
                    backgroundColor: child.isCheckedIn 
                      ? (isDarkMode ? '#1f4d1f' : '#f6ffed')
                      : cardStyle.backgroundColor,
                    borderColor: child.isCheckedIn ? '#52c41a' : colors.border
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <Checkbox
                        checked={child.isCheckedIn || selectedChildren.includes(child.childId)}
                        disabled={child.isCheckedIn}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChildren([...selectedChildren, child.childId]);
                          } else {
                            setSelectedChildren(selectedChildren.filter(id => id !== child.childId));
                          }
                        }}
                        style={{ marginRight: '12px' }}
                      >
                        <Space>
                          <Avatar icon={<UserAddOutlined />} />
                          <div>
                            <Text strong style={textStyle}>
                              {child.firstName} {child.lastName}
                            </Text>
                            <Tag color={getClassColor(child.class)} style={{ marginLeft: '8px' }}>
                              {child.class?.charAt(0).toUpperCase() + child.class?.slice(1)}
                            </Tag>
                            <br />
                            {child.isCheckedIn && (
                              <Text style={{ ...textStyle, fontSize: '12px' }}>
                                ✓ Checked in at {dayjs(child.checkInTime).format('h:mm A')}
                                {child.status === 'picked_up' && (
                                  <> • Picked up at {dayjs(child.pickupTime).format('h:mm A')}</>
                                )}
                              </Text>
                            )}
                            {!child.isCheckedIn && (
                              <Text type="secondary" style={{ ...textStyle, fontSize: '12px' }}>
                                Not checked in yet
                              </Text>
                            )}
                          </div>
                        </Space>
                      </Checkbox>
                    </div>
                    {child.isCheckedIn && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        {child.status === 'picked_up' ? 'Picked Up' : 'Present'}
                      </Tag>
                    )}
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </Card>

        {/* Check In Button */}
        {children.length > 0 && selectedChildren.length > 0 && (
          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={handleCheckIn}
            loading={loading}
            block
            style={{
              marginTop: '16px',
              height: '50px',
              fontSize: '16px',
              backgroundColor: colors.primary,
              borderColor: colors.primary
            }}
          >
            Check In {selectedChildren.length} Child{selectedChildren.length > 1 ? 'ren' : ''} Now
          </Button>
        )}

        {/* Info Box */}
        <Card style={{ ...cardStyle, marginTop: '24px' }}>
          <Title level={5} style={textStyle}>How It Works</Title>
          <Paragraph style={textStyle}>
            <ul>
              <li>This check-in registers your children for today's Junior Church service</li>
              <li>Children will appear on the Live Dashboard for church staff</li>
              <li>You can check in multiple children at once</li>
              <li>Already checked-in children are marked with a green checkmark</li>
              <li>Staff will handle pickup when the service ends</li>
            </ul>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default JuniorChurchCheckInPage;
