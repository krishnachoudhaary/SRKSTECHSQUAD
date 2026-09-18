import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function MatchScore({ score = 95, reasons = [] }) {
  const getScoreColor = (s) => {
    if (s >= 90) return 'score-high';
    if (s >= 70) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className={`match-badge ${getScoreColor(score)}`}>
      <div className="badge-header">
        <Sparkles size={16} />
        <span>{score}% Smart Match</span>
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="match-reasons">
          {reasons.map((r, i) => (
            <li key={i}>
              <ShieldCheck size={12} /> {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}