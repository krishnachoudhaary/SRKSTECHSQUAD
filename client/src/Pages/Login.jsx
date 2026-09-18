import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(res.user.role === 'VENDOR' ? '/vendor-dashboard' : '/dashboard');
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2><LogIn size={24} /> Login to EventHub</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary btn-block">Sign In</button>
        </form>

        <div className="demo-shortcuts">
          <p>Quick Demo Logins:</p>
          <div className="btn-group">
            <button type="button" onClick={() => handleDemoFill('demo@eventhub.com', 'password123')} className="btn-outline">
              <UserCheck size={14} /> Customer Demo
            </button>
            <button type="button" onClick={() => handleDemoFill('vendor@eventhub.com', 'password123')} className="btn-outline">
              <UserCheck size={14} /> Vendor Demo
            </button>
          </div>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}