// Test script to check admin events API
const API_BASE_URL = 'http://localhost:3000/api';

async function testAdminEventsAPI() {
  try {
    // Test all events
    console.log('🔍 Testing admin events API (all events)...');
    const allResponse = await fetch(`${API_BASE_URL}/events`);
    const allData = await allResponse.json();
    
    console.log('All Events Response status:', allResponse.status);
    console.log('All events count:', allData.data ? allData.data.length : 0);
    
    // Test upcoming events
    console.log('\n🔍 Testing admin events API (upcoming only)...');
    const upcomingResponse = await fetch(`${API_BASE_URL}/events?upcoming=true`);
    const upcomingData = await upcomingResponse.json();
    
    console.log('Upcoming Events Response status:', upcomingResponse.status);
    console.log('Upcoming events count:', upcomingData.data ? upcomingData.data.length : 0);
    
    if (allData.success && allData.data) {
      console.log('\n📊 Event breakdown:');
      
      const baseEvents = allData.data.filter(e => !e.isRecurringInstance);
      const recurringInstances = allData.data.filter(e => e.isRecurringInstance);
      
      console.log(`- Base events: ${baseEvents.length}`);
      console.log(`- Recurring instances: ${recurringInstances.length}`);
      console.log(`- Total: ${allData.data.length}`);
      
      // Group by event name
      const eventGroups = {};
      allData.data.forEach(event => {
        if (!eventGroups[event.name]) {
          eventGroups[event.name] = 0;
        }
        eventGroups[event.name]++;
      });
      
      console.log('\n📋 Events by name:');
      for (const [name, count] of Object.entries(eventGroups)) {
        console.log(`- ${name}: ${count} instances`);
      }
      
      if (allData.data.length > 50) {
        console.log('\n⚠️  Still too many events! Consider further optimization.');
      } else {
        console.log('\n✅ Event count looks good now!');
      }
    } else {
      console.log('❌ Events API returned unexpected format');
    }
  } catch (error) {
    console.error('❌ Failed to call admin events API:', error.message);
    console.log('Make sure the admin backend is running on http://localhost:3000');
  }
}

testAdminEventsAPI();