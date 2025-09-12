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
  PlayCircleOut            >
              <FileTextOutlined /> Notes
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
            </Button>eOutlined,
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
                  <HeartOutlined style={{ fontSize: '20px' }} />
                </div>
                <div>
                  <Text style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>
                    Ask for Prayer
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    We'd love to pray with you.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={{ 
                borderRadius: '12px',
                background: '#722ed1',
                border: 'none',
                color: 'white'
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
                height: '40px',
                width: '100%',
                background: '#d32f2f',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/sermon-notes')}
            >
              📖 Message Notes
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '40px',
                width: '100%',
                background: '#1976d2',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              📤 Share
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              style={{
                height: '40px',
                width: '100%',
                background: '#388e3c',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/bible')}
            >
              � Bible
            </Button>
          </Col>
        </Row>

        {/* Latest Sermon Card */}
        <Card 
          style={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            border: 'none',
            marginBottom: '16px'
          }}
          cover={
            <div style={{
              height: '200px',
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80) center/cover`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlayCircleOutlined style={{ fontSize: '60px', color: 'white' }} />
            </div>
          }
          onClick={() => navigate('/media')}
        >
          <Card.Meta
            title="Faith in Uncertain Times"
            description={
              <div>
                <Text type="secondary">Pastor John Smith</Text>
                <br />
                <Text type="secondary">September 8, 2025</Text>
              </div>
            }
          />
        </Card>
      </div>

      {/* Daily Devotional Section */}
      <div style={{ padding: '0 16px 16px' }}>
        <Title level={4} style={{ marginBottom: '12px', color: '#262626' }}>
          Today's Devotional
        </Title>
        
        <Card 
          style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            marginBottom: '16px'
          }}
          bodyStyle={{ padding: '20px' }}
          onClick={() => navigate('/devotionals')}
        >
          <Title level={5} style={{ color: 'white', marginBottom: '8px' }}>
            "Trust in the Lord with all your heart"
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
            Proverbs 3:5-6
          </Text>
          <div style={{ marginTop: '12px' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              When we trust God completely, He directs our paths and makes our way clear...
            </Text>
          </div>
        </Card>
      </div>

      {/* Scripture of the Week */}
      <div style={{ padding: '0 16px 16px' }}>
        <Title level={4} style={{ marginBottom: '12px', color: '#262626' }}>
          Scripture of the Week
        </Title>
        
        <Card 
          style={{ 
            borderRadius: '12px',
            background: '#f6f8fa',
            border: '1px solid #e8e8e8'
          }}
          bodyStyle={{ padding: '20px', textAlign: 'center' }}
        >
          <Text style={{ 
            fontSize: '16px', 
            fontStyle: 'italic', 
            color: '#333',
            lineHeight: '1.6'
          }}>
            "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."
          </Text>
          <div style={{ marginTop: '12px' }}>
            <Text strong style={{ color: '#1890ff' }}>
              Jeremiah 29:11
            </Text>
          </div>
          <Button 
            type="link" 
            style={{ marginTop: '8px', padding: 0 }}
            onClick={() => navigate('/bible?verse=jeremiah-29-11')}
          >
            Read Full Chapter →
          </Button>
        </Card>
      </div>

      {/* Quick Links */}
      <div style={{ padding: '0 16px 16px' }}>
        <Title level={4} style={{ marginBottom: '12px', color: '#262626' }}>
          Quick Links
        </Title>
        
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card 
              hoverable
              style={{ 
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => navigate('/events')}
            >
              <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
              <div>
                <Text strong>Upcoming Events</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>View all events</Text>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              hoverable
              style={{ 
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => navigate('/blog')}
            >
              <ReadOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
              <div>
                <Text strong>Latest Blog</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>Read articles</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Welcome Section for New Users */}
      {!user && (
        <div style={{ padding: '0 16px 24px' }}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
              Welcome to Sycamore Church!
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
              Join our community of faith and fellowship. Sign in to access your personal dashboard and connect with others.
            </Paragraph>
            <Button 
              type="primary"
              size="large"
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/communities')}
            >
              Get Started
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomePage;
