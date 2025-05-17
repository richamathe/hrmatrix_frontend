import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { supportMessages } from '../../Utils/InitialDataValues/ProjectsData';
// Import mock auth service instead of real API
import { mockAuthService as authService } from '../../services/mockAuthService';

const API_URL = 'https://hrmatrix-backend.onrender.com/api';

// Check if user is already logged in from localStorage
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const storedToken = localStorage.getItem('token');

// Get available roles from localStorage
const storedRoles = localStorage.getItem('availableRoles')
  ? JSON.parse(localStorage.getItem('availableRoles'))
  : [];

const initialState = {
  token: localStorage.getItem('token'),
  isLoggedIn: !!storedToken,
  user: storedUser,
  supportData: supportMessages,
  loading: false,
  error: null,
  availableRoles: storedRoles,
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(`${API_URL}/auth/register`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      };

      const response = await axios.get(`${API_URL}/auth/me`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLogInUser: (state, action) => {
      state.user = action.payload;
    },
    setSupportData: (state, action) => {
      if (!state.supportData) {
        state.supportData = [];
      }
      state.supportData.push({ ...action.payload, id: Date.now() });
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setIsLoggedIn, setLogInUser, clearUser, setSupportData, clearError, logout } =
  authSlice.actions;
export default authSlice.reducer;
