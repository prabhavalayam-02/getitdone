/**
 * Get the API base URL from environment variable
 * Falls back to localhost for development
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

/**
 * Build a complete API endpoint URL
 * @param path - API path (e.g., '/api/tasks')
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
