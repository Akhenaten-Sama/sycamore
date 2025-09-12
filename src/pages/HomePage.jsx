import React from 'react';
import { Typography, Row, Col, Card, Button, Space, Tag } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  TeamOutlined,
  VideoCameraOutlined,
  CompassOutlined,
  GiftOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  HeartOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);

  const now = new Date();
  const isSunday = now.getDay() === 0; // Sunday is day 0
  
  const currentDate = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Function to get appropriate greeting based on time and day
  const getGreeting = () => {
    if (isSunday && user) {
      return `Welcome to church, ${user.firstName}! 🙏`;
    } else if (user) {
      const hour = now.getHours();
      if (hour < 12) return `Good morning, ${user.firstName}`;
      if (hour < 17) return `Good afternoon, ${user.firstName}`;
      return `Good evening, ${user.firstName}`;
    } else {
      return isSunday ? 'Welcome to Sycamore Church! 🙏' : 'Welcome to Sycamore Church';
    }
  };

  return (
    <div style={{ 
      background: colors.background, 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {/* Date and Greeting */}
      <div style={{ 
        padding: '20px 16px', 
        background: isSunday 
          ? `linear-gradient(135deg, ${colors.darkRed} 0%, ${colors.brightRed} 100%)`
          : `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.teal} 100%)`,
        color: colors.textWhite
      }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
          {currentDate}
        </Text>
        <Title level={3} style={{ color: colors.textWhite, margin: '4px 0 0 0' }}>
          {getGreeting()}
        </Title>
        {isSunday && (
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            margin: '8px 0 0 0',
            fontSize: '14px'
          }}>
            Join us for worship service today! 🎵
          </Paragraph>
        )}
      </div>

      {/* Main Action Buttons */}
      <div style={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button 
              style={{
                height: '80px',
                width: '100%',
                background: colors.primary,
                border: 'none',
                borderRadius: '12px',
                color: colors.textWhite,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(10, 147, 150, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/media')}
            >
              <PlayCircleOutlined style={{ fontSize: '28px', marginBottom: '6px' }} />
              Watch Live
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              style={{
                height: '80px',
                width: '100%',
                background: colors.secondary,
                border: 'none',
                borderRadius: '12px',
                color: colors.textWhite,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(0, 95, 115, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/communities')}
            >
              <TeamOutlined style={{ fontSize: '28px', marginBottom: '6px' }} />
              Connect
            </Button>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Button 
              style={{
                height: '80px',
                width: '100%',
                background: colors.cardBackground,
                border: `2px solid ${colors.primary}`,
                borderRadius: '12px',
                color: colors.primary,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/giving')}
            >
              <GiftOutlined style={{ fontSize: '28px', marginBottom: '6px' }} />
              Give
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              style={{
                height: '80px',
                width: '100%',
                background: colors.cardBackground,
                border: `2px solid ${colors.secondary}`,
                borderRadius: '12px',
                color: colors.secondary,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/requests')}
            >
              <FormOutlined style={{ fontSize: '28px', marginBottom: '6px' }} />
              Requests
            </Button>
          </Col>
        </Row>
      </div>

      {/* Daily Devotional Hero */}
      <div style={{ padding: '0 16px 16px' }}>
        <Card 
          style={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            border: `2px solid ${colors.mint}`,
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80) center/cover`,
            color: colors.textWhite,
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${colors.darkBlue}25`
          }}
          bodyStyle={{ 
            background: 'transparent',
            textAlign: 'center',
            padding: '32px 24px'
          }}
        >
          <div>
            <CompassOutlined style={{ 
              fontSize: '56px', 
              color: colors.textWhite, 
              marginBottom: '16px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} />
            <Title level={3} style={{ 
              color: colors.textWhite, 
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              Daily Devotional
            </Title>
            <Paragraph style={{ 
              color: colors.textWhite, 
              marginBottom: '20px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontSize: '16px'
            }}>
              Start your day with God's word and grow in faith
            </Paragraph>
            <Button 
              type="primary"
              size="large"
              style={{
                background: colors.primary,
                borderColor: colors.primary,
                borderRadius: '30px',
                padding: '12px 32px',
                height: 'auto',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(10, 147, 150, 0.4)'
              }}
              onClick={() => navigate('/devotionals')}
            >
              Read Today's Devotional
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Access */}
      <div style={{ padding: '0 16px 24px' }}>
        <Title level={4} style={{ 
          marginBottom: '16px', 
          color: colors.textPrimary,
          fontWeight: '600'
        }}>
          Quick Access
        </Title>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${colors.mint}`,
                backgroundColor: colors.cardBackground,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              bodyStyle={{ padding: '20px' }}
              onClick={() => navigate('/requests')}
              hoverable
            >
              <div style={{ textAlign: 'center' }}>
                <HeartOutlined style={{ 
                  fontSize: '32px', 
                  color: colors.primary, 
                  marginBottom: '12px',
                  display: 'block'
                }} />
                <Text style={{ 
                  color: colors.textPrimary, 
                  fontWeight: '600',
                  display: 'block',
                  fontSize: '15px'
                }}>
                  Prayer Request
                </Text>
                <Text style={{ 
                  color: colors.textSecondary,
                  fontSize: '12px'
                }}>
                  Submit your prayer needs
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${colors.mint}`,
                backgroundColor: colors.cardBackground,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              bodyStyle={{ padding: '20px' }}
              onClick={() => navigate('/events')}
              hoverable
            >
              <div style={{ textAlign: 'center' }}>
                <CalendarOutlined style={{ 
                  fontSize: '32px', 
                  color: colors.secondary, 
                  marginBottom: '12px',
                  display: 'block'
                }} />
                <Text style={{ 
                  color: colors.textPrimary, 
                  fontWeight: '600',
                  display: 'block',
                  fontSize: '15px'
                }}>
                  Events
                </Text>
                <Text style={{ 
                  color: colors.textSecondary,
                  fontSize: '12px'
                }}>
                  Join us this week
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Latest Message Section */}
      <div style={{ padding: '0 16px 16px' }}>
        <Title level={4} style={{ 
          marginBottom: '12px', 
          color: colors.textPrimary,
          fontWeight: 'bold'
        }}>
          Latest Message
        </Title>
        
        <Row gutter={[12, 12]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Button 
              style={{
                height: '44px',
                width: '100%',
                background: colors.cardBackground,
                border: `1px solid ${colors.primary}`,
                borderRadius: '8px',
                color: colors.primary,
                fontSize: '12px',
                fontWeight: '600'
              }}
              onClick={() => navigate('/sermon-notes')}
            >
              <FileTextOutlined /> Notes
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '44px',
                width: '100%',
                background: colors.cardBackground,
                border: `1px solid ${colors.secondary}`,
                borderRadius: '8px',
                color: colors.secondary,
                fontSize: '12px',
                fontWeight: '600'
              }}
              onClick={() => navigate('/blog')}
            >
              <BulbOutlined /> Blog
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '44px',
                width: '100%',
                background: colors.cardBackground,
                border: `1px solid ${colors.primary}`,
                borderRadius: '8px',
                color: colors.primary,
                fontSize: '12px',
                fontWeight: '600'
              }}
              onClick={() => navigate('/bible')}
            >
              <CompassOutlined /> Bible
            </Button>
          </Col>
        </Row>

        {/* Latest Sermon Card */}
        <Card 
          style={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${colors.mint}`,
            marginBottom: '16px',
            backgroundColor: colors.cardBackground,
            boxShadow: `0 4px 12px ${colors.darkBlue}10`
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ 
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80) center/cover`,
            height: '200px',
            display: 'flex',
            alignItems: 'flex-end',
            color: colors.textWhite,
            padding: '24px'
          }}>
            <div>
              <Tag color={colors.success} style={{ marginBottom: '8px' }}>
                <ClockCircleOutlined /> September 8, 2025
              </Tag>
              <Title level={4} style={{ color: colors.textWhite, marginBottom: '4px' }}>
                Faith Over Fear
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Pastor Johnson explores how faith can overcome our deepest fears
              </Text>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              style={{
                background: colors.primary,
                borderColor: colors.primary,
                marginRight: '8px'
              }}
              onClick={() => navigate('/media')}
            >
              Watch
            </Button>
            <Button 
              icon={<FileTextOutlined />}
              onClick={() => navigate('/sermon-notes')}
            >
              Notes
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div style={{ padding: '0 16px 24px' }}>
        <Title level={4} style={{ 
          marginBottom: '12px', 
          color: colors.textPrimary,
          fontWeight: 'bold'
        }}>
          Quick Links
        </Title>
        
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${colors.mint}`,
                backgroundColor: colors.cardBackground,
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '12px' }}
              onClick={() => navigate('/members')}
            >
              <div style={{ textAlign: 'center' }}>
                <UserOutlined style={{ 
                  fontSize: '24px', 
                  color: colors.primary, 
                  marginBottom: '8px' 
                }} />
                <Text style={{ 
                  color: colors.textPrimary, 
                  fontWeight: 'bold',
                  display: 'block'
                }}>
                  My Profile
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${colors.mint}`,
                backgroundColor: colors.cardBackground,
                cursor: 'pointer'
              }}
              bodyStyle={{ padding: '12px' }}
              onClick={() => navigate('/blog')}
            >
              <div style={{ textAlign: 'center' }}>
                <BulbOutlined style={{ 
                  fontSize: '24px', 
                  color: colors.secondary, 
                  marginBottom: '8px' 
                }} />
                <Text style={{ 
                  color: colors.textPrimary, 
                  fontWeight: 'bold',
                  display: 'block'
                }}>
                  Blog Posts
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
