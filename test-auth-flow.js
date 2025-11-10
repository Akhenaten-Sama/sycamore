// Auth Debug Script
const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Login
    console.log('🔑 Testing login...');
    const loginResponse = await fetch(`${API_BASE}/auth/mobile/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'olalekanefunkunle@gmail.com',
        password: 'your_password_here' // Replace with actual password
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login Response:', {
      success: loginData.success,
      hasToken: !!loginData.token,
      hasUser: !!loginData.user,
      userInfo: loginData.user ? {
        id: loginData.user.id,
        firstName: loginData.user.firstName,
        profileComplete: loginData.user.profileComplete,
        mustChangePassword: loginData.user.mustChangePassword
      } : null
    });

    if (loginData.token) {
      // Test 2: Profile check with token
      console.log('\n📋 Testing profile API with token...');
      const profileResponse = await fetch(`${API_BASE}/auth/mobile/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      const profileData = await profileResponse.json();
      console.log('Profile Response:', {
        success: profileData.success,
        hasUser: !!profileData.user,
        userInfo: profileData.user ? {
          id: profileData.user.id,
          firstName: profileData.user.firstName,
          profileComplete: profileData.user.profileComplete,
          mustChangePassword: profileData.user.mustChangePassword
        } : null
      });

      // Test 3: Check if responses match
      console.log('\n🔍 Comparing login and profile responses...');
      const loginUser = loginData.user;
      const profileUser = profileData.user;
      
      console.log('Comparison:', {
        idsMatch: loginUser?.id === profileUser?.id,
        profileCompleteMatch: loginUser?.profileComplete === profileUser?.profileComplete,
        mustChangePasswordMatch: loginUser?.mustChangePassword === profileUser?.mustChangePassword
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Note: You'll need to replace the password with the actual password
console.log('⚠️  Remember to replace the password in the script before running!');
// testAuth();