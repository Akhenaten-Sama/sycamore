import React, { useState } from 'react';
import { Avatar, Modal, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';

const ProfilePage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editKinVisible, setEditKinVisible] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: colors.text }}>
          <h2>Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  const ProfileField = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e8e8e8'}`
    }}>
      <span style={{ 
        fontSize: '14px',
        color: isDarkMode ? '#888' : '#666'
      }}>
        {label}
      </span>
      <span style={{ 
        fontSize: '14px',
        color: colors.text,
        fontWeight: 500,
        textAlign: 'right',
        maxWidth: '60%'
      }}>
        {value || 'NIL'}
      </span>
    </div>
  );

  const SectionCard = ({ title, buttonText, onEdit, children }) => (
    <div style={{
      margin: '0 20px 20px',
      padding: '20px',
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: '12px',
      border: isDarkMode ? 'none' : '1px solid #e0e0e0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          fontSize: '18px',
          fontWeight: 'bold',
          color: colors.text,
          margin: 0
        }}>
          {title}
        </h3>
        <Button
          onClick={onEdit}
          style={{
            background: isDarkMode ? '#2a2a2a' : '#f5f5f5',
            border: 'none',
            color: colors.text,
            borderRadius: '8px',
            padding: '4px 16px',
            fontSize: '14px',
            height: 'auto'
          }}
        >
          {buttonText}
        </Button>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      paddingTop: '16px',
      paddingBottom: '80px'
    }}>
      {/* Page Title */}
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
          My Profile
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: isDarkMode ? '#999' : '#666',
          margin: 0
        }}>
          Join communities to connect with fellow believers
        </p>
      </div>

      {/* User Profile Header */}
      <div style={{
        margin: '0 20px 24px',
        padding: '16px',
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderRadius: '12px',
        border: isDarkMode ? 'none' : '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative'
      }}>
        <Avatar 
          size={64}
          style={{ 
            backgroundColor: '#5a4a7a',
            fontSize: '24px',
            fontWeight: 'bold',
            flexShrink: 0
          }}
        >
          {getInitials(user.name || user.firstName + ' ' + user.lastName)}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: '4px'
          }}>
            {user.name || `${user.firstName} ${user.lastName}`}
          </div>
          <div style={{ 
            fontSize: '14px',
            color: isDarkMode ? '#888' : '#666'
          }}>
            {user.email}
          </div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#5a4a7a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <EditOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      </div>

      {/* Profile Details Section */}
      <SectionCard 
        title="Profile Details" 
        buttonText="Edit profile"
        onEdit={() => setEditProfileVisible(true)}
      >
        <ProfileField label="First Name" value={user.firstName || user.name?.split(' ')[0]} />
        <ProfileField label="Last Name" value={user.lastName || user.name?.split(' ')[1]} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Phone Number" value={user.phone} />
        <ProfileField label="Address" value={user.address} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px'
        }}>
          <span style={{ 
            fontSize: '14px',
            color: isDarkMode ? '#888' : '#666'
          }}>
            Date of Birth
          </span>
          <span style={{ 
            fontSize: '14px',
            color: colors.text,
            fontWeight: 500
          }}>
            {user.dateOfBirth || 'Not provided'}
          </span>
        </div>
      </SectionCard>

      {/* Kin Details Section */}
      <SectionCard 
        title="Kin Details" 
        buttonText="Edit details"
        onEdit={() => setEditKinVisible(true)}
      >
        <ProfileField label="Full Name" value={user.kinName} />
        <ProfileField label="Phone Number" value={user.kinPhone} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px'
        }}>
          <span style={{ 
            fontSize: '14px',
            color: isDarkMode ? '#888' : '#666'
          }}>
            Relationship
          </span>
          <span style={{ 
            fontSize: '14px',
            color: colors.text,
            fontWeight: 500
          }}>
            {user.kinRelationship || 'Not provided'}
          </span>
        </div>
      </SectionCard>

      {/* Other Details Section */}
      <div style={{
        margin: '0 20px 20px',
        padding: '20px',
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderRadius: '12px',
        border: isDarkMode ? 'none' : '1px solid #e0e0e0'
      }}>
        <h3 style={{ 
          fontSize: '18px',
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: '16px'
        }}>
          Other Details
        </h3>
        <ProfileField 
          label="Member Since" 
          value={user.memberSince ? new Date(user.memberSince).toLocaleDateString() : user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'} 
        />
        <ProfileField 
          label="Status" 
          value={
            <span style={{ color: '#4caf50', fontWeight: 600 }}>
              {user.status || 'Active'}
            </span>
          } 
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px'
        }}>
          <span style={{ 
            fontSize: '14px',
            color: isDarkMode ? '#888' : '#666'
          }}>
            Role
          </span>
          <span style={{ 
            fontSize: '14px',
            color: colors.text,
            fontWeight: 500
          }}>
            {user.role || 'Member'}
          </span>
        </div>
      </div>

      {/* Edit Profile Modal - TODO: Implement */}
      <Modal
        title="Edit Profile"
        open={editProfileVisible}
        onCancel={() => setEditProfileVisible(false)}
        footer={null}
      >
        <p>Edit profile form coming soon...</p>
      </Modal>

      {/* Edit Kin Modal - TODO: Implement */}
      <Modal
        title="Edit Kin Details"
        open={editKinVisible}
        onCancel={() => setEditKinVisible(false)}
        footer={null}
      >
        <p>Edit kin details form coming soon...</p>
      </Modal>
    </div>
  );
};

export default ProfilePage;
