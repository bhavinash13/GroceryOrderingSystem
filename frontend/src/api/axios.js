import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  try {
    const user = localStorage.getItem('groceryUser');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('groceryUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
