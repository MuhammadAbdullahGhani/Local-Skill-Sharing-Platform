import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect to the user's dashboard or home page
        alert('Login successful');
        navigate('/user-management'); // Adjust this to the correct route
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error logging in.');
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:block bg-fuchsia-100 text-black p-8 w-1/3">
          <h1 className="text-2xl font-bold mb-4 text-black">Local Skill Sharing</h1>
          <p className="text-lg mb-6">
            Welcome back! <br /> Log in to continue your journey.
          </p>
        </div>

        {/* Right Section */}
        <div className="py-2 px-8 w-full md:w-2/3">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Log In</h2>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full border rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-fuchsia-100 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-600"
            >
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Don't have an account?{' '}
            <a href="./Signup" className="text-fuchesa-300 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
