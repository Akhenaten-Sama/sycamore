import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Tag, Space, Spin, Empty, Avatar } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  HeartFilled,
  BookOutlined,
  EditOutlined
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import colors from '../styles/colors';

const { Title, Paragraph, Text } = Typography;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getBlogPosts();
      console.log('Blog posts response:', response);
      
      if (response?.data) {
        setPosts(Array.isArray(response.data) ? response.data : []);
      } else {
        // Fallback to mock data
        setPosts(MOCK_POSTS);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      // Fallback to mock data
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const MOCK_POSTS = [
    {
      id: 1,
      title: "Walking in Faith During Difficult Times",
      content: "Life presents us with many challenges, but our faith can be our anchor. In this post, we explore how to maintain trust in God when circumstances seem overwhelming...",
      author: "Pastor John Smith",
      date: "2025-09-10",
      category: "Faith",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      likes: 45,
      comments: 12,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Power of Community in Christian Growth",
      content: "Iron sharpens iron, and so one person sharpens another. Discover how being part of a Christian community accelerates our spiritual growth and strengthens our faith journey...",
      author: "Sarah Johnson",
      date: "2025-09-08",
      category: "Community",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      likes: 38,
      comments: 8,
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Prayer: Our Direct Line to Heaven",
      content: "Prayer is not just a religious duty, but a privilege that connects us directly with our Heavenly Father. Learn about different types of prayer and how to develop a meaningful prayer life...",
      author: "Elder Mary Williams",
      date: "2025-09-05",
      category: "Prayer",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      likes: 52,
      comments: 15,
      readTime: "6 min read"
    }
  ];

  const BlogCard = ({ post }) => (
    <Card
      hoverable
      style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.mint}`,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      cover={
        <div 
          style={{ 
            height: 200, 
            background: `url(${post.image}) center/cover`,
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}>
            <Tag 
              style={{ 
                backgroundColor: colors.primary,
                color: colors.textWhite,
                border: 'none',
                borderRadius: '16px'
              }}
            >
              {post.category}
            </Tag>
          </div>
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: `rgba(0,0,0,0.7)`,
            color: colors.textWhite,
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: '12px'
          }}>
            {post.readTime}
          </div>
        </div>
      }
      actions={[
        <Button 
          type="text" 
          icon={<HeartOutlined />}
          style={{ color: colors.error }}
        >
          {post.likes}
        </Button>,
        <Button 
          type="text" 
          icon={<MessageOutlined />}
          style={{ color: colors.primary }}
        >
          {post.comments}
        </Button>,
        <Button 
          type="primary"
          style={{
            backgroundColor: colors.success,
            borderColor: colors.success
          }}
        >
          Read More
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <span style={{ color: colors.textPrimary }}>
            {post.title}
          </span>
        }
        description={
          <div>
            <Paragraph 
              ellipsis={{ rows: 3 }} 
              style={{ marginBottom: 12, color: colors.textSecondary }}
            >
              {post.content}
            </Paragraph>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: colors.primary }}
                />
                <Text strong style={{ color: colors.textPrimary }}>
                  {post.author}
                </Text>
              </Space>
              <Space>
                <CalendarOutlined style={{ color: colors.warning }} />
                <Text style={{ color: colors.textSecondary }}>
                  {new Date(post.date).toLocaleDateString()}
                </Text>
              </Space>
            </Space>
          </div>
        }
      />
    </Card>
  );

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px 0',
        background: colors.background,
        minHeight: '100vh'
      }}>
        <Spin size="large" style={{ color: colors.primary }} />
        <div style={{ marginTop: 16, color: colors.textPrimary }}>Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div style={{ background: colors.background, minHeight: '100vh', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: colors.textPrimary }}>
          <BookOutlined style={{ marginRight: '8px', color: colors.primary }} />
          Church Blog
        </Title>
        <Paragraph style={{ color: colors.textSecondary }}>
          Inspiring articles, teachings, and reflections from our church community
        </Paragraph>
      </div>

      {posts.length > 0 ? (
        <Row gutter={[16, 16]}>
          {posts.map(post => (
            <Col xs={24} sm={12} lg={8} key={post.id}>
              <BlogCard post={post} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          description="No blog posts found" 
          style={{ color: colors.textSecondary }}
        />
      )}
    </div>
  );
};

export default BlogPage;
