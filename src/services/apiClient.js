// API Configuration and Client
const API_BASE_URL =  'https://admin.sycamore.church/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different content types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }
      
      if (!response.ok) {
        // Extract error message from different response formats
        let errorMessage = 'An error occurred';
        
        if (data && typeof data === 'object') {
          errorMessage = data.message || data.error || data.msg || 
                        (data.errors && Array.isArray(data.errors) ? data.errors.join(', ') : '') ||
                        `HTTP ${response.status}: ${response.statusText}`;
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Always return the full response for auth endpoints to preserve structure
      if (endpoint.includes('/auth/')) {
        return data;
      }
      
      // For mobile endpoints, also return full response to preserve success/message structure
      if (endpoint.includes('/mobile/')) {
        return data;
      }
      
      // If the response has a success field and data field, return just the data
      if (data.success && data.data !== undefined) {
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.request('/auth/mobile/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/mobile/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/mobile/profile');
  }

  async updateProfile(profileData) {
    // Using POST as a workaround for Next.js route issues
    return this.request('/mobile/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/mobile/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/mobile/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async changePassword(currentPassword, newPassword, isFirstTime = false) {
    return this.request('/auth/mobile/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, isFirstTime }),
    });
  }

  // Mobile APIs
  async getUserJourney() {
    return this.request('/mobile/journey');
  }

  async getEvents(type = 'upcoming', page = 1, limit = 20) {
    return this.request(`/mobile/events?type=${type}&page=${page}&limit=${limit}`);
  }

  async checkInToEvent(eventId, eventDate = null) {
    const payload = { eventId };
    if (eventDate) {
      payload.eventDate = eventDate;
    }
    return this.request('/mobile/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getBlogPosts(page = 1, limit = 10) {
    return this.request(`/mobile/blog?page=${page}&limit=${limit}`);
  }

  async getTeams() {
    return this.request('/mobile/teams');
  }

  async getCommunities(type = 'all') {
    return this.request(`/mobile/communities?type=${type}`);
  }

  async joinCommunity(communityId, memberId) {
    return this.request(`/mobile/members/${memberId}/communities`, {
      method: 'POST',
      body: JSON.stringify({ communityId }),
    });
  }

  async leaveCommunity(communityId) {
    return this.request('/mobile/communities', {
      method: 'POST',
      body: JSON.stringify({ communityId, action: 'leave' }),
    });
  }

  // Member-specific endpoints
  async getMemberStats(userId) {
    return this.request(`/mobile/members/${userId}/stats`);
  }

  async getMemberActivity(userId) {
    return this.request(`/mobile/members/${userId}/activity`);
  }

  async getMemberTasks(userId) {
    return this.request(`/mobile/members/${userId}/tasks`);
  }

  async getMemberJourney(userId) {
    return this.request(`/mobile/members/${userId}/journey`);
  }

  async completeTask(taskId) {
    return this.request(`/mobile/tasks/${taskId}/complete`, {
      method: 'POST'
    });
  }

  // Extended Communities endpoints
  async getMemberCommunities(userId) {
    return this.request(`/mobile/members/${userId}/communities`);
  }

  async createCommunity(communityData) {
    return this.request('/mobile/communities', {
      method: 'POST',
      body: JSON.stringify(communityData)
    });
  }

  async getCommunityDetails(communityId) {
    return this.request(`/mobile/communities/${communityId}`);
  }

  async createCommunityPost(communityId, postData) {
    return this.request(`/mobile/communities/${communityId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  }

  async addCommunityPostComment(postId, commentData) {
    return this.request(`/mobile/communities/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async likeCommunityPost(postId, userId) {
    return this.request(`/mobile/communities/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  // Children/Ward management
  async getChildren(parentId) {
    return this.request(`/mobile/children?parentId=${parentId}`);
  }

  async addChild(childData) {
    return this.request('/mobile/children', {
      method: 'POST',
      body: JSON.stringify(childData)
    });
  }

  // Daily check-in for children (not tied to event)
  async dailyChildCheckIn(parentId, childrenIds) {
    return this.request('/mobile/children/checkin', {
      method: 'POST',
      body: JSON.stringify({ parentId, childrenIds })
    });
  }

  async getDailyCheckInStatus(parentId) {
    return this.request(`/mobile/children/checkin?parentId=${parentId}`);
  }

  // Self-attendance management
  async markAttendance(eventId, userId, childrenIds = []) {
    return this.request('/mobile/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ 
        eventId, 
        userId,
        childrenIds 
      })
    });
  }

  async getMyAttendance(userId, eventId = null) {
    const params = new URLSearchParams({ userId });
    if (eventId) params.append('eventId', eventId);
    return this.request(`/mobile/attendance/my?${params}`);
  }

  // Sermon Challenge endpoints
  async submitSermonChallenge(submissionData) {
    return this.request('/mobile/sermon-challenges/submit', {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  }

  async getSermonChallenges(eventId) {
    return this.request(`/mobile/sermon-challenges/${eventId}`);
  }

  // Community management endpoints
  async inviteMemberToCommunity(communityId, memberId) {
    return this.request(`/mobile/communities/${communityId}/manage`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'invite-member',
        memberId
      })
    });
  }

  async inviteMultipleMembersToCommunity(communityId, memberIds) {
    return this.request(`/mobile/communities/${communityId}/manage`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'invite-member',
        memberIds
      })
    });
  }

  async approveJoinRequest(communityId, memberId) {
    return this.request(`/mobile/communities/${communityId}/manage`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'approve-request',
        memberId
      })
    });
  }

  async rejectJoinRequest(communityId, memberId) {
    return this.request(`/mobile/communities/${communityId}/manage`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'reject-request',
        memberId
      })
    });
  }

  async removeInvitation(communityId, memberId) {
    return this.request(`/mobile/communities/${communityId}/manage`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'remove-invitation',
        memberId
      })
    });
  }

  async getCommunityManagementData(communityId) {
    return this.request(`/mobile/communities/${communityId}/manage`);
  }

  async requestJoinCommunity(communityId) {
    return this.request('/mobile/communities', {
      method: 'POST',
      body: JSON.stringify({
        communityId,
        action: 'request-join'
      })
    });
  }

  async cancelJoinRequest(communityId) {
    return this.request('/mobile/communities', {
      method: 'POST',
      body: JSON.stringify({
        communityId,
        action: 'cancel-request'
      })
    });
  }

  async searchMembers(query) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/mobile/members/search?${params}`);
  }

  // Media endpoints
  async getMedia() {
    return this.request('/mobile/media');
  }

  async getMediaComments(mediaId) {
    return this.request(`/mobile/media/${mediaId}/comments`);
  }

  async likeMedia(mediaId) {
    return this.request(`/mobile/media/${mediaId}/like`, {
      method: 'POST'
    });
  }

  async addMediaComment(mediaId, commentData) {
    return this.request(`/mobile/media/${mediaId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Devotionals endpoints
  async getDevotionals(userId = null, limit = 7) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (limit) params.append('limit', limit.toString());
    const queryString = params.toString();
    return this.request(`/mobile/devotionals${queryString ? '?' + queryString : ''}`);
  }

  async getDevotionalStats(userId) {
    return this.request(`/mobile/devotional-stats?userId=${userId}`);
  }

  async getDevotionalComments(devotionalId) {
    return this.request(`/mobile/devotional-comments?devotionalId=${devotionalId}`);
  }

  async addDevotionalComment(commentData) {
    return this.request('/mobile/devotional-comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async likeDevotional(devotionalId, userId) {
    return this.request('/mobile/devotional-likes', {
      method: 'POST',
      body: JSON.stringify({ devotionalId, userId })
    });
  }

  async getDevotionalLikes(devotionalId, userId) {
    const params = new URLSearchParams({ devotionalId });
    if (userId) params.append('userId', userId);
    return this.request(`/mobile/devotional-likes?${params}`);
  }

  async markDevotionalAsRead(devotionalId, userId) {
    return this.request('/mobile/devotional-stats', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        devotionalId,
        date: new Date().toISOString()
      })
    });
  }

  // Giving endpoints
  async getGivingHistory(userId) {
    return this.request(`/mobile/donations?type=history`);
  }

  async getGivingStats(userId) {
    return this.request(`/mobile/donations?type=stats`);
  }

  async processDonation(donationData) {
    return this.request('/mobile/donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
  }

  // Blog comments endpoint
  async getBlogComments(blogId) {
    return this.request(`/mobile/blog/${blogId}/comments`);
  }

  async addBlogComment(commentData) {
    return this.request('/mobile/blog/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async likeBlogPost(blogId) {
    return this.request(`/mobile/blog/${blogId}/like`, {
      method: 'POST'
    });
  }

  // Community viewing endpoints
  async getCommunityDetails(communityId) {
    return this.request(`/mobile/communities/${communityId}`);
  }

  async createCommunityPost(communityId, postData) {
    return this.request(`/mobile/communities/${communityId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  }

  async likeCommunityPost(postId, userId) {
    return this.request(`/mobile/communities/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  async addCommunityPostComment(postId, commentData) {
    return this.request(`/mobile/communities/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Sermon Notes endpoints
  async getSermonNotes(userId) {
    return this.request(`/mobile/sermon-notes?userId=${userId}`);
  }

  async createSermonNote(noteData) {
    return this.request('/mobile/sermon-notes', {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  }

  async updateSermonNote(noteId, noteData) {
    return this.request(`/mobile/sermon-notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData)
    });
  }

  async deleteSermonNote(noteId) {
    return this.request(`/mobile/sermon-notes/${noteId}`, {
      method: 'DELETE'
    });
  }

  async getSermonNote(noteId) {
    return this.request(`/mobile/sermon-notes/${noteId}`);
  }

  // Forms API
  async getForms() {
    return this.request('/mobile/forms');
  }

  async submitForm(formId, formData) {
    return this.request(`/mobile/forms/${formId}`, {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }

  // Testimonies API
  async getTestimonies(page = 1, limit = 20, userId = null) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (userId) params.append('userId', userId);
    return this.request(`/mobile/testimonies?${params}`);
  }

  async submitTestimony(testimonyData) {
    return this.request('/mobile/testimonies', {
      method: 'POST',
      body: JSON.stringify(testimonyData)
    });
  }

  async updateTestimony(testimonyId, testimonyData) {
    return this.request(`/mobile/testimonies/${testimonyId}`, {
      method: 'PUT',
      body: JSON.stringify(testimonyData)
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
