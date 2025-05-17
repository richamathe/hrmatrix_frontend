// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'HR Admin',
    email: 'hr@example.com',
    password: 'password123',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    joinDate: '2020-01-15',
    phone: '+1234567890',
    address: '123 Office Street, Business City',
    profileImage: null
  },
  {
    id: '2',
    name: 'John Employee',
    email: 'employee@example.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2021-03-10',
    phone: '+0987654321',
    address: '456 Home Avenue, Residence Town',
    profileImage: null
  },
  {
    id: '3',
    name: 'Jane Multi-Role',
    email: 'multi@example.com',
    password: 'password123',
    role: 'employee', // Default role
    department: 'Operations',
    position: 'Operations Manager',
    joinDate: '2019-05-20',
    phone: '+1122334455',
    address: '789 Dual Street, Role City',
    profileImage: null,
    // This user has multiple roles
    availableRoles: ['hr', 'employee']
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a mock JWT token
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock authentication service
export const mockAuthService = {
  // Register user
  register: async (userData) => {
    // Simulate API delay
    await delay(800);
    
    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw { message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...userData,
      // Set default role if not provided
      role: userData.role || 'employee'
    };
    
    // Add to mock users
    mockUsers.push(newUser);
    
    // Generate token
    const token = generateToken(newUser.id);
    
    // Determine available roles
    const availableRoles = userData.availableRoles || [userData.role];
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('availableRoles', JSON.stringify(availableRoles));
    
    return {
      token,
      user: newUser,
      availableRoles
    };
  },
  
  // Login user
  login: async (email, password) => {
    // Simulate API delay
    await delay(800);
    
    // Find user by email
    const user = mockUsers.find(user => user.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      throw { message: 'Invalid email or password' };
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Determine available roles
    const availableRoles = user.availableRoles || [user.role];
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('availableRoles', JSON.stringify(availableRoles));
    
    return {
      token,
      user,
      availableRoles
    };
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

export default mockAuthService;
