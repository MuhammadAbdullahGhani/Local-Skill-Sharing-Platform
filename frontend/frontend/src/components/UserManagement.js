import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'admin', // Default role
    password: '',  // New password field
  });
  const [userRole, setUserRole] = useState('');  // Store logged-in user's role

  // Navbar Component
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

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
    fetchUserRole();
  }, []);

  // Fetch users - No token required
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        if (response.status === 403) {
          setError('You do not have permission to access this resource.');
        } else {
          setError('Error fetching users');
        }
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Fetch current logged-in user's role
  const fetchUserRole = () => {
    const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);  // Assuming the role is part of the token
      } catch (err) {
        setError('Error decoding token');
      }
    } else {
      setError('No token found');
    }
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding or updating a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selectedUser ? 'PUT' : 'POST';
    const url = selectedUser
      ? `http://localhost:5000/api/users/${selectedUser._id}`
      : 'http://localhost:5000/api/users/create';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setFormData({ name: '', email: '', mobile: '', role: 'admin', password: '' });
      } else {
        setError(result.message || 'Something went wrong!');
      }
    } catch (err) {
      setError('Error during form submission');
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers();
        } else {
          setError('Error deleting user');
        }
      } catch (err) {
        setError('Error during delete request');
      }
    }
  };

  // Open modal for create/update user
  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({ ...user });
    } else {
      setSelectedUser(null);
      setFormData({ name: '', email: '', mobile: '', role: 'admin', password: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>

        {/* Show error if any */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Add New User button */}
        {(userRole === 'admin' || userRole === 'super-admin') && (
          <button
            onClick={() => openModal()}
            className="bg-purple-300 text-white py-2 px-4 rounded-md mb-4 hover:bg-indigo-800"
          >
            Add New User
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-purple-300 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Mobile</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border py-2 px-4">{user.name}</td>
                  <td className="border py-2 px-4">{user.email}</td>
                  <td className="border py-2 px-4">{user.mobile}</td>
                  <td className="border py-2 px-4">{user.role}</td>
                  <td className="border py-2 px-4">
                    {(userRole === 'super-admin' || (userRole === 'admin' && user.role !== 'admin')) && (
                      <button
                        onClick={() => openModal(user)}
                        className="bg-yellow-400 text-white py-1 px-2 rounded-md hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                    )}
                    {(userRole === 'super-admin') && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for user create/update */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl font-semibold mb-4">{selectedUser ? 'Edit User' : 'Add New User'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                    required
                  />
                </div>
                {/* Password field */}
                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                    required={!selectedUser}  // Require password only when creating a new user
                  />
                </div>
                {(userRole === 'super-admin' || (userRole === 'admin' && selectedUser?.role !== 'admin')) && (
                  <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className="border p-2 w-full rounded-md"
                    >
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                  >
                    {selectedUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
