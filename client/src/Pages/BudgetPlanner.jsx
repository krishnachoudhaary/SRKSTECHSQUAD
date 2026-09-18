import React, { useState } from 'react';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { PieChart, Calculator, CheckCircle2 } from 'lucide-react';

export default function BudgetPlanner() {
  const [totalBudget, setTotalBudget] = useState(300000);
  const [services, setServices] = useState(['Venue', 'Catering', 'Decoration', 'Photography', 'DJ']);
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    const res = await api.calculateBudget({ totalBudget, requiredServices: services });
    if (res.success && res.data) {
      setResult(res.data);
    }
  };

  const toggleService = (svc) => {
    if (services.includes(svc)) {
      setServices(services.filter(s => s !== svc));
    } else {
      setServices([...services, svc]);
    }
  };

  return (
    <div className="page-container">
      <div className="header-section">
        <h1><Calculator size={32} /> Smart Budget Allocation Simulator</h1>
        <p>Dynamically calculate optimized spend limits for each category in Tier-2/3 events.</p>
      </div>

      <div className="calculator-box">
        <div className="form-group">
          <label>Total Event Budget: <strong>{formatINR(totalBudget)}</strong></label>
          <input
            type="range"
            min="50000"
            max="1500000"
            step="10000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
          />
        </div>

        <div className="services-selector">
          <label>Select Required Services:</label>
          <div className="chips">
            {['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'].map((svc) => (
              <button
                key={svc}
                type="button"
                className={`chip ${services.includes(svc) ? 'active' : ''}`}
                onClick={() => toggleService(svc)}
              >
                {svc}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary">
          <PieChart size={18} /> Compute Dynamic Allocation
        </button>
      </div>

      {result && (
        <div className="budget-results-grid">
          {Object.entries(result.allocations || {}).map(([cat, info]) => (
            <div key={cat} className="budget-card">
              <h4>{cat}</h4>
              <div className="price">{formatINR(info.allocated_amount)}</div>
              <div className="percent">{info.percentage}% of budget</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}