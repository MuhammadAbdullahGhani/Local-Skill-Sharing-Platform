const express = require('express');
const { getBookings, approveBooking, rejectBooking, approveMultipleBookings, rejectMultipleBookings } = require('../controller/BookingController');
const router = express.Router();

// Route to get all bookings (view bookings for admin)
router.get('/', getBookings);

// Route to approve a booking
router.put('/:id/approve', approveBooking);

// Route to reject a booking
router.put('/:id/reject', rejectBooking);

// New route to approve multiple bookings
router.put('/approve', approveMultipleBookings);

// New route to reject multiple bookings
router.put('/reject', rejectMultipleBookings);

module.exports = router;
