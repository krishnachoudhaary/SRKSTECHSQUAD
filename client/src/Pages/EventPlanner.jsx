
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from '../components/BudgetCard';
import { Sparkles, Calendar, MapPin, Users, Wallet, RefreshCw, Layers } from 'lucide-react';
const CITIES = ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Begusarai', 'Nalanda', 'Sheikhpura'];
const EVENT_TYPES = ['Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary'];
const SERVICES = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];
export const EventPlanner = () => {
  const [formData, setFormData] = useState({
    event_name: 'Grand Family Wedding',
    event_type: 'Wedding',
    city: 'Patna',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guest_count: 250,
    total_budget: 300000,
    required_services: ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ']
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.createEventPlan(formData);
    if (res.success && res.data) setPlan(res.data);
    setLoading(false);
  };
  const handleSwap = async (category, newVendorId) => {
    if (!plan?.id) return;
    const res = await api.replaceEventVendor(plan.id, category, newVendorId);
    if (res.success && res.data) {
      setPlan((prev) => ({ ...prev, ...res.data, smart_matches: prev.smart_matches }));
    }
  };
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 30px' }}>
        <span className="badge badge-primary"><Sparkles size={14} /> Smart Match Engine</span>
        <h1 style={{ fontSize: '2.2rem', marginTop: '6px' }}>Smart Event Planner</h1>
      </div>
      {!plan ? (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select className="form-control" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-control" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Guests: {formData.guest_count}</label>
              <input type="number" className="form-control" min="50" max="1000" step="10" value={formData.guest_count} onChange={(e) => setFormData({ ...formData, guest_count: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Total Budget: <strong>{formatCurrency(formData.total_budget)}</strong></label>
            <input type="range" min="100000" max="1000000" step="25000" value={formData.total_budget} onChange={(e) => setFormData({ ...formData, total_budget: Number(e.target.value) })} style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block btn-lg">
            {loading ? 'Generating Smart Plan...' : '✨ Generate Budget-Smart Plan'}
          </button>
        </form>
      ) : (
        <div>
          <BudgetCard
            totalBudget={plan.total_budget}
            allocatedBudget={plan.budget_status?.allocated_budget ?? plan.allocated_budget}
            remainingBudget={plan.budget_status?.remaining_budget ?? plan.remaining_budget}
            isWithinBudget={plan.budget_status?.is_within_budget ?? true}
            message={plan.budget_status?.message}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
            {plan.selected_vendors?.map((ev) => (
              <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{ev.category}</span>
                    <strong>{formatCurrency(ev.allocated_price)}</strong>
                  </div>
                  <h4>{ev.vendor?.business_name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ev.vendor?.city} • Rating {ev.vendor?.rating} ★</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <Link to={`/booking/summary?vendor_id=${ev.vendor?.id}&event_id=${plan.id}&amount=${ev.allocated_price}&date=${plan.event_date}`} className="btn btn-primary btn-sm btn-block">
                    Book (20% Adv)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
