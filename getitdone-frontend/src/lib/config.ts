// Get API base URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log(' API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify`,

  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/api/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile/update`,

  // Task endpoints
  TASKS: `${API_BASE_URL}/api/tasks`,
  TASK_BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
  MY_TASKS: `${API_BASE_URL}/api/tasks/my-tasks`,
  AVAILABLE_TASKS: `${API_BASE_URL}/api/tasks/available`,

  // Helper endpoints
  HELPER_TASKS: `${API_BASE_URL}/api/helpers/tasks`,
  HELPER_PROFILE: `${API_BASE_URL}/api/helpers/profile`,
  HELPER_APPLICATIONS: `${API_BASE_URL}/api/helpers/applications`,

  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_TASKS: `${API_BASE_URL}/api/admin/tasks`,
  ADMIN_HELPERS: `${API_BASE_URL}/api/admin/helpers`,

  // File upload
  UPLOAD_FILE: `${API_BASE_URL}/api/upload`,
  UPLOAD_KYC: `${API_BASE_URL}/api/helpers/kyc-upload`,
};