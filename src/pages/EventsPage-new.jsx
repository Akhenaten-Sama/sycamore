import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Tag, Space, Spin, Empty } from 'antd';
import { 
  EnvironmentOutlined, 
  UserOutlined
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';

const { Title, Paragraph, Text } = Typography;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getEvents();
      console.log('Events response:', response);
      
      if (response && Array.isArray(response)) {
        setEvents(response);
      } else if (response && response.events && Array.isArray(response.events)) {
        // Handle case where events are nested under events property
        setEvents(response.events);
      } else {
        console.warn('No valid events data received, using empty array');
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      // Set empty array instead of mock data to force real backend usage
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const MOCK_EVENTS = [
    {
      id: 1,
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

  const EventCard = ({ event }) => (
    <Card
      style={{ 
        marginBottom: 16, 
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Event Image with Overlay */}
      <div 
        style={{ 
          height: 200, 
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${event.image}) center/cover`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 16,
          color: 'white'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Tag 
            color="blue" 
            style={{ 
              background: 'rgba(255,255,255,0.9)', 
              color: '#1890ff',
              border: 'none',
              fontWeight: 'bold'
            }}
          >
            {event.category}
          </Tag>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <div>{new Date(event.date).toLocaleDateString()}</div>
            <div>{event.time}</div>
          </div>
        </div>
        
        <div>
          <Title level={4} style={{ color: 'white', margin: 0, marginBottom: 4 }}>
            {event.title}
          </Title>
          <Space>
            <EnvironmentOutlined />
            <Text style={{ color: 'white' }}>{event.location}</Text>
          </Space>
        </div>
      </div>

      {/* Event Details */}
      <div style={{ padding: 16 }}>
        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12, color: '#666' }}>
          {event.description}
        </Paragraph>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <Text style={{ color: '#666', fontSize: '14px' }}>
              {event.attendees} attending
            </Text>
          </Space>
          
          <Button 
            type="primary" 
            size="small"
            style={{ borderRadius: '20px' }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading events...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80) center/cover`,
        borderRadius: '16px',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'white',
        marginBottom: 24
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
          Church Events
        </Title>
        <Text style={{ color: 'white', fontSize: 16 }}>
          Join us for upcoming services and activities
        </Text>
      </div>

      {/* Events List */}
      {events.length > 0 ? (
        <div>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Empty description="No events found" />
        </div>
      )}
    </div>
  );
};

export default EventsPage;
