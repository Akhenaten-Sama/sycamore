import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import BlogPage from './pages/BlogPage';
import MembersPage from './pages/MembersPage';
import CommunitiesPage from './pages/CommunitiesPage';
import MediaPage from './pages/MediaPage';
import DevotionalsPage from './pages/DevotionalsPage';
import GivingPage from './pages/GivingPage';
import ProfilePage from './pages/ProfilePage';
import CommunityDetailsPage from './pages/CommunityDetailsPage';
import SermonNotesPage from './pages/SermonNotesPage';
import BiblePage from './pages/BiblePage';
import RequestFormsPage from './pages/RequestFormsPage';
import { getAntdTheme } from './styles/colors';

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <ErrorBoundary>
      <ConfigProvider theme={getAntdTheme(isDarkMode)}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/communities/:id" element={<CommunityDetailsPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/devotionals" element={<DevotionalsPage />} />
                <Route path="/giving" element={<GivingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/sermon-notes" element={<SermonNotesPage />} />
                <Route path="/bible" element={<BiblePage />} />
                <Route path="/requests" element={<RequestFormsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
