import React, { useState } from 'react';
import { Layout as AntLayout, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  CalendarOutlined, 
  VideoCameraOutlined, 
  BookOutlined, 
  HeartOutlined, 
  UserOutlined,
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  CompassOutlined,
  BulbOutlined,
  FormOutlined,
  SunOutlined,
  MoonOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';
import { getColors } from '../styles/colors';

// Import menu icons
import GiveIcon from '../assets/icons/homepage/give.svg';
import ConnectIcon from '../assets/icons/homepage/connect.svg';
import ResourcesIcon from '../assets/icons/homepage/resources.svg';
import MoreIcon from '../assets/icons/homepage/more.svg';

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
      icon: <img src={ConnectIcon} style={{ width: '24px', height: '24px', filter: isDarkMode ? 'none' : 'invert(1)' }} />,
      label: 'Connect',
    },
    {
      key: '/giving',
      icon: <img src={GiveIcon} style={{ width: '24px', height: '24px', filter: isDarkMode ? 'none' : 'invert(1)' }} />,
      label: 'Give',
    },
    {
      key: '/resources',
      icon: <img src={ResourcesIcon} style={{ width: '24px', height: '24px', filter: isDarkMode ? 'none' : 'invert(1)' }} />,
      label: 'Resources',
    },
    {
      key: '/more',
      icon: <img src={MoreIcon} style={{ width: '24px', height: '24px', filter: isDarkMode ? 'none' : 'invert(1)' }} />,
      label: 'More',
    },
  ];

  const handleBottomNavClick = (path) => {
    if (path === '/more') {
      // Navigate to More page
      navigate('/more');
    } else if (path === '/resources') {
      // Navigate to media or create resources page
      navigate('/media');
    } else {
      navigate(path);
    }
  };

  const BottomNavItem = ({ item }) => {
    // Special handling for home route
    const isActive = item.key === '/' 
      ? location.pathname === '/'
      : location.pathname === item.key || location.pathname.startsWith(item.key + '/');
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 4px',
          cursor: 'pointer',
          color: isActive ? (isDarkMode ? '#4a9d9d' : '#2d7a7a') : (isDarkMode ? '#888' : '#666'),
          fontSize: '11px',
          flex: 1,
          transition: 'color 0.3s',
          fontWeight: isActive ? 600 : 400
        }}
        onClick={() => handleBottomNavClick(item.key)}
      >
        <div style={{ 
          fontSize: '22px', 
          marginBottom: '2px',
          color: isActive ? (isDarkMode ? '#4a9d9d' : '#2d7a7a') : (isDarkMode ? '#888' : '#666')
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
        background: isDarkMode ? '#000000' : '#ffffff',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'none',
        borderBottom: isDarkMode ? '1px solid #1a1a1a' : '1px solid #e8e8e8',
        width: '100%',
        maxWidth: '100vw',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        {/* App Title */}
        <div style={{ 
          color: isDarkMode ? '#ffffff' : '#000000',
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <img 
            src="/images/sycamore-logo.svg" 
            alt="Sycamore Church Logo" 
            style={{ 
              height: '28px', 
              width: 'auto',
              filter: isDarkMode ? 'brightness(0) invert(1)' : 'none'
            }} 
          />
          <h2 style={{ 
            margin: 0, 
            color: isDarkMode ? '#ffffff' : '#000000',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            SYCAMORE
          </h2>
        </div>

        {/* User Actions */}
        <Space size={8}>
          {/* Theme Toggle */}
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ 
              color: isDarkMode ? '#ffffff' : '#000000',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
                  border: `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
            </Dropdown>
          ) : (
            <Button 
              type="default"
              size="small"
              onClick={() => setAuthModalVisible(true)}
              style={{ 
                border: `1px solid ${isDarkMode ? '#333' : '#d9d9d9'}`,
                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                fontWeight: 500,
                borderRadius: '6px',
                padding: '4px 16px',
                fontSize: '14px'
              }}
            >
              Sign in
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
        background: isDarkMode ? '#000000' : '#ffffff',
        borderTop: `1px solid ${isDarkMode ? '#1a1a1a' : '#e8e8e8'}`,
        display: 'flex',
        padding: '4px 0 6px',
        zIndex: 1000,
        boxShadow: 'none'
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
