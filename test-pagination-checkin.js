// Test pagination and check-in functionality
const API_BASE_URL = 'http://localhost:3000/api';

async function testPaginationAndCheckIn() {
  try {
    console.log('🔍 Testing events API with pagination...');
    const response = await fetch(`${API_BASE_URL}/mobile/events?page=1&limit=5`);
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    
    if (data.success) {
      console.log('\n📊 Pagination Info:');
      console.log('- Page:', data.pagination?.page);
      console.log('- Limit:', data.pagination?.limit);
      console.log('- Total Events:', data.pagination?.total);
      console.log('- Total Pages:', data.pagination?.totalPages);
      console.log('- Has Next Page:', data.pagination?.hasNextPage);
      console.log('- Events Returned:', data.data?.length);
      
      if (data.data && data.data.length > 0) {
        console.log('\n🎫 Check-in Status for Events:');
        data.data.forEach((event, index) => {
          console.log(`${index + 1}. ${event.title}`);
          console.log(`   Date: ${new Date(event.date).toLocaleDateString()}`);
          console.log(`   Can Check In: ${event.canCheckIn ? '✅ Yes' : '❌ No'}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ API returned error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaginationAndCheckIn();