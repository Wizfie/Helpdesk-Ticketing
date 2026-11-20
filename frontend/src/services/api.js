// Centralized API Service for PT Glotra Helpdesk Ticketing
// Communicates with Express.js Backend (http://localhost:5000/api)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Attach Auth headers & simulated user id from localStorage
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('gtt_current_user_id') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('gtt_jwt_token') : null;

  const headers = {
    ...(options.headers || {})
  };

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (currentUserId) {
    headers['x-simulated-user-id'] = currentUserId;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API Client] Gagal menghubungi backend di ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth & Users
  getUsers: () => request('/auth/users'),
  getCurrentUser: () => request('/auth/me'),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  createUser: (data) => request('/auth/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Tickets
  getTickets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tickets${query ? `?${query}` : ''}`);
  },
  getTicketById: (id) => request(`/tickets/${id}`),
  getPublicTicket: (ticketNumber, token) => request(`/tickets/track/${ticketNumber}?token=${token}`),
  createTicket: (data) => request('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  assignEngineer: (id, engineerId) => request(`/tickets/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ engineerId }) }),
  escalateTicket: (id, data) => request(`/tickets/${id}/escalate`, { method: 'PATCH', body: JSON.stringify(data) }),
  pauseSla: (id, data) => request(`/tickets/${id}/pause-sla`, { method: 'POST', body: JSON.stringify(data) }),
  resumeSla: (id) => request(`/tickets/${id}/resume-sla`, { method: 'POST' }),
  addMilestone: (id, data) => request(`/tickets/${id}/milestones`, { method: 'POST', body: JSON.stringify(data) }),
  resolveTicket: (id, data) => request(`/tickets/${id}/resolve`, { method: 'PATCH', body: JSON.stringify(data) }),
  closeTicket: (id, data) => request(`/tickets/${id}/close`, { method: 'PATCH', body: JSON.stringify(data) }),
  uploadAttachment: (id, formData) => request(`/tickets/${id}/attachments`, { method: 'POST', body: formData, isFormData: true }),

  // SLA Policies
  getSlaPolicies: () => request('/sla/policies'),
  createSlaPolicy: (data) => request('/sla/policies', { method: 'POST', body: JSON.stringify(data) }),
  updateSlaPolicy: (id, data) => request(`/sla/policies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSlaPolicy: (id) => request(`/sla/policies/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request('/customers'),
  getCustomerById: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  addCustomerPic: (id, data) => request(`/customers/${id}/pics`, { method: 'POST', body: JSON.stringify(data) }),
  updateCustomerPic: (id, picId, data) => request(`/customers/${id}/pics/${picId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomerPic: (id, picId) => request(`/customers/${id}/pics/${picId}`, { method: 'DELETE' }),

  // Knowledge Base
  getArticles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/kb${query ? `?${query}` : ''}`);
  },
  getArticleById: (id) => request(`/kb/${id}`),
  createArticle: (formData) => request('/kb', { method: 'POST', body: formData, isFormData: true }),
  publishArticle: (id) => request(`/kb/${id}/publish`, { method: 'PATCH' }),
  deleteArticle: (id) => request(`/kb/${id}`, { method: 'DELETE' }),
  getDownloadPdfUrl: (id) => `${API_BASE_URL}/kb/${id}/download`,
  getDownloadDocUrl: (id) => `${API_BASE_URL}/kb/${id}/download`,

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audit-logs${query ? `?${query}` : ''}`);
  },

  // Master Data (Database-driven, non-local)
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  getPrincipals: () => request('/principals'),
  createPrincipal: (data) => request('/principals', { method: 'POST', body: JSON.stringify(data) }),
  getQuickPresets: () => request('/presets'),
  getHoldReasons: () => request('/hold-reasons'),

  // System & Database Reset / Seed (Real Database UI Controls)
  resetDatabaseClean: () => request('/system/reset-clean', { method: 'POST' }),
  resetDatabaseSeed: () => request('/system/reset-seed', { method: 'POST' }),
  getSystemStatus: () => request('/system/status')
};

export default api;
