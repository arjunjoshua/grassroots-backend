const mongoose = require('mongoose');

const MatchPostSchema = new mongoose.Schema({
  team_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  pitchName: { type: String, required: true },
  pitchLocation: { type: String, required: true },
  required_age_group: { type: String, required: true },
  required_proficiency_level: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'confirmed', 'completed', 'cancelled'],
    default: 'open' 
  },
  details: { type: String, required: false },
  interested_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interested_users_names: [{ type: String, required: false }],
  coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('MatchPost', MatchPostSchema);  