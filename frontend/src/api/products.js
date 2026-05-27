import api from './axios';

export const getAllProducts = () => api.get('/products/get-all-products');
export const getProduct = (id) => api.get(`/products/get-product/${id}`);
export const getProductsByCategory = (category) => api.get(`/products/get-products-by-category/${category}`);
export const createProduct = (formData) => api.post('/products/create-product', formData);
export const updateProduct = (id, data) => api.post(`/products/update-product/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/delete-product/${id}`);
