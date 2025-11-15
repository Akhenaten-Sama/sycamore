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
import { useTheme } from '../contexts/ThemeContext';
import colors from '../styles/colors';

const { Title, Paragraph, Text } = Typography;

const BlogPage = () => {
  const { isDarkMode } = useTheme();
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
        background: isDarkMode ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '12px' }}
      cover={
        <div 
          style={{ 
            height: 180, 
            background: `url(${post.image}) center/cover`,
            position: 'relative',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}>
            <Tag 
              style={{ 
                background: isDarkMode ? '#2d7a7a' : '#2d7a7a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600
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
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            {post.readTime}
          </div>
        </div>
      }
    >
      <Title 
        level={5} 
        style={{ 
          color: isDarkMode ? '#fff' : '#000',
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '8px'
        }}
      >
        {post.title}
      </Title>
      
      <Paragraph 
        ellipsis={{ rows: 2 }}
        style={{ 
          color: isDarkMode ? '#999' : '#666',
          fontSize: '13px',
          marginBottom: '12px'
        }}
      >
        {post.content}
      </Paragraph>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Space size={4}>
          <Avatar size={24} icon={<UserOutlined />} />
          <Text style={{ fontSize: '12px', color: isDarkMode ? '#999' : '#666' }}>
            {post.author}
          </Text>
        </Space>
        <Text style={{ fontSize: '12px', color: isDarkMode ? '#999' : '#666' }}>
          <CalendarOutlined /> {new Date(post.date).toLocaleDateString()}
        </Text>
      </Space>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: `1px solid ${isDarkMode ? '#2a2a2a' : '#f0f0f0'}`
      }}>
        <Button 
          type="text" 
          size="small"
          icon={<HeartOutlined />}
          style={{
            color: isDarkMode ? '#999' : '#666',
            fontSize: '12px',
            padding: '4px 8px',
            height: 'auto'
          }}
        >
          {post.likes}
        </Button>
        <Button 
          type="text" 
          size="small"
          icon={<MessageOutlined />}
          style={{
            color: isDarkMode ? '#999' : '#666',
            fontSize: '12px',
            padding: '4px 8px',
            height: 'auto'
          }}
        >
          {post.comments}
        </Button>
        <Button 
          type="text" 
          size="small"
          icon={<EyeOutlined />}
          style={{
            color: isDarkMode ? '#999' : '#666',
            fontSize: '12px',
            padding: '4px 8px',
            height: 'auto'
          }}
        >
          Read
        </Button>
      </div>
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
    <div style={{ 
      background: isDarkMode ? '#121212' : '#f5f5f5', 
      minHeight: '100vh', 
      padding: 0 
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px',
        background: isDarkMode ? '#121212' : '#f5f5f5'
      }}>
        <Title 
          level={3} 
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000',
            marginBottom: 8,
            fontSize: '20px',
            fontWeight: 700
          }}
        >
          <BookOutlined style={{ marginRight: '8px' }} />
          Church Blog
        </Title>
        <Paragraph 
          style={{ 
            color: isDarkMode ? '#999' : '#666',
            fontSize: '14px',
            marginBottom: 0
          }}
        >
          Inspiring articles, teachings, and reflections from our church community
        </Paragraph>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
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
            style={{ color: isDarkMode ? '#999' : '#666' }}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPage;
