import React from 'react';
import { formatINR } from '../utils/formatters';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export default function PaymentSummary({ totalAmount, advanceAmount, remainingAmount }) {
  return (
    <div className="payment-summary-card">
      <h3><CreditCard size={20} /> Payment Breakdown</h3>
      <div className="summary-row">
        <span>Total Booking Amount</span>
        <strong>{formatINR(totalAmount)}</strong>
      </div>
      <div className="summary-row highlight">
        <span>20% Online Advance Due Now</span>
        <strong className="text-primary">{formatINR(advanceAmount)}</strong>
      </div>
      <div className="summary-row">
        <span>80% Balance (Pay at Venue)</span>
        <span>{formatINR(remainingAmount)}</span>
      </div>
      <div className="notice-box">
        <CheckCircle2 size={16} />
        <span>Paying 20% advance instantly confirms your reservation with the vendor.</span>
      </div>
    </div>
  );
}