import { useState, useEffect } from 'react';
import { getCart, deleteFromCart, buyCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { user, refreshCartCount } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchCart();
  }, [user]);

  const handleDelete = async (productId) => {
    try {
      await deleteFromCart(productId);
      await fetchCart();
      await refreshCartCount();
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return toast.error('Please enter delivery address');
    setOrdering(true);
    try {
      await buyCart(address);
      toast.success('🎉 Order placed! Check your email for confirmation.');
      setShowCheckout(false);
      setAddress('');
      await fetchCart();
      await refreshCartCount();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  };

  const total = cart?.products?.reduce((sum, item) => {
    if (!item.productId || typeof item.productId !== 'object') return sum;
    const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  if (loading) return <div className="loader-center"><Loader2 className="spin" size={36} /></div>;

  return (
    <div className="cart-page">
      <h2 className="page-title"><ShoppingBag size={24} /> My Cart</h2>

      {!cart || cart.products.length === 0 ? (
      <div className="empty-state">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
              <circle cx="32" cy="32" r="30" stroke="#d1d5db" strokeWidth="2"/>
              <path d="M18 22h3l3.6 14.4A2 2 0 0 0 26.5 38h13a2 2 0 0 0 1.9-1.4L44 28H22" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="27" cy="43" r="2" fill="#9ca3af"/>
              <circle cx="38" cy="43" r="2" fill="#9ca3af"/>
            </svg>
          </div>
          <p>Your cart is empty</p>
          <button className="auth-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/')}>
            Shop Now
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.products.map((item) => {
              const p = item.productId;
              // p is null when product was deleted by admin — use raw ObjectId
              const pid = p?._id || item.productId;
              const price = p?.discountPrice > 0 ? p.discountPrice : p?.price;
              return (
                <div key={item._id} className="cart-item">
                  <img src={p?.image || 'https://placehold.co/80x80?text=Item'} alt={p?.name || 'Deleted'} />
                  <div className="cart-item-info">
                    <h4>{p?.name || <span style={{color:'#ef4444'}}>Product no longer available</span>}</h4>
                    {p && <p>{p.unit} · {p.brand}</p>}
                    {p && <p className="cart-item-price">₹{price} × {item.quantity} = <strong>₹{price * item.quantity}</strong></p>}
                  </div>
                  <button className="remove-btn" onClick={() => handleDelete(pid)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Items ({cart.products.length})</span><span>₹{total}</span></div>
            <div className="summary-row"><span>Delivery</span><span className="free">FREE</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>

            {!showCheckout ? (
              <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleOrder} className="checkout-form">
                <label><MapPin size={14} /> Delivery Address</label>
                <textarea
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  required
                />
                <button type="submit" className="checkout-btn" disabled={ordering}>
                  {ordering ? <Loader2 className="spin" size={18} /> : '🎉 Place Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
