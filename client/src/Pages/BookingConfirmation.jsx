

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
export const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const txnRef = searchParams.get('txn_ref') || 'EH-DEMO-948210';
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '600px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
        <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 14px' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Your 20% advance has been successfully recorded.</p>
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span>Demo Transaction Ref:</span>
            <code>{txnRef}</code>
          </div>
        </div>
        <Link to="/my-event" className="btn btn-primary btn-block btn-lg">
          View in My Event Dashboard <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
