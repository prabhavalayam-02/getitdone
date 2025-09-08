// Mock API functions for GETITDONE
// In a real app, these would make HTTP requests to your backend

const API_BASE_URL = '/api'; // This would be your actual API URL

// Helper function to get JWT token
const getAuthToken = () => localStorage.getItem('jwt');

// Helper function to create headers with JWT
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

// Mock users data
const MOCK_USERS = [
  { id: '1', email: 'user@test.com', password: 'password', role: 'user', name: 'John Doe' },
  { id: '2', email: 'helper@test.com', password: 'password', role: 'helper', name: 'Jane Smith', helperStatus: 'approved' },
  { id: '3', email: 'admin@test.com', password: 'password', role: 'admin', name: 'Admin User' },
];

// Mock tasks data
let MOCK_TASKS = [
  {
    id: '1',
    title: 'Fix Leaky Faucet',
    description: 'Kitchen faucet is leaking and needs immediate repair',
    location: 'Downtown Apartment',
    budget: 150,
    category: 'Plumbing',
    date: new Date().toISOString(),
    status: 'open',
    createdBy: 'John Doe',
  },
  {
    id: '2',
    title: 'Paint Living Room',
    description: 'Need help painting the living room walls',
    location: 'Suburb House',
    budget: 300,
    category: 'Home Improvement',
    date: new Date(Date.now() + 86400000).toISOString(),
    status: 'accepted',
    createdBy: 'John Doe',
    acceptedBy: 'Jane Smith',
  },
];

// Authentication API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password && u.role === role);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        helperStatus: user.helperStatus || null,
      },
    };
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    role: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      ...userData,
      helperStatus: userData.role === 'helper' ? 'pending' : undefined,
    };
    
    MOCK_USERS.push(newUser);
    
    const token = btoa(JSON.stringify({ userId: newUser.id, role: newUser.role }));
    
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        helperStatus: newUser.helperStatus || null,
      },
    };
  },
};

// Tasks API
export const tasksAPI = {
  createTask: async (taskData: {
    title: string;
    description: string;
    location: string;
    budget: number;
    category: string;
    date: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTask = {
      id: String(MOCK_TASKS.length + 1),
      ...taskData,
      status: 'open' as const,
      createdBy: 'Current User', // In real app, get from JWT
    };
    
    MOCK_TASKS.push(newTask);
    return newTask;
  },

  getTasks: async (filters?: { status?: string; createdBy?: string; acceptedBy?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredTasks = [...MOCK_TASKS];
    
    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters?.createdBy) {
      filteredTasks = filteredTasks.filter(task => task.createdBy === filters.createdBy);
    }
    
    if (filters?.acceptedBy) {
      filteredTasks = filteredTasks.filter(task => task.acceptedBy === filters.acceptedBy);
    }
    
    return filteredTasks;
  },

  updateTaskStatus: async (taskId: string, status: string, acceptedBy?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const taskIndex = MOCK_TASKS.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    MOCK_TASKS[taskIndex] = {
      ...MOCK_TASKS[taskIndex],
      status: status as any,
      ...(acceptedBy && { acceptedBy }),
    };
    
    return MOCK_TASKS[taskIndex];
  },

  deleteTask: async (taskId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const taskIndex = MOCK_TASKS.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    MOCK_TASKS.splice(taskIndex, 1);
    return { success: true };
  },
};

// Admin API
export const adminAPI = {
  getPendingHelpers: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_USERS.filter(user => user.role === 'helper' && user.helperStatus === 'pending');
  },

  getApprovedHelpers: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_USERS.filter(user => user.role === 'helper' && user.helperStatus === 'approved');
  },

  approveHelper: async (helperId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const helperIndex = MOCK_USERS.findIndex(user => user.id === helperId);
    if (helperIndex === -1) {
      throw new Error('Helper not found');
    }
    
    MOCK_USERS[helperIndex].helperStatus = 'approved';
    return MOCK_USERS[helperIndex];
  },

  rejectHelper: async (helperId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const helperIndex = MOCK_USERS.findIndex(user => user.id === helperId);
    if (helperIndex === -1) {
      throw new Error('Helper not found');
    }
    
    MOCK_USERS[helperIndex].helperStatus = 'rejected';
    return MOCK_USERS[helperIndex];
  },

  revokeHelperApproval: async (helperId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const helperIndex = MOCK_USERS.findIndex(user => user.id === helperId);
    if (helperIndex === -1) {
      throw new Error('Helper not found');
    }
    
    MOCK_USERS[helperIndex].helperStatus = 'pending';
    return MOCK_USERS[helperIndex];
  },
};

// File upload API (mock)
export const fileAPI = {
  uploadKYC: async (files: File[]) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would upload to Cloudinary or similar
    return {
      success: true,
      urls: files.map(file => `https://example.com/uploads/${file.name}`),
    };
  },
};