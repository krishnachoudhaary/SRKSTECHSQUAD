const { query } = require('../config/db');
const { calculateSmartMatchScore } = require('../services/smartMatchService');
const { initialVendors } = require('../database/seedData');

const getAllVendors = async (req, res, next) => {
  try {
    const {
      category,
      city,
      location,
      keyword,
      minPrice,
      maxPrice,
      budget,
      rating,
      capacity,
      sortBy = 'rating',
      eventType,
      guestCount,
      targetBudget
    } = req.query;

    const targetCity = city || location;
    const targetMax = maxPrice || budget;

    console.log('\n[EventHub DB Fetch - START] Querying Vendors with Filters:');
    console.log(JSON.stringify({ category, city: targetCity, keyword, maxPrice: targetMax, rating, capacity, sortBy }, null, 2));

    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      if (Array.isArray(dbVendors) && dbVendors.length > 0) {
        allVendors = dbVendors;
      } else {
        allVendors = initialVendors;
      }
    } catch (err) {
      console.warn('[EventHub DB Fetch - WARN] Fallback to initialVendors:', err.message);
      allVendors = initialVendors;
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Total records in DB: ${allVendors.length}`);

    let filtered = [...allVendors];

    // 1. Filter by Category
    if (category && category !== 'All') {
      filtered = filtered.filter(v => v.category && v.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Filter by City / Location
    if (targetCity && targetCity !== 'All') {
      filtered = filtered.filter(v => v.city && v.city.toLowerCase() === targetCity.toLowerCase());
    }

    // 3. Keyword Search
    if (keyword && keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      filtered = filtered.filter(v =>
        (v.business_name && v.business_name.toLowerCase().includes(kw)) ||
        (v.description && v.description.toLowerCase().includes(kw)) ||
        (v.address && v.address.toLowerCase().includes(kw)) ||
        (v.facilities && v.facilities.toLowerCase().includes(kw))
      );
    }

    // 4. Price range filter
    if (minPrice) {
      filtered = filtered.filter(v => Number(v.starting_price || 0) >= Number(minPrice));
    }
    if (targetMax) {
      filtered = filtered.filter(v => Number(v.starting_price || 0) <= Number(targetMax));
    }

    // 5. Rating filter
    if (rating) {
      filtered = filtered.filter(v => Number(v.rating || 0) >= Number(rating));
    }

    // 6. Venue Capacity filter
    if (capacity) {
      filtered = filtered.filter(v => !v.max_capacity || Number(v.max_capacity) >= Number(capacity));
    }

    // Attach Smart Match scores if event context is supplied
    const eventContext = {
      eventType: eventType || 'Wedding',
      city: targetCity || 'Patna',
      guestCount: Number(guestCount) || 200,
      targetBudget: Number(targetBudget || targetMax) || 70000
    };

    filtered = filtered.map(v => {
      const match = calculateSmartMatchScore(v, eventContext);
      return {
        ...v,
        matchScore: match.score,
        matchReasons: match.reasons
      };
    });

    // Sorting
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => Number(a.starting_price || 0) - Number(b.starting_price || 0));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => Number(b.starting_price || 0) - Number(a.starting_price || 0));
    } else if (sortBy === 'match_score') {
      filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else {
      // Default: Highest Rating
      filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    console.log(`[EventHub DB Fetch - RESULT] Matched ${filtered.length} vendors after filtering.\n`);

    return res.status(200).json({
      success: true,
      count: filtered.length,
      vendors: filtered
    });
  } catch (err) {
    console.error('[EventHub Vendor Controller Error]:', err);
    next(err);
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.id);
    console.log(`[EventHub DB Fetch - START] Fetching vendor details ID: ${vendorId}`);

    let vendor = null;
    let reviews = [];

    try {
      const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [vendorId]);
      vendor = (vendors && vendors.length > 0) ? vendors[0] : null;
      const [dbReviews] = await query('SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
      reviews = dbReviews || [];
    } catch (err) {
      console.warn('[EventHub DB] Query fallback for vendor:', err.message);
    }

    if (!vendor) {
      vendor = initialVendors.find(v => v.id === vendorId) || initialVendors[0];
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Loaded vendor "${vendor.business_name}" (${vendor.category})`);

    const { eventType, city, location, guestCount, targetBudget, budget } = req.query;
    const matchInfo = calculateSmartMatchScore(vendor, {
      eventType: eventType || 'Wedding',
      city: city || location || vendor.city || 'Patna',
      guestCount: Number(guestCount) || 200,
      targetBudget: Number(targetBudget || budget) || Number(vendor.starting_price || 70000)
    });

    return res.status(200).json({
      success: true,
      vendor: {
        ...vendor,
        reviews: reviews || [],
        matchScore: matchInfo.score,
        matchReasons: matchInfo.reasons
      }
    });
  } catch (err) {
    next(err);
  }
};

const getVendorForCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let vendor = null;
    let reviews = [];

    try {
      const [vendors] = await query('SELECT * FROM vendors WHERE user_id = ?', [userId]);
      vendor = (vendors && vendors.length > 0) ? vendors[0] : null;
      if (vendor) {
        const [dbReviews] = await query('SELECT * FROM reviews WHERE vendor_id = ?', [vendor.id]);
        reviews = dbReviews || [];
      }
    } catch (err) {
      console.warn('[EventHub DB] Vendor profile fetch error:', err.message);
    }

    if (!vendor) {
      vendor = initialVendors[4]; // Default to Sharma Caterers
    }

    return res.status(200).json({
      success: true,
      vendor: {
        ...vendor,
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateVendorProfile = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.id);
    const {
      business_name,
      starting_price,
      price_unit,
      description,
      facilities,
      max_capacity,
      halls_info,
      rooms_count,
      address,
      city
    } = req.body;

    let vendor = null;
    try {
      const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [vendorId]);
      vendor = (vendors && vendors.length > 0) ? vendors[0] : null;
    } catch (err) {
      vendor = initialVendors.find(v => v.id === vendorId);
    }

    if (!vendor) {
      vendor = initialVendors[0];
    }

    vendor.business_name = business_name || vendor.business_name;
    vendor.starting_price = starting_price ? Number(starting_price) : vendor.starting_price;
    vendor.price_unit = price_unit || vendor.price_unit;
    vendor.description = description || vendor.description;
    vendor.facilities = facilities || vendor.facilities;
    vendor.max_capacity = max_capacity ? Number(max_capacity) : vendor.max_capacity;
    vendor.halls_info = halls_info || vendor.halls_info;
    vendor.rooms_count = rooms_count !== undefined ? Number(rooms_count) : vendor.rooms_count;
    vendor.address = address || vendor.address;
    vendor.city = city || vendor.city;

    return res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully.',
      vendor,
      data: vendor
    });
  } catch (err) {
    next(err);
  }
};

const compareVendors = async (req, res, next) => {
  try {
    const { vendor_ids, vendorIds } = req.body || {};
    const ids = (vendor_ids || vendorIds || []).map(Number);

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a list of vendor IDs to compare.'
      });
    }

    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = (dbVendors && dbVendors.length > 0) ? dbVendors : initialVendors;
    } catch (e) {
      allVendors = initialVendors;
    }

    const matched = allVendors.filter(v => ids.includes(v.id));

    const comparisonList = matched.map(v => ({
      id: v.id,
      business_name: v.business_name,
      category: v.category,
      city: v.city,
      starting_price: Number(v.starting_price || 0),
      price_unit: v.price_unit || 'per event',
      rating: Number(v.rating || 0),
      review_count: Number(v.review_count || 0),
      is_verified: !!v.is_verified,
      max_capacity: v.max_capacity || 300,
      main_hall_capacity: v.main_hall_capacity || 200,
      rooms_available: v.rooms_available || 8,
      lawn_available: v.lawn_available !== false,
      catering_policy: v.catering_policy || 'In-house & Outside Allowed',
      ac_available: v.ac_available !== false,
      facilities: v.facilities || 'AC, Power Backup, Valet Parking, Decor Support',
      services_count: 5,
      supported_event_types: v.supported_event_types || 'Wedding, Reception, Birthday, Corporate'
    }));

    return res.status(200).json({
      success: true,
      comparison: comparisonList,
      data: {
        comparison: comparisonList
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  getVendorForCurrentUser,
  updateVendorProfile,
  compareVendors
};
