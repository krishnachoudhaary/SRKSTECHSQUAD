import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Scale, Users, Home } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCompare } from '../context/CompareContext';
export const VendorCard = ({ vendor }) => {
  const { toggleCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(vendor.id);
  const venue = vendor.venue_details;
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{
          height: '100px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          color: '#ffffff', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{vendor.category}</span>
            {vendor.is_verified && <span style={{ backgroundColor: '#fff', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700' }}>✓ Verified</span>}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>STARTING FROM</div>
            <strong style={{ fontSize: '1.35rem' }}>{formatCurrency(vendor.starting_price)}</strong> <span style={{ fontSize: '0.75rem' }}>/{vendor.price_unit}</span>
          </div>
        </div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{vendor.business_name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span><MapPin size={13} color="#f59e0b" /> {vendor.city}</span>
          <span style={{ fontWeight: '700', color: '#b45309' }}><Star size={13} fill="#f59e0b" color="#f59e0b" /> {vendor.rating} ({vendor.review_count})</span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {vendor.description}
        </p>
        {venue && (
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: '8px', display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            <span><Users size={13} /> {venue.max_capacity} Max</span>
            <span><Home size={13} /> {venue.rooms_available} Rooms</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <Link to={`/vendors/${vendor.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>View Details</Link>
        <button onClick={() => toggleCompare(vendor)} className={`btn btn-sm ${inCompare ? 'btn-accent' : 'btn-outline'}`} style={{ padding: '6px 10px' }}>
          <Scale size={15} /> {inCompare ? 'Comparing' : 'Compare'}
        </button>
      </div>
    </div>
  );
};
