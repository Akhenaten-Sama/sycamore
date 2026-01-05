import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';

const { TextArea } = Input;
const { Text, Paragraph, Title } = Typography;

/**
 * Reusable Comment Section Component
 * 
 * Props:
 * - targetId: ID of the target item (media, blog, devotional, etc.)
 * - targetType: Type of target ('media', 'blog', 'devotional', 'community_post')
 * - getComments: Async function to fetch comments (targetId) => Promise<{comments: []}>
 * - addComment: Async function to add comment (targetId, {content}) => Promise<comment>
 * - autoRefresh: Boolean to enable auto-refresh (default: true)
 * - refreshInterval: Refresh interval in milliseconds (default: 3000)
 * - showTitle: Show the comments title (default: true)
 */
const CommentSection = ({
  targetId,
  targetType = 'media',
  getComments,
  addComment,
  autoRefresh = true,
  refreshInterval = 3000,
  showTitle = true
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  
  // Refs for managing auto-refresh
  const intervalRef = useRef(null);
  const lastCommentCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  // Load comments
  const loadComments = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    
    try {
      const response = await getComments(targetId);
      const commentsData = response?.comments || response?.data || response || [];
      
      // Transform API response to ensure proper format
      const transformedComments = (Array.isArray(commentsData) ? commentsData : []).map(comment => {
        // Handle author field - could be string or object
        let authorName = 'Unknown User';
        let authorAvatar = null;
        
        if (typeof comment.author === 'string') {
          authorName = comment.author;
        } else if (comment.authorId) {
          if (typeof comment.authorId === 'object') {
            authorName = `${comment.authorId.firstName || ''} ${comment.authorId.lastName || ''}`.trim() || 'Unknown User';
            authorAvatar = comment.authorId.profilePicture;
          }
        }
        
        return {
          id: comment._id || comment.id || Date.now(),
          content: comment.content || '',
          author: authorName,
          avatar: authorAvatar || comment.avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(authorName)}`,
          timestamp: comment.timestamp || comment.createdAt || new Date().toISOString()
        };
      });
      
      // Only update if there are new comments (silent refresh)
      if (silent) {
        if (transformedComments.length > lastCommentCountRef.current) {
          setComments(transformedComments);
          lastCommentCountRef.current = transformedComments.length;
        }
      } else {
        setComments(transformedComments);
        lastCommentCountRef.current = transformedComments.length;
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      if (!silent) {
        message.error('Failed to load comments');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (targetId) {
      loadComments(false);
      isInitialLoadRef.current = false;
    }
  }, [targetId]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && targetId && !isInitialLoadRef.current) {
      intervalRef.current = setInterval(() => {
        loadComments(true); // Silent refresh
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, targetId, refreshInterval]);

  // Handle comment submission
  const handleSubmit = async (values) => {
    if (!user) {
      message.warning('Please sign in to comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addComment(targetId, { content: values.comment });
      
      // Transform the new comment to match our format
      const newComment = {
        id: response?._id || response?.id || Date.now(),
        content: values.comment,
        author: response?.author || `${user.firstName} ${user.lastName}`,
        avatar: response?.avatar || user.profilePicture || `https://ui-avatars.io/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}`,
        timestamp: response?.timestamp || response?.createdAt || new Date().toISOString()
      };
      
      // Add new comment to the list immediately
      setComments(prev => [...prev, newComment]);
      lastCommentCountRef.current = comments.length + 1;
      
      form.resetFields();
      message.success('Comment posted successfully');
    } catch (error) {
      console.error('Failed to post comment:', error);
      message.error(error.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showTitle && (
        <>
          <Divider style={{ borderColor: isDarkMode ? '#2a2a2a' : '#e0e0e0' }} />
          <Title level={4} style={{ color: colors.text }}>
            <MessageOutlined /> Comments ({comments.length})
          </Title>
        </>
      )}

      {user ? (
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ marginBottom: 16 }}
        >
          <Form.Item 
            name="comment" 
            rules={[
              { required: true, message: 'Please enter a comment' },
              { max: 500, message: 'Comment is too long (max 500 characters)' }
            ]}
          >
            <TextArea 
              placeholder="Share your thoughts..." 
              rows={3}
              autoSize={{ minRows: 3, maxRows: 6 }}
              disabled={submitting}
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                color: colors.text,
                borderColor: isDarkMode ? '#2a2a2a' : '#d9d9d9'
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SendOutlined />}
              loading={submitting}
              style={{
                backgroundColor: '#2d7a7a',
                borderColor: '#2d7a7a'
              }}
            >
              Post Comment
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '20px', 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
          }}
        >
          <Text type="secondary">Please sign in to add comments</Text>
        </div>
      )}

      <List
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: 'No comments yet. Be the first to comment!' }}
        renderItem={comment => (
          <List.Item
            style={{
              borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#f0f0f0'}`,
              padding: '12px 0'
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  src={comment.avatar} 
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#2d7a7a'
                  }}
                />
              }
              title={
                <Text strong style={{ color: colors.text }}>
                  {comment.author}
                </Text>
              }
              description={
                <div>
                  <Paragraph 
                    style={{ 
                      color: colors.text,
                      marginBottom: 4 
                    }}
                  >
                    {comment.content}
                  </Paragraph>
                  <Text 
                    type="secondary" 
                    style={{ 
                      fontSize: 12,
                      color: isDarkMode ? '#888' : '#999'
                    }}
                  >
                    {new Date(comment.timestamp).toLocaleString()}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default CommentSection;
