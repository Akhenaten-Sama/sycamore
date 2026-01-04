import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  message,
  List,
  Badge,
  Divider,
  Tabs,
  Empty,
  Spin,
  Segmented,
} from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  UserOutlined,
  MessageOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import ApiClient from '../services/apiClient';
import CommunityManagement from './CommunityManagement';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Communities = ({ user }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [joinModal, setJoinModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [managementModal, setManagementModal] = useState(false);
  const [managementCommunity, setManagementCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('All Communities');
  const [form] = Form.useForm();

  useEffect(() => {
    loadCommunities();
    if (user) {
      loadMyCommunities();
    }
  }, [user]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      // Use the type=all parameter to get all communities with proper isJoined flags
      const response = await ApiClient.getCommunities('all');
      console.log('All communities API response:', response);
      // Check if response has data property (API response) or is direct array
      const communitiesData = response?.data || response || [];
      setCommunities(Array.isArray(communitiesData) ? communitiesData : []);
    } catch (error) {
      console.error('Failed to load communities:', error);
      // Fallback to empty array
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyCommunities = async () => {
    try {
      // Load user's communities
      const response = await ApiClient.getMemberCommunities(user.memberId || user.id);
      console.log('My communities API response:', response);
      // The API returns an object with memberCommunities property
      const myCommunitiesData = response?.memberCommunities || response?.data || response || [];
      console.log('My communities data:', myCommunitiesData);
      setMyCommunities(Array.isArray(myCommunitiesData) ? myCommunitiesData : []);
    } catch (error) {
      console.error('Failed to load my communities:', error);
    }
  };

  const handleJoinCommunity = async (communityId, community) => {
    if (!user) {
      message.warning('Please sign in to join communities');
      return;
    }

    try {
      const memberIdToUse = user.memberId || user.id;
      
      // Check if community requires approval
      if (community.isPrivate && !community.canJoin) {
        // Send join request
        await ApiClient.requestJoinCommunity(communityId);
        message.success('Join request sent! The community leader will review your request.');
      } else {
        // Direct join
        await ApiClient.joinCommunity(communityId, memberIdToUse);
        message.success('Successfully joined the community!');
      }
      
      loadCommunities();
      loadMyCommunities();
      setJoinModal(false);
    } catch (error) {
      console.error('Join community error:', error);
      message.error(error.message || 'Failed to join community. Please try again.');
    }
  };

  const handleCancelJoinRequest = async (communityId) => {
    try {
      await ApiClient.cancelJoinRequest(communityId);
      message.success('Join request cancelled');
      loadCommunities();
    } catch (error) {
      console.error('Cancel join request error:', error);
      message.error('Failed to cancel join request');
    }
  };

  const openManagement = (community) => {
    setManagementCommunity(community);
    setManagementModal(true);
  };

  const handleCreateCommunity = async (values) => {
    try {
      await ApiClient.createCommunity(values);
      message.success('Community created successfully!');
      form.resetFields();
      setCreateModal(false);
      loadCommunities();
    } catch (error) {
      message.error('Failed to create community. Please try again.');
    }
  };

  const getCommunityBackground = (type) => {
    const backgrounds = {
      'life-group': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      'ministry': 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
      'team': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      'study': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      'custom': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
    };
    return backgrounds[type] || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
  };

  const CommunityCard = ({ community, showJoinButton = true }) => {
    // Use the isJoined flag from the API response directly
    const isJoined = community.isJoined === true;
    const isInvited = community.isInvited;
    const hasJoinRequest = community.hasJoinRequest;
    const canJoin = community.canJoin !== false; // Default to true if not specified
    
    const getCategoryIcon = () => {
      if (community.category === 'Ministry' || community.type === 'Ministry') {
        return { icon: <CheckCircleOutlined />, color: isDarkMode ? '#9b59b6' : '#8e44ad', text: 'Ministry' };
      }
      if (community.category === 'Study' || community.type === 'Study') {
        return { icon: <CheckCircleOutlined />, color: isDarkMode ? '#e67e22' : '#d35400', text: 'Study' };
      }
      return { icon: <CheckCircleOutlined />, color: isDarkMode ? '#9b59b6' : '#8e44ad', text: community.category || community.type || 'Community' };
    };

    const categoryInfo = getCategoryIcon();
    
    return (
      <Card
        hoverable
        style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover Image */}
        <div 
          style={{ 
            height: 180,
            backgroundImage: `url(${community.image || getCommunityBackground(community.type)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden'
          }}
        >
          {/* Dark overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!community.image && (
              <TeamOutlined 
                style={{ 
                  fontSize: '48px', 
                  color: 'rgba(255, 255, 255, 0.8)'
                }} 
              />
            )}
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: '16px' }}>
          {/* Community Name */}
          <Title level={4} style={{ 
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: 700
          }}>
            {community.name}
          </Title>

          {/* Description */}
          <Paragraph 
            ellipsis={{ rows: 2 }}
            style={{ 
              color: isDarkMode ? '#999' : '#666',
              fontSize: '13px',
              marginBottom: '12px',
              minHeight: '40px'
            }}
          >
            {community.description}
          </Paragraph>

          {/* Member Count and Category */}
          <Space size={12} style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              color: isDarkMode ? '#999' : '#666',
              fontSize: '12px'
            }}>
              <UserOutlined style={{ fontSize: '14px' }} />
              <Text style={{ color: isDarkMode ? '#999' : '#666', fontSize: '12px' }}>
                {community.memberCount || 0} members
              </Text>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '12px'
            }}>
              {React.cloneElement(categoryInfo.icon, { 
                style: { color: categoryInfo.color, fontSize: '14px' } 
              })}
              <Text style={{ color: categoryInfo.color, fontSize: '12px', fontWeight: 500 }}>
                {categoryInfo.text}
              </Text>
            </div>
          </Space>

          {/* Join Button */}
          {showJoinButton && (
            <Button
              block
              size="large"
              type="primary"
              disabled={!user || isJoined}
              onClick={() => !isJoined && handleJoinCommunity(community.id || community._id, community)}
              style={{
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                height: '48px',
                background: isJoined 
                  ? (isDarkMode ? '#2a4a4a' : '#4a9d9d')
                  : (isDarkMode ? '#2d7a7a' : '#2d7a7a'),
                borderColor: isJoined 
                  ? (isDarkMode ? '#2a4a4a' : '#4a9d9d')
                  : (isDarkMode ? '#2d7a7a' : '#2d7a7a')
              }}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          )}
          {!showJoinButton && (
            <Button
              block
              size="large"
              type="primary"
              onClick={() => viewCommunity(community)}
              style={{
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                height: '48px',
                background: isDarkMode ? '#2d7a7a' : '#2d7a7a',
                borderColor: isDarkMode ? '#2d7a7a' : '#2d7a7a'
              }}
            >
              Open
            </Button>
          )}
        </div>
      </Card>
    );
  };

  const viewCommunity = (community) => {
    navigate(`/communities/${community.id || community._id}`);
  };

  const AllCommunities = () => (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[12, 12]}>
          {Array.isArray(communities) && communities.length > 0 ? (
            communities.map(community => (
              <Col xs={24} sm={12} lg={8} key={community.id || community._id}>
                <CommunityCard community={community} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty 
                description="No communities available"
                style={{ margin: '50px 0' }}
              />
            </Col>
          )}
        </Row>
      )}
    </div>
  );

  const MyCommunities = () => (
    <div>
      {Array.isArray(myCommunities) && myCommunities.length > 0 ? (
        <Row gutter={[12, 12]}>
          {myCommunities.map(community => (
            <Col xs={24} sm={12} lg={8} key={community.id || community._id}>
              <CommunityCard community={community} showJoinButton={false} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          description="You haven't joined any communities yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '50px 0' }}
        >
          <Button 
            type="primary" 
            onClick={() => setActiveTab('All Communities')}
            style={{
              borderRadius: '8px',
              background: isDarkMode ? '#2d7a7a' : '#2d7a7a',
              borderColor: isDarkMode ? '#2d7a7a' : '#2d7a7a'
            }}
          >
            Explore Communities
          </Button>
        </Empty>
      )}
    </div>
  );

  return (
    <div style={{ 
      padding: 0,
      background: isDarkMode ? '#121212' : '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Title, Subtitle, and Tabs */}
      <div style={{ 
        padding: '16px',
        background: isDarkMode ? '#121212' : '#f5f5f5',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ marginBottom: 16, }}>
          <Title 
            level={3} 
            style={{ 
              color: isDarkMode ? '#ffffff' : '#000000',
              marginBottom: 8 
            }}
          >
            Church Communities
          </Title>
          <Paragraph 
            style={{ 
              color: isDarkMode ? '#999' : '#666',
              fontSize: '14px',
              marginBottom: 0
            }}
          >
            Life is better together! Connect, share, and do life with your church family.
          </Paragraph>
        </div>

        {/* Segmented Control Tabs */}
        <Segmented
          value={activeTab}
          onChange={setActiveTab}
          options={['All Communities', 'My Communities']}
          block
          size="large"
          style={{
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            padding: '4px',
            borderRadius: '50px',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#d9d9d9'}`
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 16px' }}>
        {activeTab === 'All Communities' ? <AllCommunities /> : <MyCommunities />}
      </div>

      {/* Create Community Modal */}
      <Modal
        title="Create New Community"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCommunity}
          size="large"
        >
          <Form.Item
            name="name"
            label="Community Name"
            rules={[{ required: true, message: 'Please enter community name' }]}
          >
            <Input placeholder="e.g., Young Adults Fellowship" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the purpose and focus of this community..."
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter category' }]}
          >
            <Input placeholder="e.g., Fellowship, Study Group, Ministry" />
          </Form.Item>

          <Form.Item
            name="meetingTime"
            label="Meeting Time (Optional)"
          >
            <Input placeholder="e.g., Sundays at 6 PM" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Community
              </Button>
              <Button onClick={() => setCreateModal(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Community Management Modal */}
      <CommunityManagement
        visible={managementModal}
        onClose={() => setManagementModal(false)}
        communityId={managementCommunity?.id}
        communityName={managementCommunity?.name}
      />
    </div>
  );
};

// Mock data for fallback
const mockCommunities = [
  {
    id: 1,
    name: "Young Adults Fellowship",
    description: "A vibrant community for young adults (18-35) to connect, grow in faith, and serve together.",
    category: "Fellowship",
    memberCount: 45,
    leader: "Pastor Mike",
    meetingTime: "Sundays 6 PM",
    color: "#1890ff"
  },
  {
    id: 2,
    name: "Bible Study Group",
    description: "Deep dive into God's word through systematic Bible study and discussion.",
    category: "Study Group",
    memberCount: 28,
    leader: "Elder Sarah",
    meetingTime: "Wednesdays 7 PM",
    color: "#4A7C23"
  },
  {
    id: 3,
    name: "Worship Ministry",
    description: "Musicians and singers who lead the congregation in worship every Sunday.",
    category: "Ministry",
    memberCount: 15,
    leader: "Music Director",
    meetingTime: "Saturdays 4 PM",
    color: "#722ed1"
  },
  {
    id: 4,
    name: "Children's Ministry",
    description: "Dedicated to nurturing and teaching our youngest members in the ways of Christ.",
    category: "Ministry",
    memberCount: 32,
    leader: "Teacher Anna",
    meetingTime: "Sundays 9 AM",
    color: "#fa8c16"
  }
];

export default Communities;
