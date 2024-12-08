const Booking = require('../models/booking');
const mongoose = require('mongoose');

// Get all bookings (for admin view)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student instructor skill')  // Populate all fields
      .select('student instructor skill skillDescription date status createdAt updatedAt');

    // If no bookings are found
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Controller for approving a single booking
const approveBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking approved", booking });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(400).json({ message: "Failed to approve booking", error: error.message });
  }
};

// Controller for rejecting a single booking
const rejectBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking rejected", booking });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(400).json({ message: "Failed to reject booking", error: error.message });
  }
};

// Controller for approving multiple bookings
const approveMultipleBookings = async (req, res) => {
  const { bookingIds } = req.body;  // Get the array of booking IDs

  if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
    return res.status(400).json({ message: "Invalid booking IDs" });
  }

  try {
    // Update the status of multiple bookings
    const bookings = await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { status: 'approved' },
      { new: true }
    );

    if (!bookings.nModified) {
      return res.status(404).json({ message: "No bookings found to approve" });
    }

    res.status(200).json({ message: `${bookings.nModified} bookings approved` });
  } catch (error) {
    console.error("Error approving multiple bookings:", error);
    res.status(500).json({ message: "Failed to approve multiple bookings", error: error.message });
  }
};

// Controller for rejecting multiple bookings
const rejectMultipleBookings = async (req, res) => {
  const { bookingIds } = req.body;  // Get the array of booking IDs

  if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
    return res.status(400).json({ message: "Invalid booking IDs" });
  }

  try {
    // Update the status of multiple bookings
    const bookings = await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { status: 'rejected' },
      { new: true }
    );

    if (!bookings.nModified) {
      return res.status(404).json({ message: "No bookings found to reject" });
    }

    res.status(200).json({ message: `${bookings.nModified} bookings rejected` });
  } catch (error) {
    console.error("Error rejecting multiple bookings:", error);
    res.status(500).json({ message: "Failed to reject multiple bookings", error: error.message });
  }
};

module.exports = {
  getBookings,
  approveBooking,
  rejectBooking,
  approveMultipleBookings,
  rejectMultipleBookings
};
