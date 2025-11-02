export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('API_BASE_URL is not defined in environment variables');
}

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,

  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile/update`,

  // Task endpoints
  TASKS: `${API_BASE_URL}/tasks`,
  TASK_BY_ID: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  MY_TASKS: `${API_BASE_URL}/tasks/my-tasks`,
  AVAILABLE_TASKS: `${API_BASE_URL}/tasks/available`,

  // Helper endpoints
  HELPER_TASKS: `${API_BASE_URL}/helpers/tasks`,
  HELPER_PROFILE: `${API_BASE_URL}/helpers/profile`,
  HELPER_APPLICATIONS: `${API_BASE_URL}/helpers/applications`,

  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_TASKS: `${API_BASE_URL}/admin/tasks`,
  ADMIN_HELPERS: `${API_BASE_URL}/admin/helpers`,

  // File upload
  UPLOAD_FILE: `${API_BASE_URL}/upload`,
  UPLOAD_KYC: `${API_BASE_URL}/helpers/kyc-upload`,
};