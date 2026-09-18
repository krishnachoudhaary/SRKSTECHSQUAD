import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.getBookings().then((res) => {
      if (res.success && res.data) setBookings(res.data);
    });
  }, []);

  return (
    <div className="page-container">
      <h1>Customer Bookings Dashboard</h1>
      <div className="bookings-list">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-header">
              <h3>{b.vendor_name || 'Event Booking'}</h3>
              <span className={`status-badge ${b.booking_status}`}>{b.booking_status}</span>
            </div>
            <p>Booking Code: <code>{b.booking_code}</code> | Date: {formatDate(b.event_date)}</p>
            <div className="booking-footer">
              <span>Advance Paid: {formatINR(b.advance_amount)}</span>
              <span>Total: {formatINR(b.total_amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}