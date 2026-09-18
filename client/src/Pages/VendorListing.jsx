import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import VendorCard from '../components/VendorCard';
import { Search, Filter } from 'lucide-react';

export default function VendorListing() {
  const [vendors, setVendors] = useState([]);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadVendors();
  }, [city, category]);

  const loadVendors = async () => {
    const res = await api.getVendors({ city, category });
    if (res.success && res.data) {
      setVendors(res.data);
    }
  };

  return (
    <div className="page-container">
      <div className="filter-bar">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All Cities</option>
          <option value="Patna">Patna</option>
          <option value="Gaya">Gaya</option>
          <option value="Muzaffarpur">Muzaffarpur</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Venue">Venue</option>
          <option value="Catering">Catering</option>
          <option value="Decoration">Decoration</option>
          <option value="Photography">Photography</option>
          <option value="DJ">DJ</option>
        </select>
      </div>

      <div className="vendor-grid">
        {vendors.map((v) => (
          <VendorCard key={v.id} vendor={v} />
        ))}
      </div>
    </div>
  );
}