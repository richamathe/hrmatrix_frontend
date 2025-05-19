import api from './api';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      console.log('Fetching users from API...');
      const response = await api.get('/users/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Raw API response:', response);
      if (!response.data.success) {
        throw new Error('Failed to fetch users');
      }
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data.success) {
        throw new Error('Failed to fetch user');
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data.success) {
        throw new Error('Failed to create user');
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data.success) {
        throw new Error('Failed to update user');
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data.success) {
        throw new Error('Failed to delete user');
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/users/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data.success) {
        throw new Error('Failed to update user status');
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
}; 