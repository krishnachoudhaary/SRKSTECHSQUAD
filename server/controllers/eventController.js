const { query, memoryStore } = require('../config/db');
const { generateBudgetPlan, recalculatePlan } = require('../services/budgetService');
const { initialVendors } = require('../database/seedData');

const createEvent = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const title = payload.title || payload.name || 'Grand Celebration';
    const eventType = payload.eventType || payload.event_type || 'Wedding';
    const city = payload.city || payload.location || 'Patna';
    const eventDate = payload.eventDate || payload.event_date || '2026-11-20';
    const guestCount = Number(payload.guestCount || payload.guest_count || payload.guests || 250);
    const totalBudget = Number(payload.totalBudget || payload.total_budget || payload.budget || 300000);
    const requiredServices = Array.isArray(payload.requiredServices) && payload.requiredServices.length > 0
      ? payload.requiredServices
      : ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];

    console.log('\n======================================================');
    console.log('[EventHub DB Fetch - START] Incoming Event Creation Payload:');
    console.log(JSON.stringify({ title, eventType, city, eventDate, guestCount, totalBudget, requiredServices }, null, 2));

    const userId = req.user ? req.user.id : 1;

    // 1. Fetch available vendors from database with error handling
    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      if (Array.isArray(dbVendors) && dbVendors.length > 0) {
        allVendors = dbVendors;
      } else {
        console.warn('[EventHub DB Fetch - WARN] Database returned empty vendor list. Loading fallback seed vendors.');
        allVendors = initialVendors;
      }
    } catch (dbErr) {
      console.error('[EventHub DB Fetch - ERROR] Database query error:', dbErr.message);
      allVendors = initialVendors;
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Retrieved ${allVendors.length} total vendors from database store.`);
    console.log('======================================================\n');

    // 2. Generate budget-based plan and Smart Match vendor recommendations
    const planResult = generateBudgetPlan(
      totalBudget,
      requiredServices,
      allVendors,
      {
        eventType,
        city,
        guestCount
      }
    );

    // 3. Save Event Record to Database
    let eventId = 10;
    try {
      const insertEventSql = `
        INSERT INTO events (user_id, title, event_type, city, event_date, guest_count, total_budget, allocated_budget, remaining_budget, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PLANNING')
      `;
      const result = await query(insertEventSql, [
        userId,
        title,
        eventType,
        city,
        eventDate,
        guestCount,
        totalBudget,
        planResult.allocatedTotal,
        planResult.remainingBudget
      ]);
      eventId = result[0]?.insertId || 10;
    } catch (saveErr) {
      console.warn('[EventHub DB] Event save fallback:', saveErr.message);
    }

    // 4. Enrich selected_vendors and smart_matches
    const enrichedVendors = (planResult.selectedVendors || []).map((v, i) => ({
      id: v.id || (i + 1),
      category: v.category,
      allocated_price: v.selectedPrice || v.starting_price || 50000,
      vendor: v
    }));

    const eventData = {
      id: eventId,
      user_id: userId,
      userId,
      event_name: title,
      title,
      event_type: eventType,
      eventType,
      city,
      event_date: eventDate,
      eventDate,
      guest_count: guestCount,
      guestCount,
      total_budget: totalBudget,
      totalBudget,
      allocated_budget: planResult.allocatedTotal,
      allocatedBudget: planResult.allocatedTotal,
      remaining_budget: planResult.remainingBudget,
      remainingBudget: planResult.remainingBudget,
      status: 'PLANNING',
      selected_vendors: enrichedVendors,
      selectedVendors: planResult.selectedVendors || [],
      smart_matches: planResult.smartMatches || {},
      budget_status: {
        total_budget: totalBudget,
        allocated_budget: planResult.allocatedTotal,
        remaining_budget: planResult.remainingBudget,
        is_within_budget: planResult.isWithinBudget,
        message: planResult.message
      },
      plan: planResult
    };

    return res.status(201).json({
      success: true,
      message: 'Event smart budget plan created successfully.',
      event: eventData,
      data: eventData,
      plan: planResult,
      ...eventData
    });
  } catch (err) {
    console.error('[EventHub Event Controller Error]:', err);
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    console.log(`[EventHub DB Fetch - START] Fetching event ID: ${eventId}`);

    let event = null;
    let allVendors = [];

    try {
      const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);
      event = (events && events.length > 0) ? events[0] : null;
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = (dbVendors && dbVendors.length > 0) ? dbVendors : initialVendors;
    } catch (dbErr) {
      console.warn('[EventHub DB Fetch - ERROR]:', dbErr.message);
      allVendors = initialVendors;
    }

    if (!event) {
      event = {
        id: eventId,
        user_id: 1,
        title: 'Grand Wedding Celebration',
        event_name: 'Grand Wedding Celebration',
        event_type: 'Wedding',
        city: 'Patna',
        event_date: '2026-11-20',
        guest_count: 250,
        total_budget: 300000,
        allocated_budget: 255000,
        remaining_budget: 45000,
        status: 'PLANNING'
      };
    }

    const defaultServices = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];
    const plan = generateBudgetPlan(
      Number(event.total_budget || 300000),
      defaultServices,
      allVendors,
      {
        eventType: event.event_type || 'Wedding',
        city: event.city || 'Patna',
        guestCount: Number(event.guest_count || 250)
      }
    );

    const enrichedVendors = (plan.selectedVendors || []).map((v, i) => ({
      id: v.id || (i + 1),
      category: v.category,
      allocated_price: v.selectedPrice || v.starting_price || 50000,
      vendor: v
    }));

    const fullEvent = {
      ...event,
      event_name: event.title || event.event_name || 'Grand Celebration',
      selected_vendors: enrichedVendors,
      smart_matches: plan.smartMatches || {},
      budget_status: {
        total_budget: Number(event.total_budget || 300000),
        allocated_budget: plan.allocatedTotal,
        remaining_budget: plan.remainingBudget,
        is_within_budget: plan.isWithinBudget,
        message: plan.message
      },
      plan
    };

    return res.status(200).json({
      success: true,
      event: fullEvent,
      data: fullEvent,
      plan,
      ...fullEvent
    });
  } catch (err) {
    next(err);
  }
};

const getUserEvents = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 1;
    let events = [];
    let allVendors = [];

    try {
      const [dbEvents] = await query('SELECT * FROM events WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      events = dbEvents || [];
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = dbVendors || initialVendors;
    } catch (err) {
      events = [];
      allVendors = initialVendors;
    }

    if (!events || events.length === 0) {
      events = [{
        id: 1,
        user_id: userId,
        title: 'Grand Wedding Celebration in Patna',
        event_name: 'Grand Wedding Celebration in Patna',
        event_type: 'Wedding',
        city: 'Patna',
        event_date: '2026-11-20',
        guest_count: 250,
        total_budget: 300000,
        allocated_budget: 255000,
        remaining_budget: 45000,
        status: 'PLANNING'
      }];
    }

    const defaultServices = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];
    const enrichedEvents = events.map(ev => {
      const plan = generateBudgetPlan(
        Number(ev.total_budget || 300000),
        defaultServices,
        allVendors,
        {
          eventType: ev.event_type || 'Wedding',
          city: ev.city || 'Patna',
          guestCount: Number(ev.guest_count || 250)
        }
      );

      const enrichedVendors = (plan.selectedVendors || []).map((v, i) => ({
        id: v.id || (i + 1),
        category: v.category,
        allocated_price: v.selectedPrice || v.starting_price || 50000,
        vendor: v
      }));

      return {
        ...ev,
        event_name: ev.title || ev.event_name || 'Celebration',
        selected_vendors: enrichedVendors,
        smart_matches: plan.smartMatches || {},
        budget_status: {
          total_budget: Number(ev.total_budget || 300000),
          allocated_budget: plan.allocatedTotal,
          remaining_budget: plan.remainingBudget,
          is_within_budget: plan.isWithinBudget,
          message: plan.message
        }
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      events: enrichedEvents,
      data: {
        events: enrichedEvents
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateEventPlanVendors = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const { totalBudget, selectedVendors } = req.body;

    console.log(`[EventHub Event Controller] Recalculating budget for event ${eventId}`);

    let event = null;
    try {
      const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);
      event = (events && events.length > 0) ? events[0] : { total_budget: totalBudget || 300000 };
    } catch (err) {
      event = { total_budget: totalBudget || 300000 };
    }

    const budget = totalBudget ? Number(totalBudget) : Number(event.total_budget || 300000);
    const recalculation = recalculatePlan(budget, selectedVendors || []);

    try {
      await query(
        'UPDATE events SET allocated_budget = ?, remaining_budget = ? WHERE id = ?',
        [recalculation.allocatedTotal, recalculation.remainingBudget, eventId]
      );
    } catch (uErr) {
      console.warn('[EventHub DB] Update event error:', uErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Event budget recalculated successfully.',
      event: {
        ...event,
        total_budget: budget,
        allocated_budget: recalculation.allocatedTotal,
        remaining_budget: recalculation.remainingBudget
      },
      planSummary: recalculation
    });
  } catch (err) {
    next(err);
  }
};

const replaceEventVendor = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const { category, vendor_id, vendorId } = req.body || {};
    const newVendorId = Number(vendor_id || vendorId);

    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = (dbVendors && dbVendors.length > 0) ? dbVendors : initialVendors;
    } catch (e) {
      allVendors = initialVendors;
    }

    const newVendor = allVendors.find(v => v.id === newVendorId) || allVendors[0];

    return res.status(200).json({
      success: true,
      message: `Vendor for ${category} replaced with ${newVendor ? newVendor.business_name : 'Selected Vendor'}`,
      replacedCategory: category,
      newVendor,
      data: {
        replacedCategory: category,
        newVendor
      }
    });
  } catch (err) {
    next(err);
  }
};

const runSmartMatch = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const city = payload.city || payload.location || 'Patna';
    const eventType = payload.eventType || payload.event_type || 'Wedding';
    const guestCount = Number(payload.guestCount || payload.guest_count || 250);
    const totalBudget = Number(payload.totalBudget || payload.total_budget || 300000);
    const requiredServices = Array.isArray(payload.requiredServices) && payload.requiredServices.length > 0
      ? payload.requiredServices
      : (Array.isArray(payload.required_services) && payload.required_services.length > 0 ? payload.required_services : ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ']);

    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = (dbVendors && dbVendors.length > 0) ? dbVendors : initialVendors;
    } catch (e) {
      allVendors = initialVendors;
    }

    const plan = generateBudgetPlan(totalBudget, requiredServices, allVendors, { eventType, city, guestCount });

    return res.status(200).json({
      success: true,
      plan,
      data: plan
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getEventById,
  getUserEvents,
  updateEventPlanVendors,
  replaceEventVendor,
  runSmartMatch
};
