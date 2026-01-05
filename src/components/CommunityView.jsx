import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Tabs,
  List,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Space,
  Tag,
  Image,
  Modal,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
  PictureOutlined,
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  SendOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ApiClient from '../services/apiClient';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const getColors = (isDarkMode) => ({
  background: isDarkMode ? '#121212' : '#f0f2f5',
  cardBackground: isDarkMode ? '#1e1e1e' : '#ffffff',
  text: isDarkMode ? '#ffffff' : '#000000',
  textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
  border: isDarkMode ? '#2a2a2a' : '#f0f0f0',
  hover: isDarkMode ? '#2a2a2a' : '#fafafa',
  inputBackground: isDarkMode ? '#121212' : '#ffffff',
  divider: isDarkMode ? '#2a2a2a' : '#e8e8e8'
});

const CommunityView = ({ communityId, onBack }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [postForm] = Form.useForm();
  const [submittingPost, setSubmittingPost] = useState(false);

  useEffect(() => {
    if (communityId) {
      loadCommunityDetails();
    }
  }, [communityId]);

  const loadCommunityDetails = async () => {
    try {
      setLoading(true);
      console.log('Loading community details for ID:', communityId);
      
      const response = await ApiClient.getCommunityDetails(communityId);
      console.log('Community details response:', response);
      
      if (response?.data) {
        setCommunity(response.data);
      } else {
        message.error('Failed to load community details');
      }
    } catch (error) {
      console.error('Error loading community details:', error);
      message.error('Failed to load community details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (values) => {
    if (!user) {
      message.warning('Please sign in to post');
      return;
    }

    try {
      setSubmittingPost(true);
      const memberIdToUse = user.memberId || user.id;
      
      const postData = {
        content: values.content,
        authorId: memberIdToUse,
        type: 'post'
      };

      const response = await ApiClient.createCommunityPost(communityId, postData);
      
      if (response?.data) {
        // Add new post to the beginning of the posts list
        setCommunity(prev => ({
          ...prev,
          posts: [response.data, ...prev.posts]
        }));
        postForm.resetFields();
        message.success('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Failed to create post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) {
      message.warning('Please sign in to like posts');
      return;
    }

    try {
      const memberIdToUse = user.memberId || user.id;
      const response = await ApiClient.likeCommunityPost(postId, memberIdToUse);
      
      if (response?.data) {
        // Update local state based on server response
        setCommunity(prev => ({
          ...prev,
          posts: prev.posts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes: response.data.liked 
                    ? [...(post.likes || []), memberIdToUse]
                    : (post.likes || []).filter(id => id !== memberIdToUse),
                  isLiked: response.data.liked 
                }
              : post
          )
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      message.error('Failed to like post');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading community...</div>
      </div>
    );
  }

  if (!community) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Empty description="Community not found" />
        <Button onClick={onBack} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </div>
    );
  }

  const PostItem = ({ post }) => {
    const memberIdToUse = user?.memberId || user?.id;
    const isLiked = post.likes?.includes(memberIdToUse) || post.isLiked;
    const [showComments, setShowComments] = useState(false);
    
    return (
      <div style={{ background: colors.cardBackground, marginBottom: 8, padding: 16, borderRadius: 8 }}>
        <List.Item
          actions={[
            <LikeButton
              likes={post.likes?.length || 0}
              isLiked={isLiked}
              onLike={async () => {
                await handleLikePost(post.id);
                return { 
                  likes: post.likes?.length || 0,
                  isLiked: !isLiked
                };
              }}
              targetId={post.id}
              showText={false}
              style={{ color: colors.text }}
            />,
            <Button 
              type="text" 
              icon={<MessageOutlined />}
              onClick={() => setShowComments(!showComments)}
              style={{ color: colors.text }}
            >
              {post.comments?.length || 0}
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={post.author?.avatar} icon={<UserOutlined />} />}
            title={
              <Space>
                <Text strong style={{ color: colors.text }}>{post.author?.name}</Text>
                <Text style={{ fontSize: '12px', color: colors.textSecondary }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </Space>
            }
            description={<Paragraph style={{ color: colors.text }}>{post.content}</Paragraph>}
          />
        </List.Item>

        {/* Comments Section */}
        {showComments && (
          <div style={{ marginLeft: 24, marginTop: 8, marginBottom: 16 }}>
            <CommentSection
              targetId={post.id}
              targetType="community_post"
              getComments={async (postId) => {
                // Return existing comments from post object or fetch fresh
                const response = await ApiClient.getCommunityPostComments?.(postId);
                return response || { comments: post.comments || [] };
              }}
              addComment={async (postId, data) => {
                const commentData = {
                  ...data,
                  authorId: memberIdToUse
                };
                const response = await ApiClient.addCommunityPostComment(postId, commentData);
                
                // Update the post in the community state
                setCommunity(prev => ({
                  ...prev,
                  posts: prev.posts.map(p => 
                    p.id === postId 
                      ? { ...p, comments: [...(p.comments || []), response.data || response] }
                      : p
                  )
                }));
                
                return response.data || response;
              }}
              autoRefresh={true}
              refreshInterval={3000}
              showTitle={false}
            />
          </div>
        )}
      </div>
    );
  };

  const MemberItem = ({ member }) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={member.avatar} icon={<UserOutlined />} />}
        title={member.name}
        description={
          <Space>
            <Tag color="blue">{member.role}</Tag>
            <Text type="secondary">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );

  const EventItem = ({ event }) => (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Card.Meta
        title={event.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>{event.description}</Paragraph>
            <Space>
              <Text type="secondary">
                <CalendarOutlined /> {new Date(event.date).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                <EnvironmentOutlined /> {event.location}
              </Text>
              <Text type="secondary">
                <TeamOutlined /> {event.attendees} attending
              </Text>
            </Space>
          </div>
        }
      />
    </Card>
  );

  const MediaItem = ({ item }) => (
    <Col xs={12} sm={8} md={6} key={item.id}>
      <Card
        size="small"
        hoverable
        cover={
          <div style={{ height: 120, background: `url(${item.thumbnail}) center/cover` }}>
            {item.type === 'video' && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: 24
              }}>
                ▶️
              </div>
            )}
          </div>
        }
      >
        <Card.Meta
          title={<Text ellipsis>{item.title}</Text>}
          description={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          }
        />
      </Card>
    </Col>
  );

  const tabItems = [
    {
      key: 'posts',
      label: `Discussion (${community.posts?.length || 0})`,
      children: (
        <div>
          {user && (
            <Card style={{ marginBottom: 16, background: colors.cardBackground, borderColor: colors.border }}>
              <Form form={postForm} onFinish={handleCreatePost}>
                <Form.Item 
                  name="content" 
                  rules={[{ required: true, message: 'Please enter your post content' }]}
                >
                  <TextArea 
                    placeholder="What's on your mind?" 
                    rows={3}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    style={{ 
                      background: colors.inputBackground, 
                      color: colors.text,
                      borderColor: colors.border 
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    loading={submittingPost}
                  >
                    Post
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
          
          <List
            dataSource={community.posts || []}
            renderItem={(post) => <PostItem post={post} />}
            locale={{ emptyText: 'No posts yet. Be the first to start a discussion!' }}
            style={{ background: colors.background }}
          />
        </div>
      ),
    },
    {
      key: 'members',
      label: `Members (${community.memberCount})`,
      children: (
        <List
          dataSource={community.members || []}
          renderItem={(member) => <MemberItem member={member} />}
          locale={{ emptyText: 'No members found' }}
          style={{ background: colors.background }}
        />
      ),
    },
    {
      key: 'events',
      label: `Events (${community.events?.length || 0})`,
      children: (
        <div>
          {community.events?.length > 0 ? (
            community.events.map(event => <EventItem key={event.id} event={event} />)
          ) : (
            <Empty description="No upcoming events" />
          )}
        </div>
      ),
    },
    {
      key: 'media',
      label: `Media (${community.media?.length || 0})`,
      children: (
        <Row gutter={[8, 8]}>
          {community.media?.length > 0 ? (
            community.media.map(item => <MediaItem key={item.id} item={item} />)
          ) : (
            <Col span={24}>
              <Empty description="No media shared yet" />
            </Col>
          )}
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px', background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          style={{ marginBottom: 16, background: colors.cardBackground, color: colors.text, borderColor: colors.border }}
        >
          Back to Communities
        </Button>
        
        <Card style={{ background: colors.cardBackground, borderColor: colors.border }}>
          {community.coverImage && (
            <div 
              style={{ 
                height: 200, 
                background: `url(${community.coverImage}) center/cover`,
                marginBottom: 16,
                borderRadius: 8
              }} 
            />
          )}
          
          <Title level={2} style={{ color: colors.text }}>{community.name}</Title>
          <Paragraph style={{ color: colors.text }}>{community.description}</Paragraph>
          
          <Row gutter={16}>
            <Col>
              <Statistic 
                title={<span style={{ color: colors.textSecondary }}>Members</span>}
                value={community.memberCount} 
                prefix={<TeamOutlined />}
                valueStyle={{ color: colors.text }}
              />
            </Col>
            <Col>
              <Statistic 
                title={<span style={{ color: colors.textSecondary }}>Posts</span>}
                value={community.posts?.length || 0} 
                prefix={<MessageOutlined />}
                valueStyle={{ color: colors.text }}
              />
            </Col>
            <Col>
              <Statistic 
                title={<span style={{ color: colors.textSecondary }}>Events</span>}
                value={community.events?.length || 0} 
                prefix={<CalendarOutlined />}
                valueStyle={{ color: colors.text }}
              />
            </Col>
          </Row>
          
          <div style={{ marginTop: 16 }}>
            <Space>
              <Tag color="blue">{community.category}</Tag>
              {community.isPrivate && <Tag color="orange">Private</Tag>}
              <Text style={{ color: colors.textSecondary }}>
                Created {new Date(community.createdAt).toLocaleDateString()}
              </Text>
            </Space>
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        style={{ color: colors.text }}
      />
    </div>
  );
};

export default CommunityView;
