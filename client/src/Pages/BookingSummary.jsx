
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
export const BookingSummary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get('vendor_id');
  const amount = Number(searchParams.get('amount') || 70000);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [vendor, setVendor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (vendorId) {
      api.getVendorById(vendorId).then((res) => { if (res.success) setVendor(res.data); });
    }
  }, [vendorId]);
  const handleBook = async () => {
    setSubmitting(true);
    const res = await api.createBooking({
      vendor_id: Number(vendorId),
      event_date: date,
      service_category: vendor?.category || 'General',
      total_amount: amount
    });
    if (res.success && res.data) {
      navigate(`/payment/demo?booking_id=${res.data.id}`);
    }
    setSubmitting(false);
  };
  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '680px' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Review Booking & 20% Advance</h2>
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
          <h4>{vendor?.business_name}</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <span>Total Amount:</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: '700' }}>
            <span>20% Advance Payable Now:</span>
            <span>{formatCurrency(amount * 0.20)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Remaining Due Onsite:</span>
            <span>{formatCurrency(amount * 0.80)}</span>
          </div>
        </div>
        <button onClick={handleBook} disabled={submitting} className="btn btn-primary btn-block btn-lg">
          {submitting ? 'Creating Booking...' : `Proceed to Pay Advance (${formatCurrency(amount * 0.20)})`}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
