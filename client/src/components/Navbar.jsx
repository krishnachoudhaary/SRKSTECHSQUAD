import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Calendar, Sparkles, Scale, User, LogOut, Menu, X } from 'lucide-react';
export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;
  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              EVENT<span style={{ color: 'var(--primary)' }}>HUB</span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>Tier 2/3</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Plan Smart. Spend Smart. Celebrate Better.
            </div>
          </div>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/planner" style={{ fontWeight: '600', fontSize: '0.92rem', color: isActive('/planner') ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={16} color="var(--accent)" /> Plan My Event
          </Link>
          <Link to="/vendors" style={{ fontWeight: '600', fontSize: '0.92rem', color: isActive('/vendors') ? 'var(--primary)' : 'var(--text-main)' }}>
            Explore Vendors
          </Link>
          <Link to="/compare" style={{ fontWeight: '600', fontSize: '0.92rem', color: isActive('/compare') ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={16} /> Compare {compareList.length > 0 && <span className="badge badge-primary">{compareList.length}</span>}
          </Link>
          {isAuthenticated && (
            <Link to="/my-event" style={{ fontWeight: '600', fontSize: '0.92rem', color: isActive('/my-event') ? 'var(--primary)' : 'var(--text-main)' }}>
              My Event
            </Link>
          )}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'} className="btn btn-secondary btn-sm">
                <User size={14} /> {user?.name?.split(' ')[0]} ({user?.role === 'VENDOR' ? 'Vendor' : 'Host'})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout"><LogOut size={15} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;