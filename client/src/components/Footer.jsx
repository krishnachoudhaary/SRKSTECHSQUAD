
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Heart } from 'lucide-react';
export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', paddingTop: '50px', paddingBottom: '30px', marginTop: '60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>
              EVENT<span style={{ color: '#818cf8' }}>HUB</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              "Plan Smart. Spend Smart. Celebrate Better." Tier-2 & Tier-3 India's smart budget event planning ecosystem.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '12px' }}>Cities We Serve</h4>
            <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>Patna • Gaya • Muzaffarpur</span>
              <span>Bhagalpur • Begusarai • Nalanda</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '12px' }}>Transparency Model</h4>
            <p style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>
              Predictable 20% advance milestone booking with transparent cancellation fee deduction and 10% platform vendor commission.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '20px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>© {new Date().getFullYear()} EventHub. All rights reserved.</div>
          <div>Built for Hackathon Demo</div>
        </div>
      </div>
    </footer>
  );
};