// API Configuration
// This file centralizes all API endpoints and base URLs

// Get API base URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  signup: `${API_BASE_URL}/api/auth/signup`,
  
  // Users
  users: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,
  updateUser: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,
  switchRole: (userId: string) => `${API_BASE_URL}/api/users/${userId}/switch-role`,
  uploadKyc: (userId: string) => `${API_BASE_URL}/api/users/${userId}/upload-kyc`,
  
  // Tasks
  tasks: `${API_BASE_URL}/api/tasks`,
  task: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}`,
  acceptTask: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/accept`,
  approveHelper: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/approve-helper`,
  rejectHelper: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/reject-helper`,
  completeTask: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/complete`,
  rateTask: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/rate`,
  
  // Admin
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  allUsers: `${API_BASE_URL}/api/admin/users`,
  updateUserStatus: (userId: string) => `${API_BASE_URL}/api/admin/users/${userId}/helper-status`,
  deleteUser: (userId: string) => `${API_BASE_URL}/api/admin/users/${userId}`,
  
  // Payments
  createOrder: `${API_BASE_URL}/api/payments/create-order`,
  verifyPayment: `${API_BASE_URL}/api/payments/verify-payment`,
};

export default API_ENDPOINTS;
