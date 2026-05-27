import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, LogOut, Package, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar({ onSearch }) {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  const submitSearch = (q) => {
    const trimmed = q.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => { navigate('/'); close(); }}>
        <div className="brand-logo"><span className="brand-tg">TG</span></div>
        <div className="brand-text">
          <span className="brand-name">TraceX Groceries</span>
          <span className="brand-subtitle">An Online Grocery Store</span>
        </div>
      </div>

      <form className="search-bar" onSubmit={e => { e.preventDefault(); submitSearch(query); }}>
        <Search size={16} color="#888" />
        <input
          type="text"
          placeholder="Search groceries, fruits, vegetables..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      <div className="navbar-actions desktop-actions">
        {user ? (
          <>
            {(user.role === 'admin' || user.role === 'super_admin') && (
              <Link to="/admin" className="nav-btn"><Package size={18} /><span>Admin</span></Link>
            )}
            <Link to="/wishlist" className="nav-btn"><Heart size={18} /><span>Wishlist</span></Link>
            <Link to="/cart" className="nav-btn cart-btn">
              <ShoppingCart size={18} /><span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <div className="user-chip"><User size={15} /><span>{user.name?.split(' ')[0]}</span></div>
            <button className="nav-btn logout-btn" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn signup-btn">Sign Up</Link>
          </>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={e => { e.preventDefault(); submitSearch(query); }}>
            <Search size={15} color="#888" />
            <input type="text" placeholder="Search groceries..." value={query}
              onChange={e => setQuery(e.target.value)} />
          </form>
          {user ? (
            <>
              <div className="mobile-user"><User size={15} /> {user.name}</div>
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <Link to="/admin" className="mobile-link" onClick={close}><Package size={16} /> Admin Panel</Link>
              )}
              <Link to="/wishlist" className="mobile-link" onClick={close}><Heart size={16} /> Wishlist</Link>
              <Link to="/cart" className="mobile-link" onClick={close}>
                <ShoppingCart size={16} /> Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <button className="mobile-link logout-link" onClick={handleLogout}><LogOut size={16} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={close}>Login</Link>
              <Link to="/register" className="mobile-link signup-mobile" onClick={close}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
