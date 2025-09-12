import React from 'react';
import MediaGallery from '../components/MediaGallery';
import { useAuth } from '../contexts/AuthContext';

const MediaPage = () => {
  const { user } = useAuth();
  
  return <MediaGallery user={user} />;
};

export default MediaPage;
