import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Tag, Space, Spin, Empty, Row, Col } from 'antd';
import { 
  EnvironmentOutlined, 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors } from '../styles/colors';
import AttendanceManager from '../components/AttendanceManager';

const { Title, Paragraph, Text } = Typography;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [screenSize, setScreenSize] = useState('mobile');
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const colors = getColors(isDarkMode);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) setScreenSize('desktop');
      else if (width >= 768) setScreenSize('tablet');
      else setScreenSize('mobile');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await ApiClient.getEvents('upcoming', page);
      console.log('Events response:', response);
      
      if (response && Array.isArray(response)) {
        if (append) {
          setEvents(prevEvents => [...prevEvents, ...response]);
        } else {
          setEvents(response);
        }
        
        // If response has pagination metadata, update it
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else if (response && response.events && Array.isArray(response.events)) {
        // Handle case where events are nested under events property
        if (append) {
          setEvents(prevEvents => [...prevEvents, ...response.events]);
        } else {
          setEvents(response.events);
        }
        
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        console.warn('No valid events data received, using empty array');
        if (!append) {
          setEvents([]);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      // Set empty array instead of mock data to force real backend usage
      if (!append) {
        setEvents([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const MOCK_EVENTS = [
    {
      id: 1,
      name: "Sunday Worship Service",
      title: "Sunday Worship Service",
      description: "Join us for our weekly worship service filled with praise, worship, and powerful preaching.",
      date: "2025-09-15",
      time: "09:00 AM",
      location: "Main Auditorium",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      attendees: 450,
      category: "Worship"
    },
    {
      id: 2,
      name: "Youth Fellowship",
      title: "Youth Fellowship",
      description: "An exciting time of fellowship, games, and spiritual growth for our young people.",
      date: "2025-09-18",
      time: "06:00 PM",
      location: "Youth Hall",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      attendees: 120,
      category: "Youth"
    },
    {
      id: 3,
      name: "Bible Study",
      title: "Bible Study",
      description: "Deep dive into God's word with our midweek Bible study session.",
      date: "2025-09-19",
      time: "07:00 PM",
      location: "Fellowship Hall",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      attendees: 85,
      category: "Study"
    },
    {
      id: 4,
      name: "Community Outreach",
      title: "Community Outreach",
      description: "Join us as we serve our local community with food distribution and prayer.",
      date: "2025-09-21",
      time: "10:00 AM",
      location: "City Park",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
      attendees: 200,
      category: "Outreach"
    }
  ];

  const handleMarkAttendance = (event) => {
    setSelectedEvent(event);
    setAttendanceModalVisible(true);
  };

  const EventCard = ({ event }) => {
    const isDesktop = screenSize === 'desktop';
    
    return (
      <Card
        style={{ 
          marginBottom: 16, 
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${colors.mint}`,
          backgroundColor: colors.cardBackground,
          boxShadow: `0 4px 16px ${colors.darkBlue}15`
        }}
        bodyStyle={{ padding: 0 }}
      >
        {isDesktop ? (
          // Desktop layout - horizontal
          <Row gutter={0} align="middle">
            <Col span={10}>
              <div
                style={{
                  height: '200px',
                  background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${event.image}) center/cover`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 16,
                  color: colors.textWhite
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Tag 
                    style={{ 
                      background: colors.primary, 
                      color: colors.textWhite,
                      border: 'none',
                      fontWeight: 'bold',
                      borderRadius: '16px'
                    }}
                  >
                    {event.category}
                  </Tag>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: colors.textWhite }}>
                    <div>
                      <CalendarOutlined style={{ marginRight: '4px' }} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div>
                      <ClockCircleOutlined style={{ marginRight: '4px' }} />
                      {event.time}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={14}>
              <div style={{ padding: '24px' }}>
                <Title level={3} style={{ color: colors.primary, margin: 0, marginBottom: 8 }}>
                  {event.title}
                </Title>
                <Space style={{ marginBottom: 12 }}>
                  <EnvironmentOutlined style={{ color: colors.textSecondary }} />
                  <Text style={{ color: colors.textSecondary }}>{event.location}</Text>
                </Space>
                <Paragraph style={{ marginBottom: 16, color: colors.textSecondary }}>
                  {event.description}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <TeamOutlined style={{ color: colors.primary }} />
                    <Text style={{ color: colors.textSecondary, fontSize: '14px' }}>
                      {event.attendees} attending
                    </Text>
                  </Space>
                  <Space>
                    {user && (
                      <Button 
                        type="primary" 
                        size="large"
                        onClick={() => handleMarkAttendance(event)}
                        icon={<CheckOutlined />}
                        style={{ 
                          borderRadius: '20px',
                          backgroundColor: colors.primary,
                          borderColor: colors.primary
                        }}
                      >
                        Check In
                      </Button>
                    )}
                    <Button 
                      type="default" 
                      size="large"
                      icon={<EyeOutlined />}
                      style={{ 
                        borderRadius: '20px',
                        backgroundColor: colors.success,
                        borderColor: colors.success,
                        color: colors.textWhite
                      }}
                    >
                      Learn More
                    </Button>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          // Mobile layout - vertical
          <>
            {/* Event Image with Overlay */}
            <div 
              style={{ 
                height: 200, 
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${event.image}) center/cover`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 16,
                color: colors.textWhite
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Tag 
                  style={{ 
                    background: colors.primary, 
                    color: colors.textWhite,
                    border: 'none',
                    fontWeight: 'bold',
                    borderRadius: '16px'
                  }}
                >
                  {event.category}
                </Tag>
                <div style={{ textAlign: 'right', fontSize: '12px', color: colors.textWhite }}>
                  <div>
                    <CalendarOutlined style={{ marginRight: '4px' }} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                    {event.time}
                  </div>
                </div>
              </div>
              
              <div>
                <Title level={4} style={{ color: colors.textWhite, margin: 0, marginBottom: 4 }}>
                  {event.title}
                </Title>
                <Space>
                  <EnvironmentOutlined style={{ color: colors.textWhite }} />
                  <Text style={{ color: colors.textWhite }}>{event.location}</Text>
                </Space>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ padding: 16 }}>
              <Paragraph 
                ellipsis={{ rows: 2 }} 
                style={{ marginBottom: 12, color: colors.textSecondary }}
              >
                {event.description}
              </Paragraph>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  <Text style={{ color: colors.textSecondary, fontSize: '14px' }}>
                    {event.attendees} attending
                  </Text>
                </Space>
                
                <Space>
                  {user && (
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => handleMarkAttendance(event)}
                      icon={<CheckOutlined />}
                      style={{ 
                        borderRadius: '20px',
                        backgroundColor: colors.primary,
                        borderColor: colors.primary
                      }}
                    >
                      Check In
                    </Button>
                  )}
                  <Button 
                    type="default" 
                    size="small"
                    icon={<EyeOutlined />}
                    style={{ 
                      borderRadius: '20px',
                      backgroundColor: colors.success,
                      borderColor: colors.success,
                      color: colors.textWhite
                    }}
                  >
                    Learn More
                  </Button>
                </Space>
              </div>
            </div>
          </>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        background: colors.background
      }}>
        <Spin size="large" style={{ color: colors.primary }} />
        <Text style={{ marginTop: 16, color: colors.textPrimary }}>Loading events...</Text>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: screenSize === 'mobile' ? '16px' : '24px', 
      background: colors.background, 
      minHeight: '100vh',
      maxWidth: screenSize === 'desktop' ? '1200px' : '100%',
      margin: '0 auto'
    }}>
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80) center/cover`,
        borderRadius: '16px',
        padding: screenSize === 'desktop' ? '48px 32px' : '32px 24px',
        textAlign: 'center',
        color: colors.textWhite,
        marginBottom: 24
      }}>
        <Title level={screenSize === 'desktop' ? 1 : 2} style={{ color: colors.textWhite, marginBottom: 8 }}>
          <CalendarOutlined style={{ marginRight: '8px' }} />
          Church Events
        </Title>
        <Text style={{ color: colors.textWhite, fontSize: screenSize === 'desktop' ? 18 : 16 }}>
          Join us for upcoming services and activities
        </Text>
      </div>

      {/* Events List */}
      {events.length > 0 ? (
        <div>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          
          {/* Load More Button */}
          {pagination.hasNextPage && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Button 
                onClick={() => loadEvents(pagination.page + 1, true)}
                loading={loadingMore}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  color: 'white'
                }}
              >
                {loadingMore ? 'Loading...' : 'Load More Events'}
              </Button>
            </div>
          )}
          
          {/* Pagination Info */}
          {events.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              margin: '10px 0',
              color: colors.textSecondary,
              fontSize: '14px'
            }}>
              Showing {events.length} of {pagination.total} events
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Empty description="No events found" style={{ color: colors.textSecondary }} />
        </div>
      )}

      {/* Attendance Manager Modal */}
      <AttendanceManager
        visible={attendanceModalVisible}
        onClose={() => setAttendanceModalVisible(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventsPage;
