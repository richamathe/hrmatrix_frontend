import axios from 'axios';

// Try to use the main API, but fall back to the test server if needed
const API_URL = 'https://hrmatrix-backend.onrender.com/api';
const TEST_API_URL = 'https://hrmatrix-backend.onrender.com/api';

// Flag to track if we're using the test server
let usingTestServer = false;

// Create axios instance with test server by default
const api = axios.create({
  baseURL: TEST_API_URL, // Always use test server
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 second timeout
});

// Set flag to indicate we're using the test server
usingTestServer = true;
console.log('Using test server by default');

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Store available roles if present
        if (response.data.availableRoles) {
          localStorage.setItem('availableRoles', JSON.stringify(response.data.availableRoles));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Store available roles if present
        if (response.data.availableRoles) {
          localStorage.setItem('availableRoles', JSON.stringify(response.data.availableRoles));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Set active role
  setActiveRole: (role) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.role = role;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('availableRoles');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// User services
export const userService = {
  // Get all users (HR/Admin only)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Get user by ID (HR/Admin only)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update user (HR/Admin only)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

// Employee services
export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees/all');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

export const getAllEmployees = () => api.get('/users/all');
export const getBirthdaysThisMonth = (month) => api.get('/users/birthdays', { params: { month } });
export const getDepartmentStats = () => api.get('/users/department-stats');

export default api;
