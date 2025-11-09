import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.getProfile();
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Check if user needs to change password or complete profile
        if (response.user.mustChangePassword) {
          setShowPasswordChange(true);
        } else if (!response.user.profileComplete) {
          setShowProfileCompletion(true);
        }
      } else {
        // Invalid token, clear it
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Check if user needs to change password or complete profile
        if (response.user.mustChangePassword) {
          setShowPasswordChange(true);
          message.success('Welcome! Please set your new password.');
        } else if (!response.user.profileComplete) {
          setShowProfileCompletion(true);
          message.success('Welcome back! Please complete your profile.');
        } else {
          message.success('Welcome back! 🎉');
        }
        
        return { success: true };
      } else {
        // Just show the error message from API
        const errorMessage = response?.message || 'Login failed';
        message.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        message.success('Registration successful! Welcome to Sycamore Church! 🙏');
        return { success: true };
      } else {
        message.error(response?.message || 'Registration failed');
        return { success: false, error: response?.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    message.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.updateProfile({
        ...profileData,
        userId: user.memberId || user.id
      });
      
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          ...profileData
        }));
        return { success: true };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    showProfileCompletion,
    setShowProfileCompletion,
    showPasswordChange,
    setShowPasswordChange,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
