import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    city: 'Patna',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.register(formData);
    if (res.success) {
      alert('Registration successful! Please sign in.');
      navigate('/login');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2><UserPlus size={24} /> Create Account</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="CUSTOMER">Customer (Plan & Book)</option>
              <option value="VENDOR">Vendor (Provide Services)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary btn-block">Register</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}