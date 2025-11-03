import { API_ENDPOINTS } from './config';

// Types
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    helperStatus?: 'pending' | 'approved' | 'rejected';
  };
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: string;
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to get JWT token
const getAuthToken = () => localStorage.getItem('jwt');

// Helper function to create headers with JWT
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return handleResponse(response);
  },

  signup: async (userData: UserData): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  signupWithFiles: async (formData: FormData): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: formData, // Don't set Content-Type header - browser will set it with boundary
    });
    
    return handleResponse(response);
  },

  verifyToken: async () => {
    const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
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
    const response = await fetch(API_ENDPOINTS.TASKS, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    return handleResponse(response);
  },

  getMyTasks: async () => {
    const response = await fetch(API_ENDPOINTS.MY_TASKS, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getTasks: async (filters?: { status?: string; createdBy?: string; acceptedBy?: string }) => {
    let url = API_ENDPOINTS.TASKS;
    if (filters) {
      const queryParams = new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      if (queryParams) url = `${url}?${queryParams}`;
    }
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  acceptTask: async (taskId: string) => {
    const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  startTask: async (taskId: string) => {
    const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  completeTask: async (taskId: string) => {
    const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  deleteTask: async (taskId: string) => {
    const response = await fetch(API_ENDPOINTS.TASK_BY_ID(taskId), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  getPendingHelpers: async () => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}?status=pending`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getApprovedHelpers: async () => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}?status=approved`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getRejectedHelpers: async () => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}?status=rejected`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  approveHelper: async (helperId: string) => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}/${helperId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  rejectHelper: async (helperId: string) => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}/${helperId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  revokeHelperApproval: async (helperId: string) => {
    // Revoke is same as reject - sets status back to pending or rejected
    const response = await fetch(`${API_ENDPOINTS.ADMIN_HELPERS}/${helperId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// File upload API
export const fileAPI = {
  uploadKYC: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(API_ENDPOINTS.UPLOAD_KYC, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  },
};

// Helper API
export const helperAPI = {
  applyAsHelper: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('kycDocs', file));

    const response = await fetch(API_ENDPOINTS.APPLY_HELPER, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  },

  updateKYC: async (userId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('kycDocs', file));

    const response = await fetch(API_ENDPOINTS.UPDATE_KYC(userId), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  },
};

// User profile API
export const userAPI = {
  updateProfile: async (userId: string, data: { 
    name?: string; 
    phone?: string; 
    address?: string;
    bio?: string;
    skills?: string[];
  }) => {
    const response = await fetch(`${API_ENDPOINTS.TASKS.replace('/tasks', '')}/users/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
};