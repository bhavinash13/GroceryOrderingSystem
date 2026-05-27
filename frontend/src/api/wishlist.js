import api from './axios';

export const getWishlist = () => api.get('/wishlist/get-wishlist');
export const addToWishlist = (productId) => api.post('/wishlist/add-to-wishlist', { productId });
export const deleteFromWishlist = (productId) => api.delete('/wishlist/delete-from-wishlist', { data: { productId } });
