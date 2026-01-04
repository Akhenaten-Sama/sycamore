import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Spin } from 'antd';
import { 
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import ApiClient from '../services/apiClient';

// Import homepage icons
import GiveIcon from '../assets/icons/homepage/give.svg';
import RequestsIcon from '../assets/icons/homepage/requests.svg';
import ConnectIcon from '../assets/icons/homepage/connect.svg';
import PrayerRequestIcon from '../assets/icons/homepage/prayer_request.svg';
import EventsIcon from '../assets/icons/homepage/events.svg';
import PraiseReportIcon from '../assets/icons/homepage/praise_report.svg';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [latestSermons, setLatestSermons] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [liveSermon, setLiveSermon] = useState(null);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    loadLatestSermons();
    loadLatestBlogs();
    loadLiveSermon();
  }, []);

  const loadLiveSermon = async () => {
    try {
      setLoadingLive(true);
      // Check if today is Sunday
      const today = new Date();
      const isSunday = today.getDay() === 0;
      
      console.log('🔴 Loading live sermon...');
      console.log('   Today is Sunday:', isSunday);
      
      // Always check for live sermons (remove Sunday restriction for testing)
      const response = await ApiClient.getMedia('?limit=50');
      console.log('   API response:', response);
      
      if (response?.data) {
        console.log('   Total media items:', response.data.length);
        
        // Log items with isLive true
        const liveItems = response.data.filter(item => item.isLive);
        console.log('   Items with isLive=true:', liveItems.length);
        liveItems.forEach(item => {
          console.log(`      - ${item.title}: category="${item.category}", isLive=${item.isLive}`);
        });
        
        // Find a sermon marked as live
        const live = response.data.find(item => item.isLive && item.category === 'sermon');
        console.log('   Live sermon found:', live ? live.title : 'none');
        
        // Show live sermon if found and it's Sunday, or if found regardless (for testing)
        if (live) {
          setLiveSermon(live);
        } else {
          setLiveSermon(null);
        }
      }
    } catch (error) {
      console.error('Failed to load live sermon:', error);
    } finally {
      setLoadingLive(false);
    }
  };

  const loadLatestSermons = async () => {
    try {
      setLoadingSermons(true);
      const response = await ApiClient.getMedia('?limit=50');
      if (response?.data) {
        console.log('🏠 HomePage received media items:', response.data.length);
        
        // Log first few items to see their structure
        response.data.slice(0, 3).forEach(item => {
          console.log(`   - ${item.title}: type="${item.type}", category="${item.category}"`);
        });
        
        // Filter for sermons only using category field
        const sermons = response.data
          .filter(item => item.category === 'sermon')
          .slice(0, 2);
        
        console.log('🏠 Filtered sermons:', sermons.length);
        sermons.forEach(sermon => {
          console.log(`   ✅ ${sermon.title}`);
        });
        
        setLatestSermons(sermons);
      }
    } catch (error) {
      console.error('Failed to load sermons:', error);
    } finally {
      setLoadingSermons(false);
    }
  };

  const loadLatestBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await ApiClient.request('/mobile/blog?limit=2');
      if (response?.data) {
        setLatestBlogs(response.data);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      return formatDate(dateString);
    } catch {
      return '';
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
      <div style={{ 
      background: isDarkMode ? '#121212' : '#f5f5f5',
      minHeight: '100vh',
      padding: 0
    }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: isDarkMode 
          ? 'url(https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80)'
          : 'url(https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 16px 24px',
        borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(26, 77, 77, 0.95) 0%, rgba(13, 38, 38, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(45, 122, 122, 0.95) 0%, rgba(26, 77, 77, 0.95) 100%)',
          pointerEvents: 'none'
        }} />
      
        <div style={{ 
          fontSize: '25px', 
          marginBottom: '12px',
          color: '#ffffff',
          fontWeight: 700,
          position: 'relative',
          zIndex: 1
        }}>You're home 👋</div>
        <Text style={{ 
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 300,
          letterSpacing: '0.3px',
          position: 'relative',
          zIndex: 1
        }}>
          We're honored to walk this journey with you.
        </Text>
      </div>

      {/* Sundays at Sycamore Section - Only show on Sundays or if there's a live sermon */}
      {(new Date().getDay() === 0 || liveSermon) && (
        <div style={{ padding: '20px 16px' }}>
          <Title level={3} style={{ 
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 700
          }}>
            Sundays at Sycamore
          </Title>

          {loadingLive ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin />
            </div>
          ) : liveSermon ? (
            <Card
              hoverable
              onClick={() => navigate('/media')}
              style={{
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Live Badge and Cover */}
              <div style={{
                height: '180px',
                background: liveSermon.thumbnail 
                  ? `url(${liveSermon.thumbnail}) center/cover`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative'
              }}>
                {/* LIVE Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#ff4444',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  animation: 'pulse 2s infinite'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#fff',
                    animation: 'blink 1s infinite'
                  }}/>
                  Live
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <Title level={4} style={{
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}>
                  {liveSermon.title}
                </Title>
                <Text style={{
                  color: isDarkMode ? '#999' : '#666',
                  fontSize: '13px',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {liveSermon.speaker && `${liveSermon.speaker} • `}
                  {liveSermon.views || 3} Watching • Started {formatTimeAgo(liveSermon.createdAt)}
                </Text>
                <Button 
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  block
                  style={{
                    background: isDarkMode ? '#2d7a7a' : '#2d7a7a',
                    borderColor: isDarkMode ? '#2d7a7a' : '#2d7a7a',
                    height: '40px',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}
                >
                  Watch Live Now
                </Button>
              </div>
            </Card>
          ) : (
            <Card
              style={{
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
                borderRadius: '12px',
                textAlign: 'center',
                padding: '30px 20px'
              }}
            >
              <Text style={{ color: isDarkMode ? '#999' : '#666', fontSize: '14px' }}>
                No live service at the moment. Check back during service times!
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Grow Section */}
      <div style={{ padding: '20px 16px' }}>
        <Title level={3} style={{ 
          color: isDarkMode ? '#fff' : '#000',
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: 700
        }}>
          Grow
        </Title>
        
        <Row gutter={[8, 8]}>
          <Col xs={8}>
            <Card
              hoverable
              onClick={() => navigate('/devotionals')}
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(rgba(26, 58, 58, 0.85), rgba(26, 58, 58, 0.85)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop") center/cover'
                  : 'linear-gradient(rgba(45, 90, 90, 0.75), rgba(45, 90, 90, 0.75)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop") center/cover',
                border: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '160px',
                position: 'relative'
              }}
              bodyStyle={{ 
                padding: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div>
                <Title level={4} style={{ 
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '0',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  Daily<br/>Devotionals
                </Title>
              </div>
              <Text style={{ 
                color: isDarkMode ? '#ddd' : '#e8e8e8', 
                fontSize: '11px', 
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Day 5/Week 22
              </Text>
            </Card>
          </Col>

          <Col xs={8}>
            <Card
              hoverable
              onClick={() => navigate('/bible')}
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(rgba(42, 36, 16, 0.85), rgba(42, 36, 16, 0.85)), url("https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop") center/cover'
                  : 'linear-gradient(rgba(74, 64, 32, 0.75), rgba(74, 64, 32, 0.75)), url("https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop") center/cover',
                border: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '160px',
                position: 'relative'
              }}
              bodyStyle={{ 
                padding: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div>
                <Title level={4} style={{ 
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '0',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  Engage the<br/>Bible
                </Title>
              </div>
              <Text style={{ 
                color: isDarkMode ? '#ddd' : '#e8e8e8', 
                fontSize: '11px', 
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                1 John 3:2
              </Text>
            </Card>
          </Col>

          <Col xs={8}>
            <Card
              hoverable
              onClick={() => navigate('/sermon-notes')}
              style={{
                background: isDarkMode ? '#1a3d3d' : '#4a9d9d',
                border: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '160px'
              }}
              bodyStyle={{ 
                padding: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <Title level={4} style={{ 
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '0',
                  fontWeight: 700,
                  lineHeight: '1.3'
                }}>
                  Notes
                </Title>
                <Text style={{ 
                  color: isDarkMode ? '#bbb' : '#e0f2f2', 
                  fontSize: '11px', 
                  fontWeight: 400, 
                  marginTop: '4px', 
                  display: 'block' 
                }}>
                  ✍️ Take notes...
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Get Involved Section */}
      <div style={{ padding: '24px 16px' }}>
        <Title level={3} style={{ 
          color: isDarkMode ? '#fff' : '#000',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: 700
        }}>
          Get Involved
        </Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={12}>
            <div
              onClick={() => navigate('/giving')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2d7a2d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={GiveIcon} 
                  alt="Give"
                  style={{ 
                    width: '28px', 
                    height: '28px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Give
              </Text>
            </div>
          </Col>

          <Col xs={12}>
            <div
              onClick={() => navigate('/requests')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#5a4a7a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={RequestsIcon} 
                  alt="Request"
                  style={{ 
                    width: '28px', 
                    height: '28px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Request
              </Text>
            </div>
          </Col>

          <Col xs={12}>
            <div
              onClick={() => navigate('/communities')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2d7a9a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={ConnectIcon} 
                  alt="Connect"
                  style={{ 
                    width: '28px', 
                    height: '28px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Connect
              </Text>
            </div>
          </Col>

          <Col xs={12}>
            <div
              onClick={() => navigate('/requests?category=Prayer')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#d97a2d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={PrayerRequestIcon} 
                  alt="Prayer Request"
                  style={{ 
                    width: '28px', 
                    height: '28px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Prayer Request
              </Text>
            </div>
          </Col>

          <Col xs={12}>
            <div
              onClick={() => navigate('/events')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#d92d7a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={EventsIcon} 
                  alt="Events"
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Events
              </Text>
            </div>
          </Col>

          <Col xs={12}>
            <div
              onClick={() => navigate('/testimonies')}
              style={{
                width: '100%',
                height: '64px',
                background: isDarkMode ? '#1e1e1e' : '#ffffff',
                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#d92d2d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={PraiseReportIcon} 
                  alt="Praise Report"
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <Text style={{ 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Praise Report
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* Latest Sermon Section */}
      <div style={{ padding: '20px 16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <Title level={3} style={{ 
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: 0,
            fontSize: '18px',
            fontWeight: 700
          }}>
            Latest Sermon
          </Title>
          <Button 
            type="text"
            onClick={() => navigate('/media')}
            style={{ color: isDarkMode ? '#888' : '#666', fontSize: '13px', fontWeight: 400 }}
          >
            View all
          </Button>
        </div>

        {loadingSermons ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : latestSermons.length === 0 ? (
          <Card style={{ 
            background: isDarkMode ? '#1e1e1e' : '#fff',
            textAlign: 'center',
            padding: '20px'
          }}>
            <Text style={{ color: isDarkMode ? '#999' : '#666' }}>
              No sermons available yet
            </Text>
          </Card>
        ) : (
          latestSermons.map((sermon) => (
            <Card
              key={sermon.id}
              hoverable
              onClick={() => navigate('/media')}
              style={{
                background: isDarkMode ? '#1e1e1e' : '#fff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
                borderRadius: '12px',
                marginBottom: '12px'
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text style={{ 
                    color: isDarkMode ? '#888' : '#666',
                    fontSize: '11px',
                    fontWeight: 400
                  }}>
                    {formatDate(sermon.date || sermon.createdAt)}
                  </Text>
                  <Title level={5} style={{ 
                    color: isDarkMode ? '#fff' : '#000',
                    marginBottom: 0,
                    fontSize: '15px',
                    fontWeight: 600,
                    lineHeight: '1.4'
                  }} ellipsis={{ rows: 2 }}>
                    {sermon.title}
                  </Title>
                  {sermon.speaker && (
                    <Text style={{ 
                      color: isDarkMode ? '#888' : '#666',
                      fontSize: '13px',
                      fontWeight: 400
                    }}>
                      {sermon.speaker}
                    </Text>
                  )}
                </div>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: sermon.thumbnail ? `url(${sermon.thumbnail})` : '#d2691e',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {!sermon.thumbnail && (
                    <PlayCircleOutlined style={{ fontSize: '40px', color: '#fff', opacity: 0.7 }} />
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Blogs Section */}
      <div style={{ padding: '20px 16px', paddingBottom: '80px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <Title level={3} style={{ 
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: 0,
            fontSize: '18px',
            fontWeight: 700
          }}>
            Blogs
          </Title>
          <Button 
            type="text"
            onClick={() => navigate('/blog')}
            style={{ color: isDarkMode ? '#888' : '#666', fontSize: '13px', fontWeight: 400 }}
          >
            View all
          </Button>
        </div>

        {loadingBlogs ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : latestBlogs.length === 0 ? (
          <Card style={{ 
            background: isDarkMode ? '#1e1e1e' : '#fff',
            textAlign: 'center',
            padding: '20px'
          }}>
            <Text style={{ color: isDarkMode ? '#999' : '#666' }}>
              No blog posts available yet
            </Text>
          </Card>
        ) : (
          latestBlogs.map((blog) => (
            <Card
              key={blog.id}
              hoverable
              onClick={() => navigate('/blog')}
              style={{
                background: isDarkMode ? '#1e1e1e' : '#fff',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`,
                borderRadius: '12px',
                marginBottom: '12px'
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: blog.featuredImage ? `url(${blog.featuredImage})` : '#d2691e',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!blog.featuredImage && (
                    <FileTextOutlined style={{ fontSize: '40px', color: '#fff', opacity: 0.7 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ 
                    color: isDarkMode ? '#888' : '#666',
                    fontSize: '11px',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 400
                  }}>
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </Text>
                  <Title level={5} style={{ 
                    color: isDarkMode ? '#fff' : '#000',
                    marginBottom: '6px',
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: '1.3'
                  }} ellipsis={{ rows: 2 }}>
                    {blog.title}
                  </Title>
                  {blog.author && (
                    <Text style={{ 
                      color: isDarkMode ? '#888' : '#666',
                      fontSize: '12px',
                      fontWeight: 400
                    }}>
                      {blog.author}
                    </Text>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default HomePage;
