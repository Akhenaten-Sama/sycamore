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
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import colors from '../styles/colors';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>
      {/* Date and Greeting */}
      <div style={{ 
        padding: '20px 16px', 
        background: `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.teal} 100%)`,
        color: colors.textWhite
      }}>
        <Text style={{ color: colors.cream, fontSize: '14px' }}>
          {currentDate}
        </Text>
        <Title level={3} style={{ color: colors.textWhite, margin: '4px 0 0 0' }}>
          {user ? `Good afternoon, ${user.firstName}` : 'Welcome to Sycamore Church'}
        </Title>
      </div>

      {/* Main Action Buttons */}
      <div style={{ padding: '16px' }}>
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Button 
              style={{
                height: '70px',
                width: '100%',
                background: colors.success,
                border: 'none',
                borderRadius: '16px',
                color: colors.textWhite,
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: `0 4px 12px ${colors.success}30`
              }}
              onClick={() => navigate('/media')}
            >
              <div style={{ textAlign: 'center' }}>
                <PlayCircleOutlined style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }} />
                Watch Live
              </div>
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '70px',
                width: '100%',
                background: colors.primary,
                border: 'none',
                borderRadius: '16px',
                color: colors.textWhite,
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: `0 4px 12px ${colors.primary}30`
              }}
              onClick={() => navigate('/communities')}
            >
              <div style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }} />
                Connect
              </div>
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '70px',
                width: '100%',
                background: colors.orange,
                border: 'none',
                borderRadius: '16px',
                color: colors.textWhite,
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: `0 4px 12px ${colors.orange}30`
              }}
              onClick={() => navigate('/giving')}
            >
              <div style={{ textAlign: 'center' }}>
                <GiftOutlined style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }} />
                Give
              </div>
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
            background: `linear-gradient(135deg, ${colors.cardBackground} 0%, ${colors.surfaceBackground} 100%)`,
            color: colors.textPrimary,
            minHeight: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${colors.darkBlue}15`
          }}
          bodyStyle={{ 
            background: 'transparent',
            textAlign: 'center',
            padding: '24px'
          }}
        >
          <div>
            <CompassOutlined style={{ 
              fontSize: '48px', 
              color: colors.primary, 
              marginBottom: '16px' 
            }} />
            <Title level={3} style={{ color: colors.textPrimary, marginBottom: '8px' }}>
              Daily Devotional
            </Title>
            <Paragraph style={{ color: colors.textSecondary, marginBottom: '16px' }}>
              Start your day with God's word and grow in faith
            </Paragraph>
            <Button 
              type="primary"
              style={{
                background: colors.primary,
                borderColor: colors.primary,
                borderRadius: '25px',
                padding: '8px 24px',
                height: 'auto',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/devotionals')}
            >
              Read Today's Devotional
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 16px 16px' }}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                background: colors.warning,
                border: 'none',
                color: colors.textWhite,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.warning}30`
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => navigate('/communities')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <HeartOutlined style={{ fontSize: '20px', color: colors.textWhite }} />
                </div>
                <div>
                  <Text style={{ color: colors.textWhite, fontWeight: 'bold', display: 'block' }}>
                    Prayer Request
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                    We'll pray with you
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                background: colors.darkRed,
                border: 'none',
                color: colors.textWhite,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.darkRed}30`
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => navigate('/events')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <CalendarOutlined style={{ fontSize: '20px', color: colors.textWhite }} />
                </div>
                <div>
                  <Text style={{ color: colors.textWhite, fontWeight: 'bold', display: 'block' }}>
                    Events
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                    Join us this week
                  </Text>
                </div>
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
                background: colors.error,
                border: 'none',
                borderRadius: '12px',
                color: colors.textWhite,
                fontSize: '12px',
                fontWeight: 'bold'
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
                background: colors.primary,
                border: 'none',
                borderRadius: '12px',
                color: colors.textWhite,
                fontSize: '12px',
                fontWeight: 'bold'
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
                background: colors.success,
                border: 'none',
                borderRadius: '12px',
                color: colors.textWhite,
                fontSize: '12px',
                fontWeight: 'bold'
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
                  color: colors.orange, 
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
