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
  Pagination,
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
  SoundOutlined,
  FileOutlined,
  LinkOutlined,
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
  const [currentPage, setCurrentPage] = useState(1);

  // Function to get appropriate icon for media type
  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlined />;
      case 'audio':
        return <SoundOutlined />;
      case 'document':
        return <FileOutlined />;
      case 'photo':
        return <PictureOutlined />;
      default:
        return <LinkOutlined />;
    }
  };

  // Function to get appropriate color for media type tag
  const getMediaTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'red';
      case 'audio':
        return 'green';
      case 'document':
        return 'orange';
      case 'photo':
        return 'blue';
      default:
        return 'default';
    }
  };

  // Function to render media content based on type
  const renderMediaContent = (media) => {
    const { type, url, thumbnail, title } = media;

    switch (type) {
      case 'video':
        if (isDirectVideoFile(url)) {
          return (
            <video 
              src={url} 
              controls 
              style={{ width: '100%', maxHeight: 400 }}
              poster={thumbnail}
            />
          );
        } else {
          return (
            <div style={{ position: 'relative' }}>
              <iframe
                src={getEmbeddableUrl(url)}
                style={{ 
                  width: '100%', 
                  height: '400px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={title}
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                onError={(e) => {
                  console.error('Iframe failed to load:', e);
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div style={{ 
                display: 'none', 
                textAlign: 'center', 
                padding: '40px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <p>Video embedding not available</p>
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => window.open(url, '_blank')}
                >
                  Watch Externally
                </Button>
              </div>
            </div>
          );
        }

      case 'audio':
        if (url.includes('spotify.com')) {
          // Spotify embed
          const spotifyId = extractSpotifyId(url);
          if (spotifyId) {
            return (
              <iframe
                src={`https://open.spotify.com/embed/${spotifyId.type}/${spotifyId.id}?utm_source=generator`}
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: '12px' }}
              ></iframe>
            );
          }
        }
        
        // Regular audio file or other audio services
        return (
          <div style={{ padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            {thumbnail && (
              <img 
                src={thumbnail} 
                alt={title}
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
              />
            )}
            <div style={{ marginBottom: '16px' }}>
              <SoundOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <audio controls style={{ width: '100%', marginBottom: '16px' }}>
              <source src={url} type="audio/mpeg" />
              <source src={url} type="audio/wav" />
              <source src={url} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
            <Button 
              type="primary" 
              icon={<SoundOutlined />}
              onClick={() => window.open(url, '_blank')}
            >
              Open Audio
            </Button>
          </div>
        );

      case 'document':
        return (
          <div style={{ padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <FileOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>Document: {title}</p>
            <Space>
              <Button 
                type="primary" 
                icon={<FileOutlined />}
                onClick={() => window.open(url, '_blank')}
              >
                Open Document
              </Button>
              <Button 
                type="default"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = title || 'document';
                  link.click();
                }}
              >
                Download
              </Button>
            </Space>
          </div>
        );

      case 'photo':
        return (
          <Image 
            src={url} 
            style={{ maxWidth: '100%' }}
            preview={false}
          />
        );

      default:
        return (
          <div style={{ padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <LinkOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>External Link: {title}</p>
            <Button 
              type="primary" 
              icon={<LinkOutlined />}
              onClick={() => window.open(url, '_blank')}
            >
              Open Link
            </Button>
          </div>
        );
    }
  };

  // Function to extract Spotify track/playlist/album ID
  const extractSpotifyId = (url) => {
    const patterns = [
      /spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { type: match[1], id: match[2] };
      }
    }
    return null;
  };
  const [pageSize] = useState(12);
  const [totalMedia, setTotalMedia] = useState(0);



  useEffect(() => {
    loadMedia(1);
  }, []);

  const loadMedia = async (page = 1) => {
    try {
      setLoading(true);
      const response = await ApiClient.getMedia(`?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
      
      // Use real API data only
      const mediaData = response?.data || response || [];
      const mediaArray = Array.isArray(mediaData) ? mediaData : [];
      
      setMedia(mediaArray);
      setTotalMedia(response?.total || mediaArray.length);
      setCurrentPage(page);
      
      console.log(`Loaded ${mediaArray.length} media items for page ${page}`);
      console.log('Media items with types:', mediaArray.map(item => ({ title: item.title, type: item.type, url: item.url })));
    } catch (error) {
      console.error('Failed to load media:', error);
      message.error('Failed to load media. Please try again.');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const loadComments = async (mediaId) => {
    try {
      const response = await ApiClient.getMediaComments(mediaId);
      
      // Handle nested response format
      const commentsData = response?.data || response || [];
      
      // Transform API response to match UI format
      const transformedComments = commentsData.map(comment => ({
        id: comment._id || comment.id,
        content: comment.content,
        author: comment.author || (comment.authorId ? `${comment.authorId.firstName} ${comment.authorId.lastName}` : 'Unknown User'),
        avatar: comment.avatar || comment.authorId?.profilePicture || `https://ui-avatars.io/api/?name=${encodeURIComponent(comment.author || 'Unknown User')}`,
        timestamp: comment.timestamp || formatDate(comment.createdAt)
      }));
      
      setComments(transformedComments);
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
      const response = await ApiClient.likeMedia(mediaId);
      const { liked, likeCount } = response;
      
      // Update local state based on API response
      setMedia(prev => prev.map(item => 
        item.id === mediaId 
          ? { ...item, likes: likeCount, isLiked: liked }
          : item
      ));
      
      if (selectedMedia && selectedMedia.id === mediaId) {
        setSelectedMedia(prev => ({
          ...prev,
          likes: likeCount,
          isLiked: liked
        }));
      }

      message.success(liked ? 'Added to favorites!' : 'Removed from favorites!');
    } catch (error) {
      console.error('Like failed:', error);
      message.error('Failed to update like status');
    }
  };

  const handleComment = async (values) => {
    console.log('handleComment called with:', values);
    console.log('User object:', user);
    console.log('Selected media:', selectedMedia);
    
    if (!user) {
      message.warning('Please sign in to comment');
      return;
    }

    try {
      const commentData = {
        content: values.comment,
      };

      console.log('Sending comment data:', commentData);
      const response = await ApiClient.addMediaComment(selectedMedia.id, commentData);
      console.log('Comment response:', response);
      
      // Add comment to local state immediately for better UX
      const responseData = response?.data || response;
      const comment = {
        id: responseData?._id || responseData?.id || Date.now(),
        content: values.comment,
        author: `${user.firstName} ${user.lastName}`,
        avatar: user.profilePicture || `https://ui-avatars.io/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}`,
        timestamp: 'Just now',
      };
      
      setComments(prev => [comment, ...prev]);
      commentForm.resetFields();
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('Failed to add comment');
    }
  };

  // Function to get the embeddable URL for videos
  const getEmbeddableUrl = (url) => {
    if (!url) return '';
    
    // YouTube URL patterns - comprehensive including live streams
    const youtubePatterns = [
      // Standard youtube.com/watch?v=
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?/,
      // YouTube live streams: youtube.com/live/VIDEO_ID
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      // youtu.be short URLs
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      // youtube.com/embed/ URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      // youtube.com/v/ URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      // YouTube watch URLs with additional parameters
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*[&?]v=([a-zA-Z0-9_-]{11})(?:&.*)?/
    ];
    
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;
      }
    }
    
    // Vimeo URL patterns
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\?.*)?/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // For direct video files (mp4, webm, etc.), return as is
    if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i)) {
      return url;
    }
    
    // Default: return original URL
    return url;
  };

  // Function to check if URL is a direct video file
  const isDirectVideoFile = (url) => {
    return url && url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i);
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
            background: item.thumbnail 
              ? `url(${item.thumbnail}) center/cover`
              : item.type === 'video' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            backgroundColor: '#f0f0f0',
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
            <Tag color={getMediaTypeColor(item.type)}>
              {getMediaIcon(item.type)}
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
            {item.speaker && (
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <UserOutlined /> {item.speaker}
                </Text>
              </div>
            )}
            <Paragraph ellipsis={{ rows: 2 }}>
              {item.description}
            </Paragraph>
            <Space>
              <Text type="secondary">
                <CalendarOutlined /> {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
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
    if (!Array.isArray(media)) {
      return [];
    }
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
      key: 'videos',
      label: (
        <>
          <PlayCircleOutlined /> Videos ({filterMedia('video').length})
        </>
      ),
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
    {
      key: 'audio',
      label: (
        <>
          <SoundOutlined /> Audio ({filterMedia('audio').length})
        </>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {filterMedia('audio').map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <MediaCard item={item} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: 'photos',
      label: (
        <>
          <PictureOutlined /> Photos ({filterMedia('photo').length})
        </>
      ),
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
      key: 'documents',
      label: (
        <>
          <FileOutlined /> Documents ({filterMedia('document').length})
        </>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {filterMedia('document').map(item => (
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
        <Title level={2}>
          <PictureOutlined style={{ marginRight: 8 }} />
          Media Gallery
        </Title>
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

      {/* Pagination */}
      {media.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalMedia}
            onChange={(page) => {
              setCurrentPage(page);
              loadMedia(page);
            }}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
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
              {renderMediaContent(selectedMedia)}
            </div>

            <Title level={3}>{selectedMedia.title}</Title>
            {selectedMedia.speaker && (
              <div style={{ marginBottom: 8 }}>
                <Text strong style={{ color: '#1890ff' }}>
                  <UserOutlined /> {selectedMedia.speaker}
                </Text>
              </div>
            )}
            <Paragraph>{selectedMedia.description}</Paragraph>

            <Space wrap style={{ marginBottom: 16 }}>
              <Tag>
                <CalendarOutlined /> {selectedMedia.date ? new Date(selectedMedia.date).toLocaleDateString() : 'No date'}
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

            {user ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
                <Text type="secondary">Please sign in to add comments</Text>
              </div>
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

export default MediaGallery;
