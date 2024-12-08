import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Navbar component
const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="flex justify-between items-center container mx-auto">
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border rounded-full border-black p-2" 
          />
          <div className="space-x-4 text-gray-700">
            <Link to="/user-management" className="hover:text-indigo-200">User Management</Link>
            <Link to="/skill-management" className="hover:text-indigo-200">Skill Management</Link>
            <Link to="/login" className="hover:text-indigo-200">Logout</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span>EN</span>
            <span className="material-icons">language</span>
          </div>
          <Link to="/login" className="bg-transparent border-2 border-black text-black rounded-full py-2 px-6 hover:bg-black hover:text-white transition">Log In</Link>
          <Link to="/signup" className="bg-purple-600 text-white rounded-full p-2 py-2 px-6 border-black hover:bg-purple-700">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings using the fetch API
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking selection
  const handleSelectBooking = (id) => {
    setSelectedBookings((prevSelectedBookings) => {
      if (prevSelectedBookings.includes(id)) {
        return prevSelectedBookings.filter((bookingId) => bookingId !== id);
      } else {
        return [...prevSelectedBookings, id];
      }
    });
  };

  // Handle select all bookings
  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]); // Deselect all if everything is selected
    } else {
      setSelectedBookings(bookings.map((booking) => booking._id)); // Select all bookings
    }
  };
  const handleApproval = async () => {
    try {
      // Loop through selected bookings and send a PUT request for each one
      const approvalPromises = selectedBookings.map(async (bookingId) => {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error('Error approving the booking with ID:', bookingId);
        }
      });
  
      // Wait for all approval requests to complete
      await Promise.all(approvalPromises);
  
      // After approval, update the bookings in the state
      setBookings(bookings.map((booking) => 
        selectedBookings.includes(booking._id) 
          ? { ...booking, status: 'approved' } 
          : booking
      ));
  
      // Clear selected bookings after approval
      setSelectedBookings([]);
    } catch (error) {
      console.error("Error approving the bookings:", error);
    }
  };
  const handleRejection = async () => {
    try {
      // Loop through selected bookings and send a PUT request for each one
      const rejectionPromises = selectedBookings.map(async (bookingId) => {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error('Error rejecting the booking with ID:', bookingId);
        }
      });
  
      // Wait for all rejection requests to complete
      await Promise.all(rejectionPromises);
  
      // After rejection, update the bookings in the state
      setBookings(bookings.map((booking) => 
        selectedBookings.includes(booking._id) 
          ? { ...booking, status: 'rejected' } 
          : booking
      ));
  
      // Clear selected bookings after rejection
      setSelectedBookings([]);
    } catch (error) {
      console.error("Error rejecting the bookings:", error);
    }
  };
  return (
    <div className="bg-purple-50 font-montserrat min-h-screen py-6">
      {/* Navbar */}
      <Navbar />
      <h2 className="text-3xl font-semibold text-purple-700 text-center mb-8">Bookings List</h2>

{/* Select All checkbox */}
<div className="text-center mb-4 bg-fuchsia-100 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-100">
  <input
    type="checkbox"
    checked={selectedBookings.length === bookings.length}
    onChange={handleSelectAll}
    className="mr-2 accent-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300"
  />
  <span>Select All</span>
</div>

      <div className="container mx-auto p-4 flex flex-wrap justify-center gap-8">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg w-full sm:w-80 md:w-96 lg:w-1/4">
              <p>
                <input
                  type="checkbox"
                  checked={selectedBookings.includes(booking._id)}
                  onChange={() => handleSelectBooking(booking._id)}
                  className="mr-2 "
                />
                <strong className="block text-purple-600">Student:</strong> {booking.student ? booking.student.name : 'N/A'}<br />
                <strong className="block text-purple-600">Instructor:</strong> {booking.instructor ? booking.instructor.name : 'N/A'}<br />
                <strong className="block text-purple-600">Skill:</strong> {booking.skill ? booking.skill.name : 'N/A'}<br />
                <strong className="block text-purple-600">Status:</strong> {booking.status}<br />
                <strong className="block text-purple-600">Date:</strong> {new Date(booking.date).toLocaleString()}<br />
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No bookings available.</p>
        )}
      </div>

      {/* Approval and Rejection buttons */}
      <div className="text-center mt-6">
        <button
          className="bg-purple-700 text-white py-2 px-6 rounded-full hover:bg-purple-800 transition mx-4"
          onClick={handleApproval}
          disabled={selectedBookings.length === 0}
        >
          Approve Selected
        </button>
        <button
          className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition mx-4"
          onClick={handleRejection}
          disabled={selectedBookings.length === 0}
        >
          Reject Selected
        </button>
      </div>
    </div>
  );
};

export default BookingsList;
