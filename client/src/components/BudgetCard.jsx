
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
export const BudgetCard = ({ totalBudget, allocatedBudget, remainingBudget, isWithinBudget, message }) => {
  const isOver = remainingBudget < 0;
  const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((allocatedBudget / totalBudget) * 100)) : 0;
  return (
    <div className="card" style={{ borderLeft: `6px solid ${isOver ? 'var(--danger)' : 'var(--success)'}`, marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: isOver ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            <Wallet size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Dynamic Budget Optimizer</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time live recalculation</div>
          </div>
        </div>
        <div className={`badge ${isOver ? 'badge-danger' : 'badge-success'}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          {isOver ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
          {isOver ? `Over Budget by ${formatCurrency(Math.abs(remainingBudget))}` : 'Within Budget'}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL BUDGET</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>{formatCurrency(totalBudget)}</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>ALLOCATED PLAN</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>{formatCurrency(allocatedBudget)}</div>
        </div>
        <div style={{ backgroundColor: isOver ? 'var(--danger-light)' : 'var(--success-light)', padding: '12px 14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: isOver ? 'var(--danger)' : '#065f46', fontWeight: '600' }}>{isOver ? 'DEFICIT' : 'REMAINING BUDGET'}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: isOver ? 'var(--danger)' : 'var(--success)', marginTop: '2px' }}>{formatCurrency(remainingBudget)}</div>
        </div>
      </div>
      <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percentageUsed}%`, backgroundColor: isOver ? 'var(--danger)' : 'var(--primary)', transition: 'width 0.3s' }} />
      </div>
      {message && <div style={{ marginTop: '10px', fontSize: '0.85rem', color: isOver ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '500' }}>{message}</div>}
    </div>
  );
};
