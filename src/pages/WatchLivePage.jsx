import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Alert,
  Spin,
  Empty,
  Row,
  Col,
  Avatar,
  message,
  Input,
  Form,
  List,
  Divider
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  UserOutlined,
  SendOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  FullscreenOutlined,
  MessageOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import ApiClient from '../services/apiClient';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const WatchLivePage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [liveEvents, setLiveEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [viewersCount, setViewersCount] = useState(0);

  useEffect(() => {
    loadLiveEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadComments();
      // Simulate live viewer count updates
      const interval = setInterval(() => {
        setViewersCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedEvent]);

  const loadLiveEvents = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getEvents('upcoming', 1, 50);
      
      if (response?.data) {
        // Filter events that have streaming enabled and are currently live or scheduled
        const now = new Date();
        const liveOrUpcoming = response.data.filter(event => {
          const eventDate = new Date(event.date);
          const timeDiff = eventDate.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          
          return event.streamUrl && (
            event.isLive || 
            (hoursDiff >= -2 && hoursDiff <= 24) // Live or within 2 hours past to 24 hours future
          );
        });
        
        setLiveEvents(liveOrUpcoming);
        if (liveOrUpcoming.length > 0) {
          setSelectedEvent(liveOrUpcoming[0]);
          setViewersCount(Math.floor(Math.random() * 200) + 50);
        }
      } else {
        // Mock live event for demo
        const mockLiveEvent = {
          id: 'live-1',
          name: 'Sunday Worship Service - Live',
          description: 'Join us for our live worship service with powerful preaching and inspiring music.',
          date: new Date().toISOString(),
          streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isLive: true,
          category: 'Worship',
          speaker: 'Pastor John Smith'
        };
        setLiveEvents([mockLiveEvent]);
        setSelectedEvent(mockLiveEvent);
        setViewersCount(127);
      }
    } catch (error) {
      console.error('Failed to load live events:', error);
      // Mock data for demo
      const mockLiveEvent = {
        id: 'live-1',
        name: 'Sunday Worship Service - Live',
        description: 'Join us for our live worship service with powerful preaching and inspiring music.',
        date: new Date().toISOString(),
        streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isLive: true,
        category: 'Worship',
        speaker: 'Pastor John Smith'
      };
      setLiveEvents([mockLiveEvent]);
      setSelectedEvent(mockLiveEvent);
      setViewersCount(127);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    // Mock comments for demo
    const mockComments = [
      {
        id: 1,
        user: { name: 'Sarah Johnson', avatar: null },
        comment: 'Praise God! This message is so powerful! 🙏',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 2,
        user: { name: 'Michael Brown', avatar: null },
        comment: 'Watching from Lagos! God bless you Pastor!',
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: 3,
        user: { name: 'Grace Adebayo', avatar: null },
        comment: 'The worship team sounds amazing today! ♪',
        timestamp: new Date(Date.now() - 120000)
      }
    ];
    setComments(mockComments);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setCommentLoading(true);
      
      // In a real app, this would submit to the API
      const comment = {
        id: Date.now(),
        user: { 
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePicture 
        },
        comment: newComment,
        timestamp: new Date()
      };

      setComments(prev => [...prev, comment]);
      setNewComment('');
      message.success('Comment posted!');
    } catch (error) {
      message.error('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        background: colors.background
      }}>
        <Spin size="large" style={{ color: colors.primary }} />
        <Text style={{ marginTop: 16, color: colors.textPrimary }}>Loading live streams...</Text>
      </div>
    );
  }

  if (liveEvents.length === 0) {
    return (
      <div style={{ 
        padding: '24px', 
        background: colors.background, 
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Empty 
          image={<PlayCircleOutlined style={{ fontSize: 64, color: colors.textSecondary }} />}
          description={
            <div>
              <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                No live streams available
              </Text>
              <br />
              <Text style={{ color: colors.textSecondary }}>
                Check back during service times for live content
              </Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background, 
      minHeight: '100vh',
      padding: '16px'
    }}>
      {/* Live Stream Header */}
      <Card 
        style={{ 
          marginBottom: 16,
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
          border: `1px solid ${colors.primary}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#ff4d4f', 
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite'
            }} />
            <Title level={3} style={{ color: colors.primary, margin: 0 }}>
              Live Stream
            </Title>
          </Space>
          <Space>
            <EyeOutlined style={{ color: colors.textSecondary }} />
            <Text style={{ color: colors.textSecondary }}>{viewersCount} watching</Text>
          </Space>
        </div>
      </Card>

      <Row gutter={16}>
        {/* Video Player */}
        <Col xs={24} lg={16}>
          <Card style={{ marginBottom: 16 }}>
            {selectedEvent && (
              <>
                <div style={{ 
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  borderRadius: '8px'
                }}>
                  <iframe
                    src={selectedEvent.streamUrl}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                    title="Live Stream"
                  />
                </div>

                {/* Video Controls */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: 16
                }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={() => setIsPlaying(!isPlaying)}
                      style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button 
                      icon={<FullscreenOutlined />}
                      onClick={toggleFullscreen}
                    >
                      Fullscreen
                    </Button>
                  </Space>
                  
                  <Space>
                    <Button icon={<HeartOutlined />} type="text">
                      Like
                    </Button>
                    <Button icon={<ShareAltOutlined />} type="text">
                      Share
                    </Button>
                  </Space>
                </div>

                {/* Event Info */}
                <Divider />
                <div>
                  <Title level={4} style={{ color: colors.textPrimary, marginBottom: 8 }}>
                    {selectedEvent.name}
                  </Title>
                  <Space style={{ marginBottom: 8 }}>
                    <Tag color="red">LIVE</Tag>
                    <Tag color="blue">{selectedEvent.category}</Tag>
                    <ClockCircleOutlined style={{ color: colors.textSecondary }} />
                    <Text style={{ color: colors.textSecondary }}>
                      Started {dayjs(selectedEvent.date).format('h:mm A')}
                    </Text>
                  </Space>
                  <Paragraph style={{ color: colors.textSecondary }}>
                    {selectedEvent.description}
                  </Paragraph>
                  {selectedEvent.speaker && (
                    <Text style={{ color: colors.textSecondary }}>
                      Speaker: <strong>{selectedEvent.speaker}</strong>
                    </Text>
                  )}
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* Live Chat */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <MessageOutlined />
                <Text>Live Chat</Text>
              </Space>
            }
            style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
          >
            {/* Comments List */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '16px',
              maxHeight: '400px'
            }}>
              <List
                dataSource={comments}
                renderItem={comment => (
                  <List.Item style={{ padding: '8px 0', border: 'none' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={comment.user.avatar} 
                          icon={<UserOutlined />}
                          size={32}
                        />
                      }
                      title={
                        <Space>
                          <Text strong style={{ fontSize: 12 }}>
                            {comment.user.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            {dayjs(comment.timestamp).format('h:mm A')}
                          </Text>
                        </Space>
                      }
                      description={
                        <Text style={{ fontSize: 12, color: colors.textPrimary }}>
                          {comment.comment}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            {/* Comment Input */}
            {user && (
              <div style={{ padding: '16px', borderTop: `1px solid ${colors.border}` }}>
                <Form onFinish={handleSubmitComment}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type a message..."
                      onPressEnter={handleSubmitComment}
                      maxLength={200}
                    />
                    <Button 
                      type="primary"
                      htmlType="submit"
                      loading={commentLoading}
                      icon={<SendOutlined />}
                      style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                    />
                  </Space.Compact>
                </Form>
              </div>
            )}
            
            {!user && (
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <Text type="secondary">Please log in to participate in chat</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WatchLivePage;