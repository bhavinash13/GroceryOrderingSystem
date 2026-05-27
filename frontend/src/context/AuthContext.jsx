import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '../api/auth';
import { getCart } from '../api/cart';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('groceryUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    if (!user) return setCartCount(0);
    try {
      const res = await getCart();
      setCartCount(res.data.cart?.products?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => { refreshCartCount(); }, [user]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const userData = res.data.data;
    setUser(userData);
    localStorage.setItem('groceryUser', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('groceryUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cartCount, refreshCartCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
