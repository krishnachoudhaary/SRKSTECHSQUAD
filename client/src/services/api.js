const API_BASE_URL = '/api';
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('eventhub_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.message || `Request failed (${response.status})`, data: null };
    }
    return data;
  } catch (error) {
    return { success: false, message: error.message || 'Network error connecting to EventHub server', data: null };
  }
};
export const api = {
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentialsOrEmail, maybePassword) => {
    const payload = typeof credentialsOrEmail === 'string'
      ? { email: credentialsOrEmail, password: maybePassword }
      : credentialsOrEmail;
    return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  getMe: () => request('/auth/me'),
  getVendors: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') query.append(k, v); });
    return request(`/vendors?${query.toString()}`);
  },
  getVendorById: (id) => request(`/vendors/${id}`),
  compareVendors: (vendorIds) => request('/vendors/compare', { method: 'POST', body: JSON.stringify({ vendor_ids: vendorIds }) }),
  updateVendorProfile: (data) => request('/vendors/profile', { method: 'POST', body: JSON.stringify(data) }),
  createEventPlan: (planData) => request('/events', { method: 'POST', body: JSON.stringify(planData) }),
  getUserEvents: () => request('/events/my-events'),
  getEventById: (id) => request(`/events/${id}`),
  replaceEventVendor: (eventId, category, vendorId) => request(`/events/${eventId}/replace-vendor`, {
    method: 'POST', body: JSON.stringify({ category, vendor_id: vendorId })
  }),
  calculateBudget: (budgetData) => request('/budget/calculate', { method: 'POST', body: JSON.stringify(budgetData) }),
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getBookings: () => request('/bookings'),
  getBookingById: (id) => request(`/bookings/${id}`),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ booking_status: status }) }),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  processDemoPayment: (paymentData) => request('/payments/demo', { method: 'POST', body: JSON.stringify(paymentData) }),
  getVendorReviews: (vendorId) => request(`/reviews/vendor/${vendorId}`),
  createReview: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
};
