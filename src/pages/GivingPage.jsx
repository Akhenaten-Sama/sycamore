import React from 'react';
import Giving from '../components/Giving';
import { useAuth } from '../contexts/AuthContext';

const GivingPage = () => {
  const { user } = useAuth();
  
  return <Giving user={user} />;
};

export default GivingPage;
