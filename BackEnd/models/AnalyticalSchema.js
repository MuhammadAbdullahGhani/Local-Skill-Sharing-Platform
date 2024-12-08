const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, enum: ['login', 'view', 'purchase', 'skill-use'], required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }, // Associated skill for "skill-use" activity
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true },{collection: 'Usage'});


const skillPopularitySchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  usageCount: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

const instructorEarningsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }, // Skill linked to the earnings
  dateEarned: { type: Date, default: Date.now }
}, { timestamps: true });

const InstructorEarnings = mongoose.model('InstructorEarnings', instructorEarningsSchema);


const Usage = mongoose.model('Usage', usageSchema);


const SkillPopularity = mongoose.model('SkillPopularity', skillPopularitySchema);

module.exports = SkillPopularity, Usage, InstructorEarnings;
