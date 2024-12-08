const Skill = require('../models/Skill');

// Get all skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error });
  }
};

// Create a new skill
const createSkill = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSkill = new Skill({ name, description });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create skill', error });
  }
};

// Update a skill
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skill', error });
  }
};

// Delete a skill
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill', error });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
