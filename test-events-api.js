// Test script to check events API
const API_BASE_URL = 'http://localhost:3000/api';

async function testEventsAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/mobile/events`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log('✅ Events API is working');
      console.log('Number of events:', data.data.length);
    } else {
      console.log('❌ Events API returned unexpected format');
    }
  } catch (error) {
    console.error('❌ Failed to call events API:', error.message);
    console.log('Make sure the admin backend is running on http://localhost:3000');
  }
}

testEventsAPI();