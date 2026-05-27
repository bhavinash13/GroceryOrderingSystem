import { useState } from 'react';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { addToCart } from '../api/cart';
import { addToWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onCartUpdate }) {
  const { user, refreshCartCount } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);

  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await addToCart(product._id);
      await refreshCartCount();
      toast.success('Added to cart!');
      onCartUpdate?.();
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    setWishlisting(true);
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already in wishlist');
    } finally {
      setWishlisting(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap" onClick={() => navigate(`/product/${product._id}`)} style={{cursor:'pointer'}}>
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        <button className="wishlist-btn" onClick={e => { e.stopPropagation(); handleWishlist(); }} disabled={wishlisting}>
          <Heart size={16} fill={wishlisting ? '#ef4444' : 'none'} color={wishlisting ? '#ef4444' : '#666'} />
        </button>
        <img
          src={product.image || 'https://placehold.co/200x200?text=No+Image'}
          alt={product.name}
          className="product-img"
        />
        <div className="delivery-tag"><Zap size={12} /> 10 mins</div>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name" onClick={() => navigate(`/product/${product._id}`)} style={{cursor:'pointer'}}>{product.name}</h3>
        <p className="product-unit">{product.unit} · {product.brand}</p>
        <div className="product-rating">
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          <span>4.2</span>
        </div>
        <div className="product-price-row">
          <div className="price-block">
            <span className="price">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
            {discount > 0 && <span className="original-price">₹{product.price}</span>}
          </div>
          <button
            className="add-btn"
            onClick={e => { e.stopPropagation(); handleAddToCart(); }}
            disabled={adding || !product.isAvailable || product.stock === 0}
          >
            {adding ? '...' : product.stock === 0 ? 'Out' : '+ Add'}
          </button>
        </div>
        {product.stock === 0 && <p className="out-of-stock">Out of stock</p>}
      </div>
    </div>
  );
}
