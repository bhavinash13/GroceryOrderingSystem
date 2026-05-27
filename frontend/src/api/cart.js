import api from './axios';

export const getCart = () => api.get('/cart/get-cart');
export const addToCart = (productId) => api.post('/cart/add-to-cart', { productId });
export const deleteFromCart = (productId) => api.delete('/cart/delete-from-cart', { data: { productId } });
export const buyCart = (address) => api.post('/cart/buy-cart', { address });
