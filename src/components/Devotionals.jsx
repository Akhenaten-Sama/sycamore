import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  List,
  Avatar,
  Input,
  Form,
  message,
  Space,
  Tag,
  Divider,
  Calendar,
  Badge,
  Modal,
  Row,
  Col,
  Spin,
  Empty,
  Progress,
  Statistic,
} from 'antd';
import {
  BookOutlined,
  SendOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  FireOutlined,
  CheckOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  TrophyOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import colors from '../styles/colors';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Devotionals = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [devotionals, setDevotionals] = useState([]);
  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm] = Form.useForm();
  const [viewModal, setViewModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);

  useEffect(() => {
    loadDevotionals();
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadDevotionals = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getDevotionals();
      // Check if response has data property (API response) or is direct array
      const devotionalsData = response?.data || response || mockDevotionals;
      setDevotionals(Array.isArray(devotionalsData) ? devotionalsData : mockDevotionals);
    } catch (error) {
      console.error('Failed to load devotionals:', error);
      setDevotionals(mockDevotionals);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await ApiClient.getDevotionalStats(user.memberId || user.id);
      const stats = response?.data || response;
      setStreak(stats?.currentStreak || 0);
      setMonthlyProgress(stats?.completionRate || 0);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadComments = async (devotionalId) => {
    try {
      const response = await ApiClient.getDevotionalComments(devotionalId);
      const commentsData = response?.data || response || [];
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  const handleLike = async (devotionalId) => {
    if (!user) {
      message.warning('Please sign in to like devotionals');
      return;
    }

    try {
      const response = await ApiClient.likeDevotional(devotionalId, user.memberId || user.id);
      const { liked, likeCount } = response?.data || response;
      
      setDevotionals(prev => prev.map(item => 
        item.id === devotionalId 
          ? { ...item, likes: likeCount, isLiked: liked }
          : item
      ));
      
      if (selectedDevotional && selectedDevotional.id === devotionalId) {
        setSelectedDevotional(prev => ({
          ...prev,
          likes: likeCount,
          isLiked: liked
        }));
      }

      message.success(liked ? 'Devotional liked! ❤️' : 'Like removed');
    } catch (error) {
      console.error('Failed to like devotional:', error);
      message.error('Failed to like devotional');
    }
  };

  const handleComment = async (values) => {
    if (!user) {
      message.warning('Please sign in to comment');
      return;
    }

    try {
      const commentData = {
        content: values.comment,
        devotionalId: selectedDevotional.id,
        userId: user.memberId || user.id,
      };

      const response = await ApiClient.addDevotionalComment(commentData);
      
      // Create a local comment object for immediate UI update
      const newComment = {
        id: Date.now(),
        content: values.comment,
        author: `${user.firstName} ${user.lastName}`,
        avatar: user.profilePicture,
        timestamp: new Date().toISOString(),
        userId: user.memberId || user.id
      };
      
      setComments(prev => [newComment, ...prev]);
      commentForm.resetFields();
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('Failed to add comment');
    }
  };

  const markAsRead = async (devotionalId) => {
    if (!user) {
      message.warning('Please sign in to track your progress');
      return;
    }

    try {
      await ApiClient.markDevotionalAsRead(devotionalId, user.memberId || user.id);
      setDevotionals(prev => prev.map(item => 
        item.id === devotionalId 
          ? { ...item, isRead: true }
          : item
      ));
      
      // Update streak and progress
      loadUserStats();
      message.success('Devotional marked as read! 📚');
    } catch (error) {
      message.error('Failed to mark as read');
    }
  };

  const openDevotional = async (devotional) => {
    setSelectedDevotional(devotional);
    setViewModal(true);
    
    // Load comments and likes for the devotional
    await loadComments(devotional.id);
    
    if (user) {
      try {
        const response = await ApiClient.getDevotionalLikes(devotional.id, user.memberId || user.id);
        const { likeCount, isLiked } = response?.data || response;
        
        setSelectedDevotional(prev => ({
          ...prev,
          likes: likeCount,
          isLiked: isLiked
        }));
        
        // Also update in the main list
        setDevotionals(prev => prev.map(item => 
          item.id === devotional.id 
            ? { ...item, likes: likeCount, isLiked: isLiked }
            : item
        ));
      } catch (error) {
        console.error('Failed to load devotional likes:', error);
      }
    }
  };

  const DevotionalCard = ({ devotional }) => (
    <Card
      hoverable
      style={{ 
        marginBottom: 16, 
        cursor: 'pointer',
        borderRadius: 12,
        border: `1px solid ${colors.mint}`,
        boxShadow: `0 2px 8px ${colors.darkBlue}10`,
        backgroundColor: colors.cardBackground
      }}
      onClick={() => openDevotional(devotional)}
      actions={[
        <Button 
          type="text" 
          icon={devotional.isLiked ? <HeartFilled style={{ color: colors.error }} /> : <HeartOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleLike(devotional.id);
          }}
          size="small"
          style={{ color: colors.textSecondary }}
        >
          {devotional.likes || 0}
        </Button>,
        <Button 
          type="text" 
          icon={<MessageOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            openDevotional(devotional);
          }}
          size="small"
          style={{ color: colors.textSecondary }}
        >
          {devotional.comments || 0}
        </Button>,
        <Button 
          type={devotional.isRead ? "default" : "primary"}
          icon={devotional.isRead ? <CheckOutlined /> : <CompassOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            if (devotional.isRead) {
              openDevotional(devotional);
            } else {
              markAsRead(devotional.id);
            }
          }}
          size="small"
          style={{
            backgroundColor: devotional.isRead ? colors.success : colors.primary,
            borderColor: devotional.isRead ? colors.success : colors.primary,
            color: colors.textWhite,
            fontWeight: 'bold'
          }}
        >
          {devotional.isRead ? 'Done' : 'Read'}
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{devotional.title}</span>
            {devotional.isRead && (
              <Badge status="success" text="Completed" />
            )}
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 3 }}>
              {devotional.content}
            </Paragraph>
            <Space wrap style={{ marginTop: 8 }}>
              <Tag color={colors.primary}>
                <CalendarOutlined /> {new Date(devotional.date).toLocaleDateString()}
              </Tag>
              <Tag color={colors.success}>
                <BookOutlined /> {devotional.bibleVerse}
              </Tag>
              <Tag color={colors.warning}>
                <ClockCircleOutlined /> {devotional.readTime} min read
              </Tag>
            </Space>
          </div>
        }
      />
    </Card>
  );

  const StatsSection = () => (
    <Card style={{ 
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
      border: `1px solid ${colors.mint}`,
      borderRadius: 12
    }}>
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Daily Streak"
            value={streak}
            prefix={<FireOutlined />}
            suffix="days"
            valueStyle={{ color: colors.error }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <div>
            <Text strong style={{ color: colors.textPrimary }}>Monthly Progress</Text>
            <Progress 
              percent={monthlyProgress} 
              strokeColor={{
                '0%': colors.primary,
                '100%': colors.success,
              }}
            />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="This Month"
            value={Math.floor(monthlyProgress * 30 / 100)}
            suffix="/ 30"
            valueStyle={{ color: colors.primary }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Total Read"
            value={devotionals.filter(d => d.isRead).length}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: colors.success }}
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: colors.background,
      minHeight: '100vh' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: colors.textPrimary }}>
          <CompassOutlined /> Daily Devotionals
        </Title>
        <Paragraph type="secondary" style={{ color: colors.textSecondary }}>
          Grow closer to God through daily Bible study and reflection
        </Paragraph>
      </div>

      {user && <StatsSection />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {Array.isArray(devotionals) && devotionals.length > 0 ? (
            devotionals.map(devotional => (
              <DevotionalCard key={devotional.id || devotional._id} devotional={devotional} />
            ))
          ) : (
            <Empty 
              description="No devotionals available"
              style={{ margin: '50px 0' }}
            />
          )}
        </div>
      )}

      {/* Devotional View Modal */}
      <Modal
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 700 }}
        centered
      >
        {selectedDevotional && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={2}>{selectedDevotional.title}</Title>
              <Space wrap>
                <Tag color={colors.primary}>
                  <CalendarOutlined /> {new Date(selectedDevotional.date).toLocaleDateString()}
                </Tag>
                <Tag color={colors.success}>
                  <BookOutlined /> {selectedDevotional.bibleVerse}
                </Tag>
                <Tag color={colors.warning}>
                  <ClockCircleOutlined /> {selectedDevotional.readTime} min read
                </Tag>
              </Space>
            </div>

            <Card style={{ 
              marginBottom: 16,
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.mint}`
            }}>
              <Paragraph style={{ 
                fontSize: 16, 
                lineHeight: 1.8,
                color: colors.textPrimary
              }}>
                {selectedDevotional.content}
              </Paragraph>

              {selectedDevotional.bibleText && (
                <div style={{ 
                  background: colors.surfaceBackground, 
                  padding: 16, 
                  borderRadius: 8,
                  marginTop: 16,
                  borderLeft: `4px solid ${colors.primary}`
                }}>
                  <Text italic style={{ color: colors.textPrimary }}>"{selectedDevotional.bibleText}"</Text>
                  <br />
                  <Text strong style={{ color: colors.textSecondary }}>- {selectedDevotional.bibleVerse}</Text>
                </div>
              )}

              {selectedDevotional.prayer && (
                <div style={{ 
                  background: colors.cardBackground, 
                  padding: 16, 
                  borderRadius: 8,
                  marginTop: 16,
                  borderLeft: `4px solid ${colors.warning}`,
                  border: `1px solid ${colors.mint}`
                }}>
                  <Title level={4} style={{ color: colors.textPrimary }}>
                    <HeartOutlined /> Prayer
                  </Title>
                  <Paragraph italic style={{ color: colors.textPrimary }}>{selectedDevotional.prayer}</Paragraph>
                </div>
              )}

              {selectedDevotional.reflection && (
                <div style={{ 
                  background: colors.surfaceBackground, 
                  padding: 16, 
                  borderRadius: 8,
                  marginTop: 16,
                  borderLeft: `4px solid ${colors.success}`
                }}>
                  <Title level={4} style={{ color: colors.textPrimary }}>
                    <BulbOutlined /> Reflection Questions
                  </Title>
                  <ul>
                    {selectedDevotional.reflection.map((question, index) => (
                      <li key={index}>
                        <Paragraph style={{ color: colors.textPrimary }}>{question}</Paragraph>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Space wrap style={{ marginBottom: 16 }}>
              <Button 
                type="text" 
                icon={selectedDevotional.isLiked ? <HeartFilled style={{ color: colors.error }} /> : <HeartOutlined />}
                onClick={() => handleLike(selectedDevotional.id)}
                style={{ color: colors.textSecondary }}
              >
                {selectedDevotional.likes || 0} {selectedDevotional.isLiked ? 'Liked' : 'Like'}
              </Button>
              {!selectedDevotional.isRead && (
                <Button 
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => markAsRead(selectedDevotional.id)}
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }}
                >
                  Mark as Read
                </Button>
              )}
            </Space>

            <Divider style={{ borderColor: colors.mint }} />

            <Title level={4} style={{ color: colors.textPrimary }}>
              <MessageOutlined /> Comments ({comments.length})
            </Title>

            {user && (
              <Form
                form={commentForm}
                onFinish={handleComment}
                style={{ marginBottom: 16 }}
              >
                <Form.Item name="comment" rules={[{ required: true, message: 'Please enter a comment' }]}>
                  <TextArea 
                    placeholder="Share your thoughts or testimony..." 
                    rows={3}
                    autoSize={{ minRows: 3, maxRows: 6 }}
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
const mockDevotionals = [
  {
    id: 1,
    title: "Walking in Faith",
    content: "Faith is not about seeing the whole staircase, just taking the first step. Today, God calls us to trust Him even when we cannot see the full picture of His plan for our lives. Abraham left everything he knew to follow God's promise, not knowing where he was going, but trusting in God's faithfulness...",
    bibleVerse: "Hebrews 11:1",
    bibleText: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    date: "2025-09-11",
    readTime: 5,
    likes: 23,
    comments: 8,
    isLiked: false,
    isRead: false,
    prayer: "Lord, help me to walk by faith and not by sight. Give me courage to trust in Your perfect plan for my life, even when I cannot see what lies ahead.",
    reflection: [
      "What area of your life requires more faith and trust in God?",
      "How can you take a step of faith today?",
      "What promises of God can you hold onto during uncertain times?"
    ]
  },
  {
    id: 2,
    title: "God's Unfailing Love",
    content: "In a world where relationships can be fragile and trust can be broken, God's love remains constant and unwavering. His love is not based on our performance or our perfection, but on His unchanging character...",
    bibleVerse: "1 John 4:19",
    bibleText: "We love because he first loved us.",
    date: "2025-09-10",
    readTime: 4,
    likes: 31,
    comments: 12,
    isLiked: true,
    isRead: true,
    prayer: "Thank you, Father, for Your perfect love that never fails. Help me to love others as You have loved me.",
    reflection: [
      "How has God's love changed your life?",
      "Who can you show God's love to today?",
      "What does it mean to love because God first loved us?"
    ]
  },
  {
    id: 3,
    title: "Finding Peace in the Storm",
    content: "Life's storms are inevitable, but God's peace is available in every circumstance. When we feel overwhelmed by challenges, we can find rest in knowing that God is in control...",
    bibleVerse: "Philippians 4:6-7",
    bibleText: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    date: "2025-09-09",
    readTime: 6,
    likes: 18,
    comments: 5,
    isLiked: false,
    isRead: true,
    prayer: "Prince of Peace, calm my anxious heart and help me to trust in Your perfect timing and plan.",
    reflection: [
      "What anxieties are you carrying that you need to give to God?",
      "How can prayer and thanksgiving change your perspective?",
      "Where do you see God's peace available in your current situation?"
    ]
  }
];

export default Devotionals;
