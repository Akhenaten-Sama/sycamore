import React, { useState } from 'react';
import { Layout as AntLayout, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  VideoCameraOutlined, 
  BookOutlined, 
  HeartOutlined, 
  UserOutlined,
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  CompassOutlined,
  BulbOutlined,
  GiftOutlined,
  FormOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';
import { getColors } from '../styles/colors';

const { Header, Content } = AntLayout;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  
  const colors = getColors(isDarkMode);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userDropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/members'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const bottomNavItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/communities',
      icon: <TeamOutlined />,
      label: 'Connect',
    },
    {
      key: '/media',
      icon: <VideoCameraOutlined />,
      label: 'Watch',
    },
    {
      key: '/giving',
      icon: <GiftOutlined />,
      label: 'Give',
    },
    {
      key: '/more',
      icon: <MoreOutlined />,
      label: 'More',
    },
  ];

  const handleBottomNavClick = (path) => {
    if (path === '/more') {
      // Show more options
      const moreItems = [
        { path: '/events', label: 'Events', icon: <CalendarOutlined /> },
        { path: '/watch-live', label: 'Watch Live', icon: <PlayCircleOutlined /> },
        { path: '/blog', label: 'Blog', icon: <FileTextOutlined /> },
        { path: '/devotionals', label: 'Devotionals', icon: <CompassOutlined /> },
        { path: '/requests', label: 'Request Forms', icon: <FormOutlined /> },
        { path: '/sermon-notes', label: 'Sermon Notes', icon: <BookOutlined /> },
        { path: '/bible', label: 'Bible', icon: <BookOutlined /> },
        { path: '/profile', label: 'Profile', icon: <UserOutlined /> },
      ];
      
      // For now, navigate to events as default
      navigate('/events');
    } else {
      navigate(path);
    }
  };

  const BottomNavItem = ({ item }) => {
    const isActive = location.pathname === item.key || 
                    (item.key === '/more' && !['/', '/communities', '/media', '/giving'].includes(location.pathname));
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 4px',
          cursor: 'pointer',
          color: isActive ? colors.primary : colors.textSecondary,
          fontSize: '12px',
          flex: 1,
          transition: 'color 0.3s',
          fontWeight: isActive ? 'bold' : 'normal'
        }}
        onClick={() => handleBottomNavClick(item.key)}
      >
        <div style={{ 
          fontSize: '20px', 
          marginBottom: '4px',
          color: isActive ? colors.primary : colors.textSecondary
        }}>
          {item.icon}
        </div>
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <AntLayout style={{ 
      minHeight: '100vh', 
      height: '100vh',
      width: '100%',
      maxWidth: '100vw',
      margin: 0,
      padding: 0,
      background: colors.background,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Mobile Header */}
      <Header style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: `0 2px 12px rgba(0, 0, 0, 0.1)`,
        width: '100%',
        maxWidth: '100vw',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        {/* App Title */}
        <div style={{ 
          color: colors.textWhite, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <img 
            src="/images/sycamore-logo.svg" 
            alt="Sycamore Church Logo" 
            style={{ 
              height: '32px', 
              width: 'auto',
              filter: 'brightness(0) invert(1)' // Makes SVG white
            }} 
          />
          <h2 style={{ 
            margin: 0, 
            color: colors.textWhite, 
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Sycamore Church
          </h2>
        </div>

        {/* User Actions */}
        <Space>
          {/* Theme Toggle */}
          <Button
            type="text"
            ghost
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ 
              color: colors.textWhite,
              border: 'none',
              backgroundColor: 'transparent'
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          />
          
          {user ? (
            <Dropdown
              menu={{ items: userDropdownItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar 
                src={user.profilePicture} 
                icon={<UserOutlined />}
                size="small"
                style={{ 
                  cursor: 'pointer', 
                  border: `2px solid ${colors.textWhite}`,
                  backgroundColor: colors.textWhite,
                  color: colors.primary
                }}
              />
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              size="small"
              ghost
              onClick={() => setAuthModalVisible(true)}
              style={{ 
                border: `1px solid ${colors.textWhite}`,
                color: colors.textWhite,
                fontWeight: 'bold'
              }}
            >
              SIGN IN
            </Button>
          )}
        </Space>
      </Header>

      {/* Main Content */}
      <Content style={{ 
        flex: 1,
        width: '100%',
        background: colors.background,
        paddingBottom: '80px', // Space for bottom navigation
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 64px)', // Full height minus header
        margin: 0,
        padding: '0 0 80px 0'
      }}>
        {children}
      </Content>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.background,
        borderTop: `1px solid ${colors.mint}`,
        display: 'flex',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: `0 -2px 8px ${colors.darkBlue}20`
      }}>
        {bottomNavItems.map(item => (
          <BottomNavItem key={item.key} item={item} />
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </AntLayout>
  );
};

export default Layout;
