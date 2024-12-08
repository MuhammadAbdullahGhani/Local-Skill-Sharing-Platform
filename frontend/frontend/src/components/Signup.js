import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'admin',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Account created successfully!');
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error creating account.');
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:block bg-fuchsia-100 text-black p-8 w-1/3">
          <h1 className="text-2xl font-bold mb-4 text-black">Local Skill Sharing</h1>
          <p className="text-lg mb-6">
            Discover tailored events. <br /> Sign up for personalized recommendations today!
          </p>
        </div>

        {/* Right Section */}
        <div className="py-2 px-8 w-full md:w-2/3">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email and Mobile Number Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your e-mail"
                  required
                  className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  required
                  className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-100"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Register As
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="superadmin">supportadmin</option>
                <option value="supportadmin">superadmin</option>
          
              </select>
            </div>

            {/* Password and Confirm Password Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-fuchsia-100 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-600"
            >
              Create an account
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Already have an account?{' '}
            <a href="./Login.js" className="text-fuchesa-300 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
