
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Wallet, Scale, ShieldCheck, MapPin, Users, ArrowRight } from 'lucide-react';
import heroImage from '../assets/hero_event.jpg';
export const Home = () => {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', borderBottom: '1px solid var(--border-color)', padding: '60px 0 80px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>
              <Sparkles size={14} /> Tier-2 & Tier-3 India's Smart Event Platform
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', lineHeight: '1.2', marginBottom: '16px' }}>
              Plan Smart. Spend Smart. <br />
              <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Celebrate Better.
              </span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              EventHub doesn't just help you <strong>FIND</strong> vendors — it helps you <strong>PLAN</strong> your entire event within your budget with rule-based smart matching, venue capacity specs, and verified bookings.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/planner" className="btn btn-primary btn-lg"><Sparkles size={18} /> Plan My Event</Link>
              <Link to="/vendors" className="btn btn-outline btn-lg">Explore Vendors</Link>
            </div>
          </div>
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '4px solid #fff' }}>
            <img src={heroImage} alt="Celebration Setup" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>
      {/* Differentiator Highlights */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Why EventHub isn't just a directory</h2>
            <p style={{ color: 'var(--text-muted)' }}>Automated event planning architect tailored for regional Tier-2/3 cities.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="card">
              <Wallet size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Dynamic Budget Control</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dynamically distributes budget across Venue, Catering, Decor, Photo, and DJ.</p>
            </div>
            <div className="card">
              <Users size={24} color="var(--accent)" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Venue Capacity & Rooms</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transparent main hall capacities, lawn space, and outstation guest room counts.</p>
            </div>
            <div className="card">
              <ShieldCheck size={24} color="var(--success)" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>20% Advance & Refunds</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay 20% advance with transparent cancellation fee deduction and instant refund tracking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};