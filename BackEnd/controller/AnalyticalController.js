const Usage = require('../models/AnalyticalSchema');
const SkillPopularity = require('../models/AnalyticalSchema');
const InstructorEarnings = require('../models/AnalyticalSchema');

// Get platform usage analytics
const getPlatformUsage = async (req, res) => {
  try {
    const usageData = await Usage.aggregate([
      { $group: { _id: '$activityType', count: { $sum: 1 } } }
    ]);
    res.json(usageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching platform usage data' });
  }
};

// Get popular skills
const getPopularSkills = async (req, res) => {
  try {
    const popularSkills = await SkillPopularity.find()
      .sort({ usageCount: -1 })
      .limit(5) // Top 5 popular skills
      .populate('skillId', 'name');
    res.json(popularSkills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching popular skills data' });
  }
};

// Get instructor earnings
const getInstructorEarnings = async (req, res) => {
  try {
    const earnings = await InstructorEarnings.aggregate([
      { $group: { _id: '$userId', totalEarnings: { $sum: '$amount' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', totalEarnings: 1 } }
    ]);
    res.json(earnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching instructor earnings data' });
  }
};

module.exports = {
  getPlatformUsage,
  getPopularSkills,
  getInstructorEarnings
};
