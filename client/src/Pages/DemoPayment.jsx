
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Lock, Sparkles } from 'lucide-react';
export const DemoPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking_id');
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (bookingId) {
      api.getBookingById(bookingId).then((res) => { if (res.success) setBooking(res.data); });
    }
  }, [bookingId]);
  const handlePay = async () => {
    setProcessing(true);
    const res = await api.processDemoPayment({
      booking_id: Number(bookingId),
      payment_type: 'ADVANCE',
      payment_method: 'UPI - GPay (Simulated)'
    });
    if (res.success && res.data) {
      navigate(`/booking/confirmation?booking_id=${bookingId}&txn_ref=${res.data.transaction_reference}`);
    }
  };
  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '640px' }}>
      <div className="card">
        <div className="badge badge-success" style={{ marginBottom: '10px' }}><Lock size={13} /> Simulated Payment Gateway</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pay 20% Advance</h2>
        <div style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>ADVANCE AMOUNT</div>
          <strong style={{ fontSize: '2rem' }}>{formatCurrency(booking?.advance_amount)}</strong>
        </div>
        <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af', marginBottom: '20px' }}>
          <Sparkles size={15} /> <strong>Hackathon Simulator:</strong> Clicking below generates an official demo receipt code (<code>EH-DEMO-XXXXXX</code>) and confirms your booking in MySQL.
        </div>
        <button onClick={handlePay} disabled={processing} className="btn btn-primary btn-block btn-lg">
          {processing ? 'Processing Demo Transaction...' : `Pay ${formatCurrency(booking?.advance_amount)} & Confirm`}
        </button>
      </div>
    </div>
  );
};
