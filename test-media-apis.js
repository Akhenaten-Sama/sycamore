// Test script for media APIs
const API_BASE = 'http://localhost:3000/api';

async function testMediaAPIs() {
  console.log('🧪 Testing Media APIs...\n');

  try {
    // Test 1: Get media items
    console.log('📸 Testing GET /mobile/media...');
    const mediaResponse = await fetch(`${API_BASE}/mobile/media`);
    const mediaData = await mediaResponse.json();
    console.log('Media API Response:', {
      success: mediaData.success,
      count: mediaData.data?.length || 0,
      total: mediaData.total,
      firstItem: mediaData.data?.[0] || 'No items'
    });

    if (mediaData.data?.length > 0) {
      const firstMediaId = mediaData.data[0].id;
      console.log(`\n💬 Testing GET /mobile/media/${firstMediaId}/comments...`);
      
      // Test 2: Get comments for first media item
      const commentsResponse = await fetch(`${API_BASE}/mobile/media/${firstMediaId}/comments`);
      const commentsData = await commentsResponse.json();
      console.log('Comments API Response:', {
        success: commentsData.success,
        count: commentsData.data?.length || 0,
        comments: commentsData.data || 'No comments'
      });

      // Test 3: Try to add a comment (this will fail without auth token)
      console.log(`\n➕ Testing POST /mobile/media/${firstMediaId}/comments (without auth)...`);
      const addCommentResponse = await fetch(`${API_BASE}/mobile/media/${firstMediaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: 'Test comment from script'
        })
      });
      const addCommentData = await addCommentResponse.json();
      console.log('Add Comment Response:', addCommentData);

      // Test 4: Try to like (this will also fail without auth token)
      console.log(`\n❤️ Testing POST /mobile/media/${firstMediaId}/like (without auth)...`);
      const likeResponse = await fetch(`${API_BASE}/mobile/media/${firstMediaId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const likeData = await likeResponse.json();
      console.log('Like Response:', likeData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMediaAPIs();