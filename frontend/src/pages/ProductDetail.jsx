import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';
import { addToWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Heart, ShoppingCart, Star, Zap, Package, Tag, Layers } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshCartCount } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await addToCart(product._id);
      await refreshCartCount();
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    setWishlisting(true);
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    } catch (err) { toast.error(err.response?.data?.message || 'Already in wishlist'); }
    finally { setWishlisting(false); }
  };

  if (loading) return <div className="loader-center"><Loader2 className="spin" size={36} /></div>;
  if (!product) return (
    <div className="empty-state">
      <p>Product not found</p>
      <button className="auth-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate('/')}>
        <ChevronLeft size={18} /> Back
      </button>

      <div className="pd-layout">
        {/* Left — image */}
        <div className="pd-img-section">
          <div className="pd-img-wrap">
            {discount > 0 && <span className="pd-discount-badge">{discount}% OFF</span>}
            <img
              src={imgError || !product.image ? 'https://placehold.co/400x400?text=No+Image' : product.image}
              alt={product.name}
              className="pd-img"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="pd-delivery-info">
            <div className="pd-delivery-chip"><Zap size={14} /> Delivery in 10 mins</div>
            <div className="pd-delivery-chip">
              {product.stock > 0
                ? <><span className="stock-dot in" />In Stock ({product.stock} left)</>
                : <><span className="stock-dot out" />Out of Stock</>}
            </div>
          </div>
        </div>

        {/* Right — details */}
        <div className="pd-info">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-brand-unit">{product.brand} · {product.unit}</p>

          <div className="pd-rating">
            {[1,2,3,4].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
            <Star size={16} fill="none" color="#f59e0b" />
            <span>4.2 · 128 reviews</span>
          </div>

          <div className="pd-price-block">
            <span className="pd-price">₹{finalPrice}</span>
            {discount > 0 && (
              <>
                <span className="pd-original">₹{product.price}</span>
                <span className="pd-save">Save ₹{product.price - product.discountPrice}</span>
              </>
            )}
          </div>

          <div className="pd-actions">
            <button className="pd-cart-btn" onClick={handleAddToCart}
              disabled={adding || !product.isAvailable || product.stock === 0}>
              <ShoppingCart size={18} />
              {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="pd-wish-btn" onClick={handleWishlist} disabled={wishlisting}>
              <Heart size={18} fill={wishlisting ? '#ef4444' : 'none'} color={wishlisting ? '#ef4444' : 'currentColor'} />
            </button>
          </div>

          <div className="pd-details-card">
            <h3>Product Details</h3>
            <div className="pd-detail-row"><Package size={15} /><span>Brand</span><strong>{product.brand}</strong></div>
            <div className="pd-detail-row"><Layers size={15} /><span>Category</span><strong>{product.category}</strong></div>
            <div className="pd-detail-row"><Tag size={15} /><span>Unit</span><strong>{product.unit}</strong></div>
            <div className="pd-detail-row">
              <span style={{width:15}}/>
              <span>Availability</span>
              <strong style={{color: product.isAvailable ? '#0c831f' : '#ef4444'}}>
                {product.isAvailable ? 'Available' : 'Unavailable'}
              </strong>
            </div>
          </div>

          <div className="pd-desc-card">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
