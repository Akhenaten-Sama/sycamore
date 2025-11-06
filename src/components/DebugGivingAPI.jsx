import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const DebugGivingAPI = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('authToken');
    
    let tokenPayload = null;
    if (token) {
      try {
        const parts = token.split('.');
        tokenPayload = JSON.parse(atob(parts[1]));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    setDebugInfo({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'None',
      tokenPayload,
      user: user,
      userId: user.memberId || user.id,
      localStorage: Object.keys(localStorage)
    });
  }, []);

  const testAPI = async () => {
    setTesting(true);
    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('🧪 Testing Giving API...');
      console.log('User:', user);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      // Test stats API
      const statsResponse = await fetch('https://admin.sycamore.church/api/mobile/donations?type=stats', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const statsData = await statsResponse.json();
      console.log('📊 Stats API Response:', statsData);
      
      // Test history API
      const historyResponse = await fetch('https://admin.sycamore.church/api/mobile/donations?type=history', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const historyData = await historyResponse.json();
      console.log('📜 History API Response:', historyData);
      
      alert(`API Test Complete! Check console for details.\n\nStats: ${statsData.success ? 'SUCCESS' : 'FAILED'}\nHistory: ${historyData.success ? 'SUCCESS' : 'FAILED'}`);
      
    } catch (error) {
      console.error('API Test Error:', error);
      alert('API Test Failed! Check console for details.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'white', 
      padding: 20, 
      border: '1px solid #ccc',
      borderRadius: 8,
      zIndex: 9999,
      maxWidth: 300
    }}>
      <h4>🔍 Debug Info</h4>
      <div style={{ fontSize: '12px', marginBottom: 10 }}>
        <div><strong>Token:</strong> {debugInfo.hasToken ? '✅' : '❌'}</div>
        <div><strong>User ID:</strong> {debugInfo.userId || 'None'}</div>
        {debugInfo.tokenPayload && (
          <div style={{ fontSize: '10px', marginTop: 5 }}>
            <div><strong>JWT Member ID:</strong> {debugInfo.tokenPayload.memberId}</div>
            <div><strong>JWT Email:</strong> {debugInfo.tokenPayload.email}</div>
            <div><strong>JWT Role:</strong> {debugInfo.tokenPayload.role}</div>
            <div><strong>JWT Expires:</strong> {new Date(debugInfo.tokenPayload.exp * 1000).toLocaleString()}</div>
          </div>
        )}
        <div><strong>Storage Keys:</strong> {debugInfo.localStorage?.join(', ')}</div>
      </div>
      <Button 
        onClick={testAPI} 
        loading={testing}
        type="primary"
        size="small"
      >
        Test Giving API
      </Button>
    </div>
  );
};

export default DebugGivingAPI;