// API Configuration and Client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
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
    return this.request('/mobile/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Mobile APIs
  async getUserJourney() {
    return this.request('/mobile/journey');
  }

  async getEvents(type = 'upcoming') {
    return this.request(`/mobile/events?type=${type}`);
  }

  async checkInToEvent(eventId) {
    return this.request('/mobile/events', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
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

  async addMediaComment(commentData) {
    return this.request('/mobile/media/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Devotionals endpoints
  async getDevotionals() {
    return this.request('/mobile/devotionals');
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
    return this.request(`/mobile/members/${userId}/giving`);
  }

  async getGivingStats(userId) {
    return this.request(`/mobile/members/${userId}/giving-stats`);
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
}

export const apiClient = new ApiClient();
export default apiClient;
