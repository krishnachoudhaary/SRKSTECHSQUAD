import React from 'react';
import { formatINR } from '../utils/formatters';
import { TrendingUp, Users, Calendar } from 'lucide-react';

export default function VendorDashboard() {
  return (
    <div className="page-container">
      <h1>Vendor Analytics & Commission Dashboard</h1>
      <div className="stats-row">
        <div className="stat-card">
          <TrendingUp size={24} />
          <h4>Total Confirmed Bookings</h4>
          <h2>14</h2>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <h4>Gross Booking Volume</h4>
          <h2>{formatINR(980000)}</h2>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <h4>10% Platform Commission</h4>
          <h2>{formatINR(98000)}</h2>
        </div>
      </div>
    </div>
  );
}