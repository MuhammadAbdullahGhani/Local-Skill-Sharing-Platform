import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add Link for navigation

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

const SkillManagementPage = () => {
  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState({ _id: null, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        console.log(data); // Check the structure of the skills
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillForm({ ...skillForm, [name]: value });
  };

  const handleEdit = (skill) => {
    console.log("Editing skill:", skill);  // Log the whole skill object
    console.log("Skill ID:", skill._id);  // Log the skill ID to verify it is passed
    
    if (!skill._id) {
      console.error("Skill ID is missing!");
      return;  // Early return if skill ID is missing
    }
    
    // Set the skill form for editing
    setSkillForm({ _id: skill._id, name: skill.name, description: skill.description });
    setIsEditing(true);  // Set editing mode to true
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const response = await fetch(`http://localhost:5000/api/skills/${skillForm._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: skillForm.name,
            description: skillForm.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update skill');
        }

        const updatedSkill = await response.json();
        setSkills(skills.map((skill) => (skill._id === updatedSkill._id ? updatedSkill : skill)));
        setIsEditing(false);  // Reset editing mode
        setSkillForm({ _id: null, name: '', description: '' });  // Reset form
      } catch (error) {
        console.error('Error updating skill:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: skillForm.name,
            description: skillForm.description,
          }),
        });

        const newSkill = await response.json();
        setSkills([...skills, newSkill]);  // Add new skill to the list
      } catch (error) {
        console.error('Error creating skill:', error);
      }
    }

    setSkillForm({ _id: null, name: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Skill ID is missing!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/skills/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSkills(skills.filter((skill) => skill._id !== id));  // Remove deleted skill from the list
      } else {
        console.error('Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name && skill.name.toLowerCase().includes(filter.toLowerCase()) // Check if name exists before using toLowerCase
  );

  return (
    <>
      <Navbar /> {/* Include the Navbar */}

      <div className="bg-[#ECE6F6] min-h-screen py-6 flex px-8">
        {/* Filter Section */}
        <div className="w-1/4 bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter Skills</h2>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Search skills by name"
          />
        </div>

 {/* Skill Management Section */}
<div className="w-60% sm:w-1/2 flex flex-col items-start space-y-6">
  {/* Skill List */}
  <div className="w-60% bg-fuchsia-100 p-6 rounded-lg shadow-lg ml-1">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills List</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSkills.map((skill) => (
        <li
          key={skill._id}
          className="bg-white p-6 h-[270px] rounded-lg shadow-lg flex flex-col justify-between transition-all transform hover:scale-105 hover:shadow-xl"
        >
          <div>
            <strong className="text-xl font-bold text-black">{skill.name}</strong>
            <p className="text-sm text-black mt-2">{skill.description}</p>
          </div>

          {/* Buttons Section */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleEdit(skill)}
              className="px-5 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(skill._id)}
              className="px-5 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-all transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>


        {/* Add Skill Form - Extreme Right */}
        <div className="w-1/4 bg-fuchesa-300 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Skill</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Skill Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={skillForm.name}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Enter skill name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Skill Description</label>
              <textarea
                id="description"
                name="description"
                value={skillForm.description}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter skill description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700"
            >
              {isEditing ? 'Update Skill' : 'Add Skill'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SkillManagementPage;
