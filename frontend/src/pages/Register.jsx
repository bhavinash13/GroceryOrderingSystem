import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-logo"><span>TG</span></div>
          <h2>Create Account</h2>
          <p>Join TraceX Groceries today</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Name' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
            { key: 'phone', label: 'Phone', type: 'tel', placeholder: 'Mobile No.' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Atleast 1 uppercase and numerical' },
          ].map(({ key, label, type, placeholder }) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : 'Register'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
