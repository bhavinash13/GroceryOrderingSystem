import { useState, useEffect } from 'react';
import { getWishlist, deleteFromWishlist } from '../api/wishlist';
import { addToCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { Trash2, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { user, refreshCartCount } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data.wishlist);
    } catch {
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      await deleteFromWishlist(productId);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await deleteFromWishlist(productId);
      await refreshCartCount();
      toast.success('Moved to cart!');
      fetchWishlist();
    } catch {
      toast.error('Failed to move to cart');
    }
  };

  if (loading) return <div className="loader-center"><Loader2 className="spin" size={36} /></div>;

  return (
    <div className="cart-page">
      <h2 className="page-title"><Heart size={24} /> My Wishlist</h2>

      {!wishlist || wishlist.products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
              <circle cx="32" cy="32" r="30" stroke="#d1d5db" strokeWidth="2"/>
              <path d="M32 20 L32 36 M24 28 L32 20 L40 28" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 38 Q22 42 26 42 L38 42 Q42 42 42 38 L40 30 L24 30 Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="27" cy="46" r="2" fill="#9ca3af"/>
              <circle cx="37" cy="46" r="2" fill="#9ca3af"/>
            </svg>
          </div>
          <p>Your wishlist is empty</p>
          <button className="auth-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/')}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.products.map((item) => {
            const p = item.productId;
            const price = p?.discountPrice > 0 ? p.discountPrice : p?.price;
            return (
              <div key={item._id} className="wishlist-card">
                <img src={p?.image || 'https://placehold.co/120x120?text=Item'} alt={p?.name} />
                <div className="wishlist-info">
                  <h4>{p?.name}</h4>
                  <p>{p?.unit} · {p?.brand}</p>
                  <p className="price">₹{price}</p>
                </div>
                <div className="wishlist-actions">
                  <button className="move-cart-btn" onClick={() => handleMoveToCart(p?._id)}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button className="remove-btn" onClick={() => handleRemove(p?._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
