
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from '../components/BudgetCard';
import { CheckCircle2, RotateCcw } from 'lucide-react';
export const MyEvent = () => {
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    api.getUserEvents().then((res) => { if (res.success && res.data?.events?.length > 0) setEvent(res.data.events[0]); });
    api.getBookings().then((res) => { if (res.success) setBookings(res.data.bookings || []); });
  }, []);
  const handleCancel = async (bookingId) => {
    if (window.confirm('Cancel this booking and initiate simulated refund? (Advance Paid - ₹2,000 Platform Fee)')) {
      const res = await api.cancelBooking(bookingId, 'Customer cancellation');
      if (res.success) {
        alert(`Refund Initiated: ${res.data.refund_reference} (Refund Amount: ₹${res.data.refund?.refundable_amount})`);
        api.getBookings().then((r) => { if (r.success) setBookings(r.data.bookings || []); });
      }
    }
  };
  if (!event) return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>No event plan found.</div>;
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2>{event.event_name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{event.city} • {event.guest_count} Guests • {event.event_date}</p>
      </div>
      <BudgetCard totalBudget={event.total_budget} allocatedBudget={event.allocated_budget} remainingBudget={event.remaining_budget} isWithinBudget={true} />
      <h3 style={{ marginTop: '30px', marginBottom: '16px' }}>Booked Vendors</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <span className="badge badge-primary">{b.service_category}</span>
            <h4>{b.vendor?.business_name}</h4>
            <div style={{ margin: '8px 0', fontSize: '0.85rem' }}>
              Status: <strong>{b.booking_status}</strong> ({b.payment_status})
            </div>
            {b.booking_status === 'CONFIRMED' && (
              <button onClick={() => handleCancel(b.id)} className="btn btn-outline btn-sm btn-block" style={{ color: 'var(--danger)', marginTop: '10px' }}>
                <RotateCcw size={14} /> Cancel & Refund
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvent;

