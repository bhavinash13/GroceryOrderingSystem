import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const verifyOTP = (data) => api.post('/auth/verify-email', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
