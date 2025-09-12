import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommunityView from '../components/CommunityView';

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/communities');
  };
  
  return (
    <CommunityView 
      communityId={id}
      onBack={handleBack}
    />
  );
};

export default CommunityDetailsPage;
