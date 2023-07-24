const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  age_group: { type: String, required: true },
  proficiency_level: { type: String, required: true },
  kit_color: { type: String, required: true },
  coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Team', TeamSchema);