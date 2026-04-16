import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('role');
        const endpoint = role === 'admin' ? '/admin/auth/refresh' : '/volunteer/auth/refresh';
        const { data } = await axios.post(`/api${endpoint}`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Admin Auth ────────────────────────────────────────────────
export const adminLogin = (creds) => api.post('/admin/auth/login', creds);
export const adminRegister = (data) => api.post('/admin/auth/register', data);
export const adminRefresh = (rt) => api.post('/admin/auth/refresh', { refreshToken: rt });
export const adminLogout = (rt) => api.post('/admin/auth/logout', { refreshToken: rt });
export const getAdminMe = () => api.get('/admin/auth/me');

// ─── Volunteer Auth ────────────────────────────────────────────
export const volunteerLogin = (creds) => api.post('/volunteer/auth/login', creds);
export const volunteerRegister = (data) => api.post('/volunteer/auth/register', data);
export const volunteerLogout = (rt) => api.post('/volunteer/auth/logout', { refreshToken: rt });
export const getVolunteerMe = () => api.get('/volunteer/auth/me');

// ─── Admin Operations ─────────────────────────────────────────
export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getVolunteers = (params) => api.get('/admin/volunteers', { params });
export const getVolunteer = (id) => api.get(`/admin/volunteers/${id}`);
export const getPendingVolunteers = () => api.get('/admin/volunteers/pending');
export const approveVolunteer = (id) => api.patch(`/admin/volunteers/${id}/approve`);
export const rejectVolunteer = (id) => api.patch(`/admin/volunteers/${id}/reject`);
export const getRankings = (params) => api.get('/admin/volunteers/rankings', { params });

// ─── Incidents ────────────────────────────────────────────────
export const getIncidents = (params) => api.get('/incidents', { params });
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncident = (id, data) => api.patch(`/incidents/${id}`, data);
export const assignVolunteers = (id, volunteerIds) => api.post(`/incidents/${id}/assign`, { volunteerIds });
export const deleteIncident = (id) => api.delete(`/incidents/${id}`);

export default api;
