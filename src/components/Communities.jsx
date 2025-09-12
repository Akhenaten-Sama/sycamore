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
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Communities = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [joinModal, setJoinModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [createModal, setCreateModal] = useState(false);
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
      const response = await ApiClient.getCommunities();
      console.log('All communities API response:', response);
      // Check if response has data property (API response) or is direct array
      const communitiesData = response?.data || response || [];
      setCommunities(Array.isArray(communitiesData) ? communitiesData : []);
      
      // If user is logged in, also get available communities from member endpoint
      if (user) {
        try {
          const memberResponse = await ApiClient.getMemberCommunities(user.memberId || user.id);
          console.log('Member communities response:', memberResponse);
          if (memberResponse?.availableCommunities) {
            // Combine member communities with available communities for complete list
            const allCommunities = [
              ...(memberResponse.memberCommunities || []),
              ...(memberResponse.availableCommunities || [])
            ];
            console.log('Combined communities:', allCommunities);
            setCommunities(allCommunities);
          }
        } catch (error) {
          console.error('Failed to load member-specific communities:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load communities:', error);
      // Fallback to mock data
      setCommunities(mockCommunities);
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

  const handleJoinCommunity = async (communityId) => {
    if (!user) {
      message.warning('Please sign in to join communities');
      return;
    }

    try {
      const memberIdToUse = user.memberId || user.id;
      await ApiClient.joinCommunity(communityId, memberIdToUse);
      message.success('Successfully joined the community!');
      loadCommunities();
      loadMyCommunities();
      setJoinModal(false);
    } catch (error) {
      message.error('Failed to join community. Please try again.');
    }
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

  const CommunityCard = ({ community, showJoinButton = true }) => {
    // Check if community is joined either from myCommunities array or from community.isJoined property
    const isJoined = community.isJoined || myCommunities.some(c => c.id === community.id || c._id === community._id);
    
    return (
      <Card
        hoverable
        cover={
          <div 
            style={{ 
              height: 200, 
              background: `linear-gradient(45deg, ${community.color || '#1890ff'}, ${community.color || '#722ed1'})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
            }}
          >
            <TeamOutlined />
          </div>
        }
        actions={showJoinButton ? [
          <Button 
            type={isJoined ? "default" : "primary"}
            icon={isJoined ? <MessageOutlined /> : <PlusOutlined />}
            onClick={() => isJoined ? viewCommunity(community) : handleJoinCommunity(community.id)}
            disabled={!user}
          >
            {isJoined ? 'View' : 'Join'}
          </Button>
        ] : [
          <Button 
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => viewCommunity(community)}
          >
            Open
          </Button>
        ]}
      >
        <Card.Meta
          title={community.name}
          description={
            <div>
              <Paragraph ellipsis={{ rows: 2 }}>
                {community.description}
              </Paragraph>
              <Space wrap>
                <Tag color="blue">
                  <UserOutlined /> {community.memberCount || 0} members
                </Tag>
                <Tag color="green">
                  <EnvironmentOutlined /> {community.category}
                </Tag>
              </Space>
            </div>
          }
        />
      </Card>
    );
  };

  const viewCommunity = (community) => {
    navigate(`/communities/${community.id || community._id}`);
  };

  const AllCommunities = () => (
    <div>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={3}>Church Communities</Title>
        <Paragraph type="secondary">
          Join communities to connect with fellow believers and grow together
        </Paragraph>
        {user && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModal(true)}
          >
            Create Community
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
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
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={3}>My Communities</Title>
        <Paragraph type="secondary">
          Communities you're part of
        </Paragraph>
      </div>

      {Array.isArray(myCommunities) && myCommunities.length > 0 ? (
        <Row gutter={[16, 16]}>
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
        >
          <Button type="primary" onClick={() => setActiveTab('all')}>
            Explore Communities
          </Button>
        </Empty>
      )}
    </div>
  );

  const [activeTab, setActiveTab] = useState('all');

  const tabItems = [
    {
      key: 'all',
      label: 'All Communities',
      children: <AllCommunities />,
    },
    {
      key: 'mine',
      label: `My Communities${myCommunities.length > 0 ? ` (${myCommunities.length})` : ''}`,
      children: <MyCommunities />,
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
        size="large"
      />

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
    color: "#52c41a"
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
