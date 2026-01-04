import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarOutlined, 
  BookOutlined, 
  TeamOutlined, 
  GiftOutlined, 
  StarOutlined,
  BulbOutlined,
  LogoutOutlined,
  DeleteOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Modal } from 'antd';
import { getColors } from '../styles/colors';

const MorePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const colors = getColors(isDarkMode);

  console.log('MorePage rendered, user:', user);

  useEffect(() => {
    console.log('MorePage mounted');
    return () => console.log('MorePage unmounted');
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Log Out',
      content: 'Are you sure you want to log out?',
      okText: 'Log Out',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
        style: { background: '#d92d2d', borderColor: '#d92d2d' }
      },
      onOk: () => {
        logout();
        navigate('/');
      }
    });
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Delete Account',
      content: 'Are you sure you want to delete your account? This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
        style: { background: '#d92d2d', borderColor: '#d92d2d' }
      },
      onOk: () => {
        // TODO: Implement account deletion
        console.log('Delete account');
      }
    });
  };

  const menuItems = [
    {
      icon: <UserAddOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Junior Church Check-In',
      onClick: () => navigate('/junior-church-checkin')
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Attendance Streak',
      badge: 1,
      onClick: () => navigate('/attendance-streak')
    },
    {
      icon: <BookOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Devotional Streak',
      badge: 1,
      onClick: () => navigate('/devotionals')
    },
    {
      icon: <TeamOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Communities',
      onClick: () => navigate('/communities')
    },
    {
      icon: <GiftOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Total Giving',
      onClick: () => navigate('/giving')
    },
    {
      icon: <StarOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Saved',
      onClick: () => navigate('/sermon-notes')
    },
    {
      icon: <BulbOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Appearance',
      onClick: toggleTheme
    },
    {
      icon: <LogoutOutlined style={{ fontSize: '24px', color: isDarkMode ? '#4a9d9d' : '#2d7a7a' }} />,
      label: 'Log Out',
      onClick: handleLogout
    },
    {
      icon: <DeleteOutlined style={{ fontSize: '24px', color: '#d92d2d' }} />,
      label: 'Delete Account',
      onClick: handleDeleteAccount
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      paddingTop: '16px',
      paddingBottom: '80px'
    }}>
      {/* Page Title and Description */}
      <div style={{ 
        padding: '0 20px',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: '8px'
        }}>
          More
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: isDarkMode ? '#999' : '#666',
          margin: 0
        }}>
          Life is better together! Connect, share, and do life with your church family.
        </p>
      </div>

      {/* User Profile Section */}
      {user && (
        <div 
          style={{
            margin: '0 20px 24px',
            padding: '16px',
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: '12px',
            border: isDarkMode ? 'none' : '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/profile')}
        >
          <Avatar 
            size={64}
            style={{ 
              backgroundColor: '#5a4a7a',
              fontSize: '24px',
              fontWeight: 'bold',
              flexShrink: 0
            }}
          >
            {getInitials(user.firstName || user.email)}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '4px'
            }}>
              {user.firstName || 'User'}{user.lastName ? ` ${user.lastName}` : ''}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: isDarkMode ? '#4a9d9d' : '#2d7a7a',
              cursor: 'pointer'
            }}>
              View profile
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div style={{ padding: '0 20px' }}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: index < menuItems.length - 1 ? `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}` : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onClick={item.onClick}
          >
            <div style={{ 
              width: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div style={{ 
              flex: 1,
              fontSize: '16px',
              color: item.label === 'Delete Account' ? '#d92d2d' : colors.text,
              fontWeight: 400
            }}>
              {item.label}
            </div>
            {item.badge && (
              <Badge 
                count={item.badge} 
                style={{ 
                  backgroundColor: '#ff9500',
                  fontSize: '12px',
                  height: '20px',
                  minWidth: '20px',
                  lineHeight: '20px'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MorePage;
