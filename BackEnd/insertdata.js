const mongoose = require('mongoose');
const { Usage, SkillPopularity, InstructorEarnings } = require('./models/AnalyticalSchema'); // Corrected import

// Connect to MongoDB
mongoose.connect('mongodb+srv://abdullahghani:1234@cluster0.ehehitv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Insert Usage data
const insertUsageData = async () => {
  const usageData = [
    {
      userId: new mongoose.Types.ObjectId("60c72b2f9b1d8b001f8f1c4e"), 
      activityType: "login",
      timestamp: new Date("2024-01-01T12:00:00Z")
    },
    {
      userId: new mongoose.Types.ObjectId("60c72b2f9b1d8b001f8f1c4f"), 
      activityType: "purchase",
      timestamp: new Date("2024-01-02T14:30:00Z"),
      skillId: new mongoose.Types.ObjectId("60c72b9f9b1d8b001f8f1c4a") 
    }
  ];

  await Usage.insertMany(usageData);
  console.log('Usage data inserted');
};

// Insert Skill Popularity data
const insertSkillPopularityData = async () => {
  const skillData = [
    {
      skillId: new mongoose.Types.ObjectId("60c72b9f9b1d8b001f8f1c4a"),
      usageCount: 50,
      lastUsed: new Date("2024-01-01T10:00:00Z")
    },
    {
      skillId: new mongoose.Types.ObjectId("60c72b9f9b1d8b001f8f1c4b"),
      usageCount: 30,
      lastUsed: new Date("2024-01-02T11:30:00Z")
    }
  ];

  await SkillPopularity.insertMany(skillData);
  console.log('Skill popularity data inserted');
};

// Insert Instructor Earnings data
const insertInstructorEarningsData = async () => {
  const earningsData = [
    {
      userId: new mongoose.Types.ObjectId("60c72b2f9b1d8b001f8f1c4e"),
      amount: 200,
      skillId: new mongoose.Types.ObjectId("60c72b9f9b1d8b001f8f1c4a"),
      dateEarned: new Date("2024-01-01T15:00:00Z")
    },
    {
      userId: new mongoose.Types.ObjectId("60c72b2f9b1d8b001f8f1c4f"),
      amount: 150,
      skillId: new mongoose.Types.ObjectId("60c72b9f9b1d8b001f8f1c4b"),
      dateEarned: new Date("2024-01-02T13:00:00Z")
    }
  ];

  await InstructorEarnings.insertMany(earningsData);
  console.log('Instructor earnings data inserted');
};

// Run the insert functions
const insertAllData = async () => {
  await insertUsageData();
  await insertSkillPopularityData();
  await insertInstructorEarningsData();
  mongoose.connection.close();
};

insertAllData().catch((error) => {
  console.log('Error inserting data:', error);
});
