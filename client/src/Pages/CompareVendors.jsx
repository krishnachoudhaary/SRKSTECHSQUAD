import React from 'react';
import { useCompare } from '../context/CompareContext';
import CompareTable from '../components/CompareTable';
import { Scale } from 'lucide-react';

export default function CompareVendors() {
  const { compareList, removeFromCompare } = useCompare();

  return (
    <div className="page-container">
      <h1><Scale size={28} /> Side-by-Side Vendor Comparison</h1>
      <p>Compare capacities, pricing, AC guest rooms, and specifications across up to 3 shortlisted vendors.</p>
      <CompareTable vendors={compareList} onRemove={removeFromCompare} />
    </div>
  );
}