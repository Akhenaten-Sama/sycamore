import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileCompletionModal from './ProfileCompletionModal';
import PasswordChangeModal from './PasswordChangeModal';

const AuthenticationGuard = ({ children }) => {
  const { 
    user, 
    showProfileCompletion, 
    setShowProfileCompletion,
    showPasswordChange,
    setShowPasswordChange
  } = useAuth();

  const handleProfileCompletion = () => {
    setShowProfileCompletion(false);
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(false);
    // After password change, check if profile needs completion
    if (user && !user.profileComplete) {
      setShowProfileCompletion(true);
    }
  };

  return (
    <>
      {children}
      
      {/* Password Change Modal - highest priority */}
      <PasswordChangeModal
        visible={showPasswordChange}
        onClose={handlePasswordChange}
        isFirstTime={user?.mustChangePassword}
      />
      
      {/* Profile Completion Modal - secondary priority */}
      <ProfileCompletionModal
        visible={showProfileCompletion && !showPasswordChange}
        onClose={handleProfileCompletion}
        user={user}
      />
    </>
  );
};

export default AuthenticationGuard;