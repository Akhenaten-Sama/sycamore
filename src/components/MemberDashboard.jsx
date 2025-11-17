import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Statistic,
  Progress,
  List,
  Badge,
  Tag,
  Timeline,
  Button,
  Space,
  Tabs,
  Divider,
  Calendar,
  Alert,
  Spin,
  Empty,
} from 'antd';
import {
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
  HeartOutlined,
  CheckOutlined,
  StarOutlined,
  GiftOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';

const { Title, Text, Paragraph } = Typography;

const MemberDashboard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState('mobile');
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [memberStats, setMemberStats] = useState({
    attendanceStreak: 0,
    devotionalStreak: 0,
    totalAttendance: 0,
    totalDonations: 0,
    tasksCompleted: 0,
    communitiesJoined: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [memberJourney, setMemberJourney] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) setScreenSize('desktop');
      else if (width >= 768) setScreenSize('tablet');
      else setScreenSize('mobile');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      loadMemberData();
    }
  }, [user]);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Loading member data for:', { 
        userId: user.id, 
        memberId: user.memberId,
        usingMemberId: user.memberId || user.id
      });
      
      // Use memberId if available, fallback to userId
      const memberIdToUse = user.memberId || user.id;
      
      // Load member statistics and devotional stats in parallel
      const [stats, devotionalStats, activity, tasks, journey] = await Promise.all([
        ApiClient.getMemberStats(memberIdToUse),
        ApiClient.getDevotionalStats(memberIdToUse),
        ApiClient.getMemberActivity(memberIdToUse),
        ApiClient.getMemberTasks(memberIdToUse),
        ApiClient.getMemberJourney(memberIdToUse)
      ]);

      // Combine stats with devotional data
      const combinedStats = {
        ...(stats || memberStats),
        devotionalStreak: devotionalStats?.currentStreak || 0
      };
      
      setMemberStats(combinedStats);
      setRecentActivity(activity || []);
      setUpcomingTasks(tasks || []);
      setMemberJourney(journey || []);
    } catch (error) {
      console.error('Failed to load member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileSection = () => (
    <Card style={{
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      border: isDarkMode ? 'none' : '1px solid #e0e0e0'
    }}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={24} md={8} lg={6} xl={6}>
          <div style={{ textAlign: 'center' }}>
            <Avatar 
              size={80} 
              src={user?.profilePicture} 
              icon={<UserOutlined />}
              style={{ 
                marginBottom: 16,
                backgroundColor: '#5a4a7a'
              }}
            />
            <Title level={3} style={{ margin: 0, color: colors.text }}>
              {user?.firstName} {user?.lastName}
            </Title>
            <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>
              Member since {new Date(user?.memberSince || user?.createdAt).getFullYear()}
            </Text>
            <div style={{ marginTop: 16 }}>
              <Tag color="blue">{user?.membershipType || 'Regular Member'}</Tag>
              {user?.team && <Tag color="green">Team: {user.team}</Tag>}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={16} lg={18} xl={18}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Statistic
                title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Attendance Streak</span>}
                value={memberStats.attendanceStreak}
                prefix={<FireOutlined />}
                suffix="weeks"
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Statistic
                title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Devotional Streak</span>}
                value={memberStats.devotionalStreak}
                prefix={<BookOutlined />}
                suffix="days"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  const StatsSection = () => (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: isDarkMode ? 'none' : '1px solid #e0e0e0'
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Total Attendance</span>}
            value={memberStats.totalAttendance}
            prefix={<CalendarOutlined />}
            valueStyle={{ fontSize: 18, color: colors.text }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: isDarkMode ? 'none' : '1px solid #e0e0e0'
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Tasks Completed</span>}
            value={memberStats.tasksCompleted}
            prefix={<CheckOutlined />}
            valueStyle={{ fontSize: 18, color: '#4A7C23' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: isDarkMode ? 'none' : '1px solid #e0e0e0'
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Communities</span>}
            value={memberStats.communitiesJoined}
            prefix={<TeamOutlined />}
            valueStyle={{ fontSize: 18, color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: isDarkMode ? 'none' : '1px solid #e0e0e0'
        }}>
          <Statistic
            title={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Total Giving</span>}
            value={memberStats.totalDonations}
            prefix="$"
            precision={2}
            valueStyle={{ fontSize: 18, color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const JourneySection = () => (
    <Card 
      title={<span style={{ color: colors.text }}><TrophyOutlined /> My Sycamore Journey</span>}
      style={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: isDarkMode ? 'none' : '1px solid #e0e0e0'
      }}
      headStyle={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
      }}
    >
      {memberJourney.length > 0 ? (
        <Timeline>
          {memberJourney.map((milestone, index) => (
            <Timeline.Item 
              key={index}
              color={milestone.completed ? 'green' : 'blue'}
              dot={milestone.completed ? <CheckOutlined /> : <ClockCircleOutlined />}
            >
              <div>
                <Text strong style={{ color: colors.text }}>{milestone.title}</Text>
                <br />
                <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>{milestone.description}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12, color: isDarkMode ? '#888' : '#666' }}>
                  {milestone.date && new Date(milestone.date).toLocaleDateString()}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty 
          description={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Your Sycamore journey will be tracked here as you participate in church activities</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const TasksSection = () => (
    <Card 
      title={<span style={{ color: colors.text }}><CheckOutlined /> Upcoming Tasks</span>}
      style={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: isDarkMode ? 'none' : '1px solid #e0e0e0'
      }}
      headStyle={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
      }}
    >
      {upcomingTasks.length > 0 ? (
        <List
          dataSource={upcomingTasks}
          renderItem={task => (
            <List.Item
              style={{
                borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
              }}
              actions={[
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => markTaskComplete(task.id)}
                  style={{
                    background: '#4a9d9d',
                    borderColor: '#4a9d9d'
                  }}
                >
                  Complete
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#5a4a7a' }} />}
                title={<span style={{ color: colors.text }}>{task.title}</span>}
                description={
                  <div>
                    <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>{task.description}</Text>
                    <br />
                    <Tag color="orange">Due: {new Date(task.dueDate).toLocaleDateString()}</Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description={<span style={{ color: isDarkMode ? '#888' : '#666' }}>No pending tasks</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const ActivitySection = () => (
    <Card 
      title={<span style={{ color: colors.text }}>Recent Activity</span>}
      style={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: isDarkMode ? 'none' : '1px solid #e0e0e0'
      }}
      headStyle={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
      }}
    >
      {recentActivity.length > 0 ? (
        <Timeline>
          {recentActivity.slice(0, 10).map((activity, index) => (
            <Timeline.Item key={index} color="blue">
              <div>
                <Text strong style={{ color: colors.text }}>{activity.action}</Text>
                <br />
                <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>{activity.description}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12, color: isDarkMode ? '#888' : '#666' }}>
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty 
          description={<span style={{ color: isDarkMode ? '#888' : '#666' }}>Your activities will appear here</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const markTaskComplete = async (taskId) => {
    try {
      await ApiClient.completeTask(taskId);
      loadMemberData(); // Refresh data
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: '24px' }}>
          <ProfileSection />
          <Divider style={{ borderColor: isDarkMode ? '#2a2a2a' : '#e0e0e0' }} />
          <StatsSection />
          {/* Desktop layout: Show more content in overview */}
          {screenSize === 'desktop' && (
            <>
              <Divider style={{ borderColor: isDarkMode ? '#2a2a2a' : '#e0e0e0' }} />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <JourneySection />
                </Col>
                <Col span={12}>
                  <TasksSection />
                </Col>
              </Row>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'journey',
      label: 'Sycamore Journey',
      children: (
        <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: '24px' }}>
          <JourneySection />
        </div>
      ),
    },
    {
      key: 'tasks',
      label: 'My Tasks',
      children: (
        <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: '24px' }}>
          <TasksSection />
        </div>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      children: (
        <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: '24px' }}>
          <ActivitySection />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px 0',
        background: colors.background,
        minHeight: '100vh'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: colors.text }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: screenSize === 'mobile' ? '0 16px' : '0 24px', 
      maxWidth: screenSize === 'desktop' ? '1200px' : '100%',
      margin: '0 auto',
      background: colors.background,
      minHeight: '100vh'
    }}>
      <Tabs 
        items={tabItems}
        centered={screenSize === 'mobile'}
        size="large"
        style={{ marginTop: 16 }}
        tabPosition={screenSize === 'desktop' ? 'left' : 'top'}
        tabBarStyle={{
          color: colors.text
        }}
      />
    </div>
  );
};

export default MemberDashboard;
