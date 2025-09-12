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
    <Card>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={24} md={8} lg={6} xl={6}>
          <div style={{ textAlign: 'center' }}>
            <Avatar 
              size={80} 
              src={user?.profilePicture} 
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={3} style={{ margin: 0 }}>
              {user?.firstName} {user?.lastName}
            </Title>
            <Text type="secondary">
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
                title="Attendance Streak"
                value={memberStats.attendanceStreak}
                prefix={<FireOutlined />}
                suffix="weeks"
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Statistic
                title="Devotional Streak"
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
        <Card>
          <Statistic
            title="Total Attendance"
            value={memberStats.totalAttendance}
            prefix={<CalendarOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card>
          <Statistic
            title="Tasks Completed"
            value={memberStats.tasksCompleted}
            prefix={<CheckOutlined />}
            valueStyle={{ fontSize: 18, color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card>
          <Statistic
            title="Communities"
            value={memberStats.communitiesJoined}
            prefix={<TeamOutlined />}
            valueStyle={{ fontSize: 18, color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={4} xl={4}>
        <Card>
          <Statistic
            title="Total Giving"
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
    <Card title={<><TrophyOutlined /> My Faith Journey</> }>
      {memberJourney.length > 0 ? (
        <Timeline>
          {memberJourney.map((milestone, index) => (
            <Timeline.Item 
              key={index}
              color={milestone.completed ? 'green' : 'blue'}
              dot={milestone.completed ? <CheckOutlined /> : <ClockCircleOutlined />}
            >
              <div>
                <Text strong>{milestone.title}</Text>
                <br />
                <Text type="secondary">{milestone.description}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {milestone.date && new Date(milestone.date).toLocaleDateString()}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty 
          description="Your faith journey will be tracked here as you participate in church activities"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const TasksSection = () => (
    <Card title={<><CheckOutlined /> Upcoming Tasks</> }>
      {upcomingTasks.length > 0 ? (
        <List
          dataSource={upcomingTasks}
          renderItem={task => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => markTaskComplete(task.id)}
                >
                  Complete
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BookOutlined />} />}
                title={task.title}
                description={
                  <div>
                    <Text type="secondary">{task.description}</Text>
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
          description="No pending tasks"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const ActivitySection = () => (
    <Card title="Recent Activity">
      {recentActivity.length > 0 ? (
        <Timeline>
          {recentActivity.slice(0, 10).map((activity, index) => (
            <Timeline.Item key={index} color="blue">
              <div>
                <Text strong>{activity.action}</Text>
                <br />
                <Text type="secondary">{activity.description}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty 
          description="Your activities will appear here"
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
        <div>
          <ProfileSection />
          <Divider />
          <StatsSection />
          {/* Desktop layout: Show more content in overview */}
          {screenSize === 'desktop' && (
            <>
              <Divider />
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
      label: 'Faith Journey',
      children: <JourneySection />,
    },
    {
      key: 'tasks',
      label: 'My Tasks',
      children: <TasksSection />,
    },
    {
      key: 'activity',
      label: 'Activity',
      children: <ActivitySection />,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: screenSize === 'mobile' ? '0 16px' : '0 24px', 
      maxWidth: screenSize === 'desktop' ? '1200px' : '100%',
      margin: '0 auto'
    }}>
      <Tabs 
        items={tabItems}
        centered={screenSize === 'mobile'}
        size="large"
        style={{ marginTop: 16 }}
        tabPosition={screenSize === 'desktop' ? 'left' : 'top'}
      />
    </div>
  );
};

export default MemberDashboard;
