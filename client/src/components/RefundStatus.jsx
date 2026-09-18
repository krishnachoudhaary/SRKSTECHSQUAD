import React from 'react';
import { formatINR } from '../utils/formatters';
import { AlertCircle } from 'lucide-react';

export default function RefundStatus({ advancePaid, cancellationFee = 2000, refundAmount, refundRef }) {
  return (
    <div className="refund-card">
      <h3><AlertCircle size={20} /> Cancellation & Refund Details</h3>
      <div className="summary-row">
        <span>Advance Paid</span>
        <span>{formatINR(advancePaid)}</span>
      </div>
      <div className="summary-row text-danger">
        <span>Platform Cancellation Fee (Flat)</span>
        <span>- {formatINR(cancellationFee)}</span>
      </div>
      <div className="summary-row total-refund">
        <span>Refundable Amount</span>
        <strong className="text-success">{formatINR(refundAmount)}</strong>
      </div>
      {refundRef && (
        <div className="refund-ref-badge">
          Refund Reference: <code>{refundRef}</code>
        </div>
      )}
    </div>
  );
}