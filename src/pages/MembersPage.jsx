import React from 'react';
import MemberDashboard from '../components/MemberDashboard';
import { useAuth } from '../contexts/AuthContext';

const MembersPage = () => {
  const { user } = useAuth();
  
  return <MemberDashboard user={user} />;
};

export default MembersPage;
