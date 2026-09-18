import React from 'react';
import { formatINR } from '../utils/formatters';
import { Users, Home, MapPin, IndianRupee, Trash2 } from 'lucide-react';

export default function CompareTable({ vendors = [], onRemove }) {
  if (!vendors.length) {
    return <div className="empty-state">No vendors selected for comparison.</div>;
  }

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Specification</th>
            {vendors.map((v) => (
              <th key={v.id}>
                <div className="th-vendor-header">
                  <span>{v.name}</span>
                  <button onClick={() => onRemove(v.id)} className="btn-remove-compare" title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Category</strong></td>
            {vendors.map(v => <td key={v.id}>{v.category}</td>)}
          </tr>
          <tr>
            <td><strong>Location (City)</strong></td>
            {vendors.map(v => <td key={v.id}><MapPin size={14} /> {v.city}</td>)}
          </tr>
          <tr>
            <td><strong>Starting Price</strong></td>
            {vendors.map(v => <td key={v.id}><strong className="price-tag">{formatINR(v.starting_price)}</strong></td>)}
          </tr>
          <tr>
            <td><strong>Max Guest Capacity</strong></td>
            {vendors.map(v => <td key={v.id}><Users size={14} /> {v.max_capacity || 'N/A'} Guests</td>)}
          </tr>
          <tr>
            <td><strong>Guest Rooms Available</strong></td>
            {vendors.map(v => <td key={v.id}><Home size={14} /> {v.rooms_count || 'N/A'} AC Rooms</td>)}
          </tr>
          <tr>
            <td><strong>Customer Rating</strong></td>
            {vendors.map(v => <td key={v.id}>★ {v.rating || '4.5'} ({v.review_count || 12} reviews)</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}