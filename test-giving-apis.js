// Test script to debug giving API issues
// Run this in the browser console to test the APIs

const testAPIs = async () => {
  console.log('🧪 Testing Giving APIs...');
  
  const API_BASE_URL = 'https://admin.sycamore.church/api';
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  // Test 1: Get giving stats
  try {
    console.log('📊 Testing giving stats API...');
    const statsResponse = await fetch(`${API_BASE_URL}/mobile/donations?type=stats`, {
      headers
    });
    const statsData = await statsResponse.json();
    console.log('Stats response:', statsData);
  } catch (error) {
    console.error('Stats API error:', error);
  }

  // Test 2: Get giving history
  try {
    console.log('📜 Testing giving history API...');
    const historyResponse = await fetch(`${API_BASE_URL}/mobile/donations?type=history`, {
      headers
    });
    const historyData = await historyResponse.json();
    console.log('History response:', historyData);
  } catch (error) {
    console.error('History API error:', error);
  }

  // Test 3: Get all giving records (admin)
  try {
    console.log('🗃️ Testing admin giving records API...');
    const adminResponse = await fetch(`${API_BASE_URL}/giving`, {
      headers
    });
    const adminData = await adminResponse.json();
    console.log('Admin giving records:', adminData);
  } catch (error) {
    console.error('Admin API error:', error);
  }

  // Test 4: Check user data
  console.log('👤 Current user data:', {
    authToken: token ? 'Present' : 'Missing',
    localStorage: Object.keys(localStorage)
  });
};

// Run the test
testAPIs();