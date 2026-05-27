import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOTP } from '../api/auth';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP({ email, otp });
      toast.success('Email verified! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-logo"><span>TG</span></div>
          <h2>Verify Email</h2>
          <p>Enter the OTP sent to <strong>{email}</strong></p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>OTP</label>
            <input type="text" placeholder="Enter 6-digit OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : 'Verify OTP'}
          </button>
        </form>
        <p className="auth-switch"><Link to="/register">← Back to Register</Link></p>
      </div>
    </div>
  );
}
