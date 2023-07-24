const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  const { team_name, age_group, proficiency_level, kit_color, coach_id } = req.body;
  
  // Create new team
  const team = new Team({
    team_name,
    age_group,
    proficiency_level,
    kit_color,
    coach_id: coach_id
  });

  // Save the team
  const savedTeam = await team.save();

  // Update the coach's User document with the new team's ID
  const coach = await User.findById(coach_id);
  coach.team_id.push(savedTeam._id);
  await coach.save();

  res.json({ status: 'success', teamId: savedTeam._id });
});

module.exports = router;
