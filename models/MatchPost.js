const mongoose = require('mongoose');

const MatchPostSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  pitchName: { type: String, required: true },
  pitchLocation: { type: String, required: true },
  required_age_group: { type: String, required: true },
  required_proficiency_level: { type: String, required: true },
  status: { type: String, enum: ['open', 'confirmed', 'completed', 'cancelled'], default: 'open' },
  // opponent_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  details: { type: String, required: false },
});

module.exports = mongoose.model('MatchPost', MatchPostSchema);