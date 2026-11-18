import axios from 'axios';

const API_BASE_URL = 'https://lab-backend-xyz.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);

    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  getPublications: (params) => api.get('/publications', { params }),
  getPublication: (id) => api.get(`/publications/${id}`),
  createPublication: (data) => api.post('/publications', data),
  updatePublication: (id, data) => api.put(`/publications/${id}`, data),
  deletePublication: (id) => api.delete(`/publications/${id}`),

  getTeamMembers: (params) => api.get('/team', { params }),
  getTeamMember: (id) => api.get(`/team/${id}`),
  createTeamMember: (data) => api.post('/team', data),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),

  getNews: (params) => api.get('/news', { params }),
  getNewsArticle: (id) => api.get(`/news/${id}`),
  createNewsArticle: (data) => api.post('/news', data),
  updateNewsArticle: (id, data) => api.put(`/news/${id}`, data),
  deleteNewsArticle: (id) => api.delete(`/news/${id}`),

  getSiteSettings: () => api.get('/site-settings'),
  updateSiteSettings: (data) => api.put('/site-settings', data),

  getCollections: () => api.get('/database/collections'),
  getCollectionData: (name) => api.get(`/database/collections/${name}`),
  deleteDocument: (collection, id) => api.delete(`/database/collections/${collection}/document/${id}`),
  updateDocument: (collection, id, data) => api.put(`/database/collections/${collection}/document/${id}`, data),
  getDatabaseStats: () => api.get('/database/stats'),
  getSystemInfo: () => api.get('/system/info'),
  getDatabaseInfo: () => api.get('/system/database-stats'),

  getVersions: (entityType, entityId) => api.get(`/versions/${entityType}/${entityId}`),
  saveVersion: (data) => api.post('/versions/save', data),
  setVersionLive: (id) => api.put(`/versions/${id}/live`),
  deleteVersion: (id) => api.delete(`/versions/${id}`),
  getLiveVersion: (entityType, entityId) => api.get(`/versions/live/${entityType}/${entityId}`),

  exportCollection: (name, format) => api.get(`/export/collection/${name}/${format}`, { responseType: 'blob' }),
  exportAllData: (format) => api.get(`/export/all/${format}`, { responseType: 'blob' }),

  uploadPhoto: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadMultiplePhotos: (formData) => api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  trackAnalytics: (data) => api.post('/analytics/track', data),
  getAnalyticsStats: (days) => api.get('/analytics/stats', { params: { days } }),

  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),

  getAuthors: () => api.get('/authors'),
  createAuthor: (data) => api.post('/authors', data),
  updateAuthor: (id, data) => api.put(`/authors/${id}`, data),
  deleteAuthor: (id) => api.delete(`/authors/${id}`),

  importPublications: (data) => api.post('/import/from-scholar', data),

  createBackup: (data) => api.post('/backup/create', data),
  getBackups: () => api.get('/backup'),
  getBackup: (id) => api.get(`/backup/${id}`),
  restoreBackup: (id) => api.post(`/backup/${id}/restore`),
  deleteBackup: (id) => api.delete(`/backup/${id}`),

  toggleProjectVisibility: (id) => api.patch(`/projects/${id}/toggle-visibility`),
togglePublicationVisibility: (id) => api.patch(`/publications/${id}/toggle-visibility`),
toggleTeamMemberVisibility: (id) => api.patch(`/team/${id}/toggle-visibility`),
toggleNewsVisibility: (id) => api.patch(`/news/${id}/toggle-visibility`),
toggleAuthorVisibility: (id) => api.patch(`/authors/${id}/toggle-visibility`),



};

export default api;