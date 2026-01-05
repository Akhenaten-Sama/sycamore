import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Image,
  message,
  Space,
  Tag,
  Empty,
  Spin,
  Badge,
  Carousel,
  Pagination,
  Select,
  Dropdown,
} from 'antd';
import {
  PlayCircleOutlined,
  PictureOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SoundOutlined,
  FileOutlined,
  LinkOutlined,
  CheckOutlined,
  DownOutlined,
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import { useTheme } from '../contexts/ThemeContext';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';

const { Title, Text, Paragraph } = Typography;

const MediaGallery = ({ user }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('Recently added');

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
      return { likes: likeCount, isLiked: liked };
    } catch (error) {
      console.error('Like failed:', error);
      message.error('Failed to update like status');
      throw error;
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
  };

  const MediaCard = ({ item }) => {
    // Get media type badge info
    const getTypeInfo = () => {
      switch(item.type) {
        case 'video':
          return { label: 'Video', color: '#e74c3c', icon: <PlayCircleOutlined /> };
        case 'audio':
          return { label: 'Audio', color: '#f39c12', icon: <SoundOutlined /> };
        case 'photo':
          return { label: 'Photo', color: '#3498db', icon: <PictureOutlined /> };
        default:
          return { label: item.type, color: '#95a5a6', icon: <FileOutlined /> };
      }
    };

    const typeInfo = getTypeInfo();

    return (
      <Card
        hoverable
        style={{
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover Image */}
        <div 
          style={{ 
            position: 'relative', 
            height: 180,
            background: item.thumbnail 
              ? `url(${item.thumbnail}) center/cover`
              : item.type === 'video' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : item.type === 'audio'
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
            cursor: 'pointer',
            borderRadius: '12px 12px 0 0'
          }}
          onClick={() => openMediaView(item)}
        >
          {/* Type Badge */}
          <div 
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: typeInfo.color,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: '12px' }}>
          {/* Title */}
          <Title 
            level={5} 
            style={{ 
              color: isDarkMode ? '#fff' : '#000',
              marginBottom: '8px',
              fontSize: '15px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.title}
          </Title>

          {/* Date and Views */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: isDarkMode ? '#999' : '#666',
            fontSize: '12px',
            marginBottom: '12px'
          }}>
            <span>{item.date ? new Date(item.date).toLocaleDateString() : 'No date'}</span>
            <span>•</span>
            <span>{item.views || 2} Views</span>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: `1px solid ${isDarkMode ? '#2a2a2a' : '#f0f0f0'}`
          }}>
            <LikeButton
              likes={item.likes}
              isLiked={item.isLiked}
              onLike={handleLike}
              targetId={item.id}
              showText={false}
              size="small"
              style={{
                color: isDarkMode ? '#999' : '#666',
                fontSize: '12px',
                padding: '4px 8px',
                height: 'auto'
              }}
            />
            <Button 
              type="text" 
              size="small"
              icon={<MessageOutlined />}
              onClick={() => openMediaView(item)}
              style={{
                color: isDarkMode ? '#999' : '#666',
                fontSize: '12px',
                padding: '4px 8px',
                height: 'auto'
              }}
            >
              {item.comments || 0}
            </Button>
            <Button 
              type="text" 
              size="small"
              icon={<ShareAltOutlined />}
              onClick={() => shareMedia(item)}
              style={{
                color: isDarkMode ? '#999' : '#666',
                fontSize: '12px',
                padding: '4px 8px',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </Card>
    );
  };

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

  // Get filtered and sorted media based on current filters
  const getFilteredMedia = () => {
    let filtered = [...media];
    
    // Apply media type filter
    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === mediaTypeFilter);
    }
    
    // Apply time filter from sortFilter
    if (sortFilter !== 'Recently added' && sortFilter !== 'All Time') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date || item.createdAt);
        const diffInMs = now - itemDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        
        switch (sortFilter) {
          case 'Today':
            return diffInDays < 1;
          case 'This Week':
            return diffInDays < 7;
          case 'This Month':
            return diffInDays < 30;
          default:
            return true;
        }
      });
    }
    
    // Sort by date (most recent first for "Recently added")
    if (sortFilter === 'Recently added') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        return dateB - dateA;
      });
    }
    
    return filtered;
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
    <div style={{ 
      padding: 0,
      background: isDarkMode ? '#121212' : '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
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
          <PictureOutlined style={{ marginRight: 8 }} />
          Resources
        </Title>
        <Paragraph 
          style={{ 
            color: isDarkMode ? '#999' : '#666',
            fontSize: '14px',
            marginBottom: 0
          }}
        >
          Explore photos and videos from church events and services
        </Paragraph>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Media Type Filter */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'all',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '180px' }}>
                      <span>All Media ({media.length})</span>
                      {mediaTypeFilter === 'all' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setMediaTypeFilter('all')
                },
                {
                  key: 'videos',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '180px' }}>
                      <span>Videos ({filterMedia('video').length})</span>
                      {mediaTypeFilter === 'video' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setMediaTypeFilter('video')
                },
                {
                  key: 'audios',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '180px' }}>
                      <span>Audios ({filterMedia('audio').length})</span>
                      {mediaTypeFilter === 'audio' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setMediaTypeFilter('audio')
                },
                {
                  key: 'photos',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '180px' }}>
                      <span>Photos ({filterMedia('photo').length})</span>
                      {mediaTypeFilter === 'photo' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setMediaTypeFilter('photo')
                },
                {
                  key: 'documents',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '180px' }}>
                      <span>Documents ({filterMedia('document').length})</span>
                      {mediaTypeFilter === 'document' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setMediaTypeFilter('document')
                }
              ]
            }}
            trigger={['click']}
          >
            <Button 
              style={{
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#d9d9d9'}`,
                color: isDarkMode ? '#fff' : '#000',
                borderRadius: '8px',
                height: '36px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flex: 1,
                minWidth: '150px'
              }}
            >
              <span>
                {mediaTypeFilter === 'all' && `All Media (${media.length})`}
                {mediaTypeFilter === 'video' && `Videos (${filterMedia('video').length})`}
                {mediaTypeFilter === 'audio' && `Audios (${filterMedia('audio').length})`}
                {mediaTypeFilter === 'photo' && `Photos (${filterMedia('photo').length})`}
                {mediaTypeFilter === 'document' && `Documents (${filterMedia('document').length})`}
              </span>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Button>
          </Dropdown>

          {/* Sort Filter */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'recently',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '150px' }}>
                      <span>Recently added</span>
                      {sortFilter === 'Recently added' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setSortFilter('Recently added')
                },
                {
                  key: 'today',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '150px' }}>
                      <span>Today</span>
                      {sortFilter === 'Today' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setSortFilter('Today')
                },
                {
                  key: 'week',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '150px' }}>
                      <span>This Week</span>
                      {sortFilter === 'This Week' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setSortFilter('This Week')
                },
                {
                  key: 'month',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '150px' }}>
                      <span>This Month</span>
                      {sortFilter === 'This Month' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setSortFilter('This Month')
                },
                {
                  key: 'all',
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '150px' }}>
                      <span>All Time</span>
                      {sortFilter === 'All Time' && <CheckOutlined style={{ color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />}
                    </div>
                  ),
                  onClick: () => setSortFilter('All Time')
                }
              ]
            }}
            trigger={['click']}
          >
            <Button 
              style={{
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#d9d9d9'}`,
                color: isDarkMode ? '#fff' : '#000',
                borderRadius: '8px',
                height: '36px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flex: 1,
                minWidth: '150px'
              }}
            >
              <span>{sortFilter}</span>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Filtered Media Grid */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            {getFilteredMedia().length > 0 ? (
              getFilteredMedia().map(item => (
                <Col xs={24} sm={12} lg={8} key={item.id || item._id}>
                  <MediaCard item={item} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Empty 
                  description="No media found"
                  style={{ 
                    padding: '50px 0',
                    color: isDarkMode ? '#999' : '#666'
                  }}
                />
              </Col>
            )}
          </Row>

          {/* Pagination */}
          {getFilteredMedia().length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={getFilteredMedia().length}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          )}
        </>
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
              <LikeButton
                likes={selectedMedia.likes}
                isLiked={selectedMedia.isLiked}
                onLike={handleLike}
                targetId={selectedMedia.id}
                showText={false}
              />
              <Button 
                type="text" 
                icon={<ShareAltOutlined />}
                onClick={() => shareMedia(selectedMedia)}
              >
                Share
              </Button>
            </Space>

            <CommentSection
              targetId={selectedMedia.id}
              targetType="media"
              getComments={ApiClient.getMediaComments.bind(ApiClient)}
              addComment={ApiClient.addMediaComment.bind(ApiClient)}
              autoRefresh={true}
              refreshInterval={3000}
            />
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default MediaGallery;
