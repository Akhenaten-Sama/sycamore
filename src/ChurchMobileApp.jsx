
import React, { useState, useEffect } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  List,
  Avatar,
  Space,
  Input,
  Form,
  message,
  Modal,
  Carousel,
  Divider,
  Badge,
  Tag,
  Image,
  Tabs,
  FloatButton,
  BackTop,
  Drawer,
  Radio,
  Checkbox
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ReadOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MenuOutlined,
  HomeOutlined,
  PhoneOutlined,
  TeamOutlined,
  BookOutlined,
  FireOutlined,
  HeartFilled,
  CheckOutlined,
  SendOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

// Mock data for events with banners
const EVENTS_DATA = [
  {
    id: 1,
    title: "Sunday Worship Service",
    description: "Join us for our weekly worship service filled with praise, worship, and powerful preaching.",
    date: "2025-07-27",
    time: "09:00 AM",
    location: "Main Auditorium",
    bannerType: "video",
    banner: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    attendees: 450,
    category: "Worship"
  },
  {
    id: 2,
    title: "Youth Fellowship",
    description: "An exciting time of fellowship, games, and spiritual growth for our young people.",
    date: "2025-07-30",
    time: "06:00 PM",
    location: "Youth Hall",
    bannerType: "image",
    banner: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    attendees: 120,
    category: "Youth"
  },
  {
    id: 3,
    title: "Prayer Meeting",
    description: "Come together in prayer and intercession for our community and nation.",
    date: "2025-08-02",
    time: "07:00 PM",
    location: "Prayer Room",
    bannerType: "image",
    banner: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
    attendees: 85,
    category: "Prayer"
  }
];

// Mock data for archives/old programs
const ARCHIVES_DATA = [
  {
    id: 1,
    title: "Sunday Service - Walking in Faith",
    description: "A powerful message about trusting God in uncertain times and finding strength in His promises.",
    date: "2025-06-30",
    speaker: "Pastor John Doe",
    topic: "Faith & Trust",
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=400&q=80",
    duration: "45 min",
    views: 1250,
    category: "Sunday Service"
  },
  {
    id: 2,
    title: "Youth Conference 2025 - Purpose Driven",
    description: "An inspiring conference for young people to discover their God-given purpose and calling.",
    date: "2025-06-15",
    speaker: "Pastor Sarah Smith",
    topic: "Purpose & Calling",
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80",
    duration: "1h 20min",
    views: 890,
    category: "Youth"
  },
  {
    id: 3,
    title: "Prayer & Fasting Week - Day 5",
    description: "The power of persistent prayer and how fasting draws us closer to God's heart.",
    date: "2025-05-25",
    speaker: "Elder Mary Johnson",
    topic: "Prayer & Fasting",
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=400&q=80",
    duration: "35 min",
    views: 654,
    category: "Prayer"
  },
  {
    id: 4,
    title: "Easter Sunday - He is Risen",
    description: "Celebrating the resurrection of Jesus Christ and what it means for believers today.",
    date: "2025-03-31",
    speaker: "Pastor John Doe",
    topic: "Resurrection",
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    duration: "52 min",
    views: 2100,
    category: "Special Service"
  },
  {
    id: 5,
    title: "Marriage Enrichment Seminar",
    description: "Building strong, God-centered marriages that reflect Christ's love for the church.",
    date: "2025-02-14",
    speaker: "Pastor & Mrs. Wilson",
    topic: "Marriage & Family",
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80",
    duration: "1h 10min",
    views: 756,
    category: "Seminar"
  }
];
const BLOG_POSTS = [
  {
    id: 1,
    title: "Walking in Faith: A Journey of Trust",
    excerpt: "Discover how to build unwavering faith in God's promises and trust His plan for your life...",
    content: "Faith is not just believing that God exists, but trusting Him completely with every aspect of our lives. In this journey of faith, we learn to surrender our fears, doubts, and anxieties to the One who knows us best...",
    author: "Pastor John Doe",
    publishedDate: "2025-07-20",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    likes: 45,
    category: "Spiritual Growth"
  },
  {
    id: 2,
    title: "The Power of Community in Faith",
    excerpt: "Exploring how Christian fellowship strengthens our relationship with God and each other...",
    content: "The early church understood something profound about community. They didn't just attend services; they lived life together, shared resources, and supported one another through every season...",
    author: "Pastor Sarah Smith",
    publishedDate: "2025-07-18",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80",
    likes: 32,
    category: "Community"
  },
  {
    id: 3,
    title: "Finding Purpose in Service",
    excerpt: "How serving others transforms our hearts and brings us closer to God's purpose for our lives...",
    content: "Service is not just about helping others; it's about discovering who we are meant to be. When we serve with a heart of love, we begin to see the world through God's eyes...",
    author: "Elder Mary Johnson",
    publishedDate: "2025-07-15",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80",
    likes: 28,
    category: "Service"
  }
];

function ChurchMobileApp() {
  const [activeTab, setActiveTab] = useState("events");
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [blogModal, setBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [prayerModal, setPrayerModal] = useState(false);
  const [menuDrawer, setMenuDrawer] = useState(false);
  const [form] = Form.useForm();

  const handleAttendance = async (values) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`🙏 Attendance marked for ${selectedEvent.title}!`);
      setAttendanceModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to mark attendance. Please try again.");
    }
  };

  const handlePrayerRequest = async (values) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("🙏 Prayer request submitted successfully!");
      setPrayerModal(false);
    } catch (error) {
      message.error("Failed to submit prayer request. Please try again.");
    }
  };

  const openYouTubeVideo = (link) => {
    window.open(link, '_blank');
  };

  const openWebsite = () => {
    window.open('https://sycamore.church', '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const navigationItems = [
    { key: "events", icon: <CalendarOutlined />, label: "Events", color: "#52c41a" },
    { key: "blog", icon: <ReadOutlined />, label: "Blog", color: "#1890ff" },
    { key: "archives", icon: <HistoryOutlined />, label: "Archives", color: "#722ed1" },
  ];

  const ArchiveCard = ({ archive }) => (
    <Card
      hoverable
      style={{
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 3px 15px rgba(26,54,93,0.08)",
        border: "1px solid #f0f0f0"
      }}
      cover={
        <div style={{ position: "relative" }}>
          <Image
            alt={archive.title}
            src={archive.thumbnail}
            height={180}
            style={{ objectFit: "cover" }}
            preview={false}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => openYouTubeVideo(archive.youtubeLink)}
          >
            <PlayCircleOutlined
              style={{
                fontSize: 48,
                color: "#fff",
                background: "rgba(255,0,0,0.8)",
                borderRadius: "50%",
                padding: 8
              }}
            />
          </div>
          <Tag
            color="red"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              fontWeight: 600,
              fontSize: 10
            }}
          >
            <YoutubeOutlined /> WATCH
          </Tag>
          <Tag
            color="blue"
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              fontWeight: 600,
              fontSize: 10
            }}
          >
            {archive.duration}
          </Tag>
        </div>
      }
    >
      <div style={{ padding: "8px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Tag color="purple" style={{ fontSize: 10 }}>{archive.category}</Tag>
          <Space size={4} style={{ fontSize: 11, color: "#666" }}>
            <EyeOutlined />
            {archive.views.toLocaleString()}
          </Space>
        </div>
        <Title level={5} style={{ margin: "0 0 8px 0", color: "#1a365d", lineHeight: 1.3 }}>
          {archive.title}
        </Title>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12, lineHeight: 1.4 }}>
          {archive.description}
        </Text>
        <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 12 }}>
          <Space size={8}>
            <UserOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text strong style={{ fontSize: 12 }}>{archive.speaker}</Text>
          </Space>
          <Space size={8}>
            <BookOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>{archive.topic}</Text>
          </Space>
          <Space size={8}>
            <CalendarOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>{formatDate(archive.date)}</Text>
          </Space>
        </Space>
        <Button
          type="primary"
          size="small"
          block
          icon={<PlayCircleOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, height: 36 }}
          onClick={() => openYouTubeVideo(archive.youtubeLink)}
        >
          Watch on YouTube
        </Button>
      </div>
    </Card>
  );

  // Component definitions
  const EventCard = ({ event }) => (
    <Card
      hoverable
      style={{
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 3px 15px rgba(26,54,93,0.08)"
      }}
      cover={
        event.bannerType === "video" ? (
          <div style={{ position: "relative", height: 200 }}>
            <video
              width="100%"
              height="200"
              controls
              poster={event.thumbnail}
              style={{ objectFit: "cover" }}
            >
              <source src={event.banner} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Tag
              color="red"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontWeight: 600,
                fontSize: 10
              }}
            >
              <VideoCameraOutlined /> VIDEO
            </Tag>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <Image
              alt={event.title}
              src={event.banner}
              height={200}
              style={{ objectFit: "cover" }}
              preview={false}
            />
            <Tag
              color="blue"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontWeight: 600,
                fontSize: 10
              }}
            >
              <PictureOutlined /> IMAGE
            </Tag>
          </div>
        )
      }
    >
      <div style={{ padding: "8px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0, color: "#1a365d", lineHeight: 1.3 }}>
            {event.title}
          </Title>
          <Tag color="green" style={{ fontSize: 10 }}>{event.category}</Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12, lineHeight: 1.4 }}>
          {event.description}
        </Text>
        <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 12 }}>
          <Space size={8}>
            <CalendarOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text strong style={{ fontSize: 12 }}>{formatDate(event.date)}</Text>
          </Space>
          <Space size={8}>
            <ClockCircleOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>{event.time}</Text>
          </Space>
          <Space size={8}>
            <EnvironmentOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>{event.location}</Text>
          </Space>
          <Space size={8}>
            <TeamOutlined style={{ color: "#1a365d", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>{event.attendees} attending</Text>
          </Space>
        </Space>
        <Button
          type="primary"
          size="small"
          block
          icon={<UserOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, height: 36 }}
          onClick={() => {
            setSelectedEvent(event);
            setAttendanceModal(true);
          }}
        >
          Mark Attendance
        </Button>
      </div>
    </Card>
  );

  const BlogCard = ({ post }) => (
    <Card
      hoverable
      style={{
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 3px 15px rgba(26,54,93,0.08)"
      }}
      cover={
        <Image
          alt={post.title}
          src={post.image}
          height={180}
          style={{ objectFit: "cover" }}
          preview={false}
        />
      }
      actions={[
        <Space key="likes">
          <HeartFilled style={{ color: "#ff4d4f" }} />
          {post.likes}
        </Space>,
        <Space key="read">
          <EyeOutlined />
          Read
        </Space>,
        <ShareAltOutlined key="share" />
      ]}
    >
      <div style={{ padding: "8px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Tag color="purple" style={{ fontSize: 10 }}>{post.category}</Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {post.readTime}
          </Text>
        </div>
        <Title level={5} style={{ margin: "0 0 8px 0", color: "#1a365d", lineHeight: 1.3 }}>
          {post.title}
        </Title>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12, lineHeight: 1.4 }}>
          {post.excerpt}
        </Text>
        <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 12 }}>
          <Text strong style={{ fontSize: 12 }}>By {post.author}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(post.publishedDate)}</Text>
        </Space>
        <Button
          type="primary"
          size="small"
          block
          icon={<ReadOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, height: 36 }}
          onClick={() => {
            setSelectedBlog(post);
            setBlogModal(true);
          }}
        >
          Read Full Article
        </Button>
      </div>
    </Card>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar
              size={40}
              style={{ background: "#1a365d" }}
              icon={<HomeOutlined />}
            />
            <div>
              <div style={{ fontWeight: 600, color: "#1a365d" }}>Sycamore Church</div>
              <div style={{ fontSize: 12, color: "#666" }}>Church App</div>
            </div>
          </Space>
        }
        placement="left"
        onClose={() => setMenuDrawer(false)}
        open={menuDrawer}
        width={280}
        style={{ borderRadius: "0 16px 16px 0" }}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          {navigationItems.map(item => (
            <Button
              key={item.key}
              type={activeTab === item.key ? "primary" : "text"}
              block
              size="large"
              icon={item.icon}
              style={{
                borderRadius: 8,
                textAlign: "left",
                height: 48,
                background: activeTab === item.key ? item.color : "transparent",
                borderColor: activeTab === item.key ? item.color : "transparent"
              }}
              onClick={() => {
                setActiveTab(item.key);
                setMenuDrawer(false);
              }}
            >
              {item.label}
            </Button>
          ))}
          <Divider style={{ margin: "16px 0" }} />
          <Button
            type="text"
            block
            size="large"
            icon={<GlobalOutlined />}
            style={{
              borderRadius: 8,
              textAlign: "left",
              height: 48,
              color: "#1a365d"
            }}
            onClick={openWebsite}
          >
            Visit Website
          </Button>
          <Button
            type="text"
            block
            size="large"
            icon={<PhoneOutlined />}
            style={{
              borderRadius: 8,
              textAlign: "left",
              height: 48,
              color: "#1a365d"
            }}
          >
            Contact Us
          </Button>
        </Space>
      </Drawer>

      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)",
          color: "#fff",
          padding: "24px 16px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1
          }}
        />
        
        {/* Mobile Header */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Button
              type="text"
              size="large"
              icon={<MenuOutlined />}
              style={{ color: "#fff", fontSize: 18 }}
              onClick={() => setMenuDrawer(true)}
            />
            <Button
              type="text"
              size="large"
              icon={<GlobalOutlined />}
              style={{ color: "#fff", fontSize: 18 }}
              onClick={openWebsite}
            />
          </div>
          
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={60}
              style={{
                background: "rgba(255,255,255,0.2)",
                marginBottom: 12,
                border: "2px solid rgba(255,255,255,0.3)"
              }}
              icon={<FireOutlined />}
            />
            <Title level={2} style={{ color: "#fff", marginBottom: 4, fontWeight: 800 }}>
              Sycamore Church
            </Title>
            <Text style={{ color: "#e0e7ff", fontSize: 14, display: "block", marginBottom: 16 }}>
              Creating an elevation for everyday ordinary people to see Jesus
            </Text>
            
            {/* Mobile Tab Navigation */}
            <Row gutter={8} justify="center">
              {navigationItems.map(item => (
                <Col key={item.key}>
                  <Button
                    size="small"
                    style={{
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: 12,
                      height: 32,
                      background: activeTab === item.key ? "#fff" : "rgba(255,255,255,0.2)",
                      color: activeTab === item.key ? item.color : "#fff",
                      border: "1px solid rgba(255,255,255,0.3)"
                    }}
                    onClick={() => setActiveTab(item.key)}
                  >
                    {item.icon} {item.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px 16px 80px 16px" }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={16} xl={14}>
            {activeTab === "events" && (
              <div>
                <Title level={3} style={{ textAlign: "center", marginBottom: 20, color: "#1a365d" }}>
                  <CalendarOutlined /> Upcoming Events
                </Title>
                <Row gutter={[16, 16]}>
                  {EVENTS_DATA.map(event => (
                    <Col xs={24} sm={12} lg={8} key={event.id}>
                      <EventCard event={event} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {activeTab === "blog" && (
              <div>
                <Title level={3} style={{ textAlign: "center", marginBottom: 20, color: "#1a365d" }}>
                  <ReadOutlined /> Latest Blog Posts
                </Title>
                <Row gutter={[16, 16]}>
                  {BLOG_POSTS.map(post => (
                    <Col xs={24} sm={12} lg={8} key={post.id}>
                      <BlogCard post={post} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {activeTab === "archives" && (
              <div>
                <Title level={3} style={{ textAlign: "center", marginBottom: 20, color: "#1a365d" }}>
                  <HistoryOutlined /> Program Archives
                </Title>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: 24,
                    fontSize: 14
                  }}
                >
                  Watch previous sermons, conferences, and special programs
                </Text>
                <Row gutter={[16, 16]}>
                  {ARCHIVES_DATA.map(archive => (
                    <Col xs={24} sm={12} lg={8} key={archive.id}>
                      <ArchiveCard archive={archive} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#1a365d",
          color: "#e0e7ff",
          padding: "32px 16px 16px 16px",
          textAlign: "center"
        }}
      >
        <Row justify="center" gutter={[24, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Title level={5} style={{ color: "#e0e7ff" }}>Contact Us</Title>
            <Space direction="vertical" size={2}>
              <Text style={{ color: "#e0e7ff", fontSize: 13 }}>
                <EnvironmentOutlined /> Behind Mobil Filling Station, Samonda Ibadan
              </Text>
              <Text style={{ color: "#e0e7ff", fontSize: 13 }}>
                <MailOutlined /> admin@sycamore.church
              </Text>
              <Text style={{ color: "#e0e7ff", fontSize: 13 }}>
                <PhoneOutlined /> +234 909 120 7917
              </Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={5} style={{ color: "#e0e7ff" }}>Quick Links</Title>
            <Space direction="vertical" size={2}>
              <Button
                type="link"
                style={{ color: "#e0e7ff", fontSize: 13, padding: 0, height: "auto" }}
                onClick={openWebsite}
              >
                Main Website
              </Button>
              <Button
                type="link"
                style={{ color: "#e0e7ff", fontSize: 13, padding: 0, height: "auto" }}
                onClick={() => window.open('https://sycamore.church/give', '_blank')}
              >
                Give Online
              </Button>
              <Button
                type="link"
                style={{ color: "#e0e7ff", fontSize: 13, padding: 0, height: "auto" }}
                onClick={() => window.open('https://sycamore.church/blog', '_blank')}
              >
                Full Blog
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={5} style={{ color: "#e0e7ff" }}>Follow Us</Title>
            <Space size={12}>
              <FacebookOutlined 
                style={{ fontSize: 20, color: "#e0e7ff", cursor: "pointer" }}
                onClick={() => window.open('https://web.facebook.com/syc.church/', '_blank')}
              />
              <TwitterOutlined 
                style={{ fontSize: 20, color: "#e0e7ff", cursor: "pointer" }}
                onClick={() => window.open('https://twitter.com/sycamore_church', '_blank')}
              />
              <InstagramOutlined 
                style={{ fontSize: 20, color: "#e0e7ff", cursor: "pointer" }}
                onClick={() => window.open('https://instagram.com/sycamore_church', '_blank')}
              />
              <YoutubeOutlined 
                style={{ fontSize: 20, color: "#e0e7ff", cursor: "pointer" }}
                onClick={() => window.open('https://youtube.com/sycamore_church', '_blank')}
              />
            </Space>
          </Col>
        </Row>
        <Divider style={{ background: "#e0e7ff", margin: "16px 0" }} />
        <Text style={{ color: "#e0e7ff", fontSize: 12 }}>
          © {new Date().getFullYear()} Sycamore Community Church. All Rights Reserved.
        </Text>
      </div>

      {/* Floating Action Buttons */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 16, bottom: 80 }}
        icon={<GlobalOutlined />}
      >
        <FloatButton 
          icon={<HomeOutlined />} 
          tooltip="Main Website"
          onClick={openWebsite}
        />
        <FloatButton 
          icon={<YoutubeOutlined />} 
          tooltip="YouTube Channel"
          onClick={() => window.open('https://youtube.com/sycamore_church', '_blank')}
        />
        <FloatButton 
          icon={<PhoneOutlined />} 
          tooltip="Contact Us"
          onClick={() => window.open('tel:+2349091207917', '_blank')}
        />
      </FloatButton.Group>

      {/* Back to Top */}
      <BackTop style={{ right: 16, bottom: 16 }} />

      {/* Modals */}
      {/* Attendance Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            Mark Your Attendance
          </div>
        }
        open={attendanceModal}
        onCancel={() => setAttendanceModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 400 }}
        centered
      >
        <div style={{ padding: "16px 0" }}>
          <Form layout="vertical" onFinish={handleAttendance}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="service"
              label="Service Type"
              rules={[{ required: true, message: "Please select service type" }]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="sunday">Sunday Service</Radio>
                  <Radio value="midweek">Midweek Service</Radio>
                  <Radio value="event">Special Event</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<CheckOutlined />}
                style={{ width: "100%", height: 48 }}
              >
                Mark Attendance
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Prayer Request Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <HeartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            Submit Prayer Request
          </div>
        }
        open={prayerModal}
        onCancel={() => setPrayerModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 500 }}
        centered
      >
        <div style={{ padding: "16px 0" }}>
          <Form layout="vertical" onFinish={handlePrayerRequest}>
            <Form.Item
              name="name"
              label="Your Name (Optional)"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your name (optional)"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="request"
              label="Prayer Request"
              rules={[{ required: true, message: "Please enter your prayer request" }]}
            >
              <Input.TextArea
                placeholder="Share your prayer request..."
                rows={4}
                showCount
                maxLength={500}
                style={{ fontSize: 16 }}
              />
            </Form.Item>
            <Form.Item
              name="urgent"
              valuePropName="checked"
            >
              <Checkbox>
                This is an urgent prayer request
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<SendOutlined />}
                style={{ width: "100%", height: 48 }}
              >
                Submit Prayer Request
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default ChurchMobileApp;

