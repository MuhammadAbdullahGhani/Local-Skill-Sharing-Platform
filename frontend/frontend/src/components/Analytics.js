import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Link } from 'react-router-dom'; // Add Link for navigation


// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Filler);  // Register Filler plugin


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

const Dashboard = () => {
  // State variables to store data fetched from the backend
  const [platformUsage, setPlatformUsage] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [instructorEarnings, setInstructorEarnings] = useState([]);

  // Fetch data from backend on component mount
  useEffect(() => {
    // Fetch platform usage data
    const fetchPlatformUsage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics/platform-usage'); // Adjust the base URL if needed
        const data = await response.json();
        setPlatformUsage(data);
      } catch (error) {
        console.error('Error fetching platform usage:', error);
      }
    };

    // Fetch popular skills data
    const fetchPopularSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics/popular-skills');
        const data = await response.json();
        setPopularSkills(data);
      } catch (error) {
        console.error('Error fetching popular skills:', error);
      }
    };

    // Fetch instructor earnings data
    const fetchInstructorEarnings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics/instructor-earnings');
        const data = await response.json();
        setInstructorEarnings(data);
      } catch (error) {
        console.error('Error fetching instructor earnings:', error);
      }
    };

    // Call all fetch functions
    fetchPlatformUsage();
    fetchPopularSkills();
    fetchInstructorEarnings();
  }, []);

  // Prepare data for charts
  const platformUsageData = {
    labels: platformUsage.map((item) => item._id), // _id contains the activityType
    datasets: [
      {
        label: 'Platform Usage',
        data: platformUsage.map((item) => item.count), // count contains the frequency
        backgroundColor: '#A020F0', // Purple color
        borderColor: '#6A1B9A',
        borderWidth: 1,
      },
    ],
  };

  const skillPopularityData = {
    labels: popularSkills.map((item) => item.skillId.name), // skillId is populated with skill names
    datasets: [
      {
        label: 'Skill Popularity',
        data: popularSkills.map((item) => item.usageCount), // usageCount contains the popularity score
        backgroundColor: '#F3A3D8', // Light Pink Color
        borderColor: '#D81B60',
        borderWidth: 1,
      },
    ],
  };

  const instructorEarningsData = {
    labels: instructorEarnings.map((item) => item.name), // name contains the instructor's name
    datasets: [
      {
        label: 'Earnings',
        data: instructorEarnings.map((item) => item.totalEarnings), // totalEarnings contains the earnings
        borderColor: '#FF8A65', // Orange color
        backgroundColor: 'rgba(255, 138, 101, 0.2)', // Transparent orange
        fill: true,  // Ensure fill is enabled
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] py-8 px-6 sm:px-12">
      <Navbar /> {/* Include the Navbar */}
      {/* Dashboard Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-[#6A1B9A]">Analytics Dashboard</h1>
      </header>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Platform Usage Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#6A1B9A] mb-4">Platform Usage</h2>
          <div className="h-72">
            <Bar data={platformUsageData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Popular Skills Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#6A1B9A] mb-4">Popular Skills</h2>
          <div className="h-72">
            <Bar data={skillPopularityData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Instructor Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#6A1B9A] mb-4">Instructor Earnings</h2>
          <div className="h-72">
            <Line data={instructorEarningsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Footer (Optional) */}
      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2024 Skill Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
