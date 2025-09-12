import React from 'react';
import Devotionals from '../components/Devotionals';
import { useAuth } from '../contexts/AuthContext';

const DevotionalsPage = () => {
  const { user } = useAuth();
  
  return <Devotionals user={user} />;
};

export default DevotionalsPage;
