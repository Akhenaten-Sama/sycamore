import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Image,
  List,
  Avatar,
  Input,
  Form,
  message,
  Space,
  Tag,
  Divider,
  Tabs,
  Empty,
  Spin,
  Badge,
  Carousel,
} from 'antd';
import {
  PlayCircleOutlined,
  PictureOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  SendOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MediaGallery = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getMedia();
      setMedia(response || mockMediaData);
    } catch (error) {
      console.error('Failed to load media:', error);
      setMedia(mockMediaData);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (mediaId) => {
    try {
      const response = await ApiClient.getMediaComments(mediaId);
      setComments(response || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  const handleLike = async (mediaId) => {
    if (!user) {
      message.warning('Please sign in to like media');
      return;
    }

    try {
      await ApiClient.likeMedia(mediaId);
      // Update local state
      setMedia(prev => prev.map(item => 
        item.id === mediaId 
          ? { ...item, likes: item.likes + 1, isLiked: true }
          : item
      ));
      
      if (selectedMedia && selectedMedia.id === mediaId) {
        setSelectedMedia(prev => ({
          ...prev,
          likes: prev.likes + 1,
          isLiked: true
        }));
      }
    } catch (error) {
      message.error('Failed to like media');
    }
  };

  const handleComment = async (values) => {
    if (!user) {
      message.warning('Please sign in to comment');
      return;
    }

    try {
      const memberIdToUse = user.memberId || user.id;
      const newComment = {
        content: values.comment,
        mediaId: selectedMedia.id,
        userId: memberIdToUse,
      };

      await ApiClient.addMediaComment(newComment);
      
      // Add comment to local state
      const comment = {
        id: Date.now(),
        content: values.comment,
        author: `${user.firstName} ${user.lastName}`,
        avatar: user.profilePicture,
        timestamp: new Date().toISOString(),
      };
      
      setComments(prev => [comment, ...prev]);
      commentForm.resetFields();
      message.success('Comment added successfully!');
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  const openMediaView = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setViewModal(true);
    loadComments(mediaItem.id);
  };

  const MediaCard = ({ item }) => (
    <Card
      hoverable
      cover={
        <div 
          style={{ 
            position: 'relative', 
            height: 200,
            background: `url(${item.thumbnail}) center/cover`,
            cursor: 'pointer'
          }}
          onClick={() => openMediaView(item)}
        >
          {item.type === 'video' && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 48,
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              <PlayCircleOutlined />
            </div>
          )}
          <div 
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <Tag color={item.type === 'video' ? 'red' : 'blue'}>
              {item.type === 'video' ? <PlayCircleOutlined /> : <PictureOutlined />}
              {item.type}
            </Tag>
          </div>
        </div>
      }
      actions={[
        <Button 
          type="text" 
          icon={item.isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          onClick={() => handleLike(item.id)}
        >
          {item.likes}
        </Button>,
        <Button 
          type="text" 
          icon={<MessageOutlined />}
          onClick={() => openMediaView(item)}
        >
          {item.comments}
        </Button>,
        <Button 
          type="text" 
          icon={<ShareAltOutlined />}
          onClick={() => shareMedia(item)}
        >
          Share
        </Button>
      ]}
    >
      <Card.Meta
        title={item.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {item.description}
            </Paragraph>
            <Space>
              <Text type="secondary">
                <CalendarOutlined /> {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                <EyeOutlined /> {item.views} views
              </Text>
            </Space>
          </div>
        }
      />
    </Card>
  );

  const shareMedia = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  const filterMedia = (type) => {
    if (type === 'all') return media;
    return media.filter(item => item.type === type);
  };

  const tabItems = [
    {
      key: 'all',
      label: `All Media (${media.length})`,
      children: (
        <Row gutter={[16, 16]}>
          {filterMedia('all').map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <MediaCard item={item} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: 'photos',
      label: `Photos (${filterMedia('photo').length})`,
      children: (
        <Row gutter={[16, 16]}>
          {filterMedia('photo').map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <MediaCard item={item} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: 'videos',
      label: `Videos (${filterMedia('video').length})`,
      children: (
        <Row gutter={[16, 16]}>
          {filterMedia('video').map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <MediaCard item={item} />
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>📸 Media Gallery</Title>
        <Paragraph type="secondary">
          Explore photos and videos from church events and services
        </Paragraph>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          size="large"
        />
      )}

      {/* Media View Modal */}
      <Modal
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 800 }}
        centered
      >
        {selectedMedia && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  style={{ width: '100%', maxHeight: 400 }}
                  poster={selectedMedia.thumbnail}
                />
              ) : (
                <Image 
                  src={selectedMedia.url} 
                  style={{ maxWidth: '100%' }}
                  preview={false}
                />
              )}
            </div>

            <Title level={3}>{selectedMedia.title}</Title>
            <Paragraph>{selectedMedia.description}</Paragraph>

            <Space wrap style={{ marginBottom: 16 }}>
              <Tag>
                <CalendarOutlined /> {new Date(selectedMedia.date).toLocaleDateString()}
              </Tag>
              <Tag>
                <EyeOutlined /> {selectedMedia.views} views
              </Tag>
              <Button 
                type="text" 
                icon={selectedMedia.isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={() => handleLike(selectedMedia.id)}
              >
                {selectedMedia.likes}
              </Button>
              <Button 
                type="text" 
                icon={<ShareAltOutlined />}
                onClick={() => shareMedia(selectedMedia)}
              >
                Share
              </Button>
            </Space>

            <Divider />

            <Title level={4}>Comments ({comments.length})</Title>

            {user && (
              <Form
                form={commentForm}
                onFinish={handleComment}
                style={{ marginBottom: 16 }}
              >
                <Form.Item name="comment" rules={[{ required: true, message: 'Please enter a comment' }]}>
                  <TextArea 
                    placeholder="Write a comment..." 
                    rows={2}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Post Comment
                  </Button>
                </Form.Item>
              </Form>
            )}

            <List
              dataSource={comments}
              renderItem={comment => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={comment.avatar} icon={<UserOutlined />} />}
                    title={comment.author}
                    description={
                      <div>
                        <Paragraph>{comment.content}</Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(comment.timestamp).toLocaleString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

// Mock data
const mockMediaData = [
  {
    id: 1,
    title: "Sunday Worship Service",
    description: "Beautiful worship service with amazing testimonies and powerful preaching.",
    type: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    date: "2025-09-08",
    views: 245,
    likes: 45,
    comments: 12,
    isLiked: false
  },
  {
    id: 2,
    title: "Youth Conference 2025",
    description: "Highlights from our annual youth conference with inspiring speakers and worship.",
    type: "photo",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80",
    date: "2025-09-05",
    views: 189,
    likes: 67,
    comments: 23,
    isLiked: true
  },
  {
    id: 3,
    title: "Baptism Ceremony",
    description: "Celebrating new believers as they take this important step of faith.",
    type: "photo",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80",
    date: "2025-09-01",
    views: 156,
    likes: 89,
    comments: 34,
    isLiked: false
  }
];

export default MediaGallery;
