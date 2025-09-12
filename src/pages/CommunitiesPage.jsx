import React from 'react';
import Communities from '../components/Communities';
import { useAuth } from '../contexts/AuthContext';

const CommunitiesPage = () => {
  const { user } = useAuth();
  
  return <Communities user={user} />;
};

export default CommunitiesPage;
