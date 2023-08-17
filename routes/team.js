const express = require('express');
const Team = require('../database/Team');
const User = require('../database/User');

const router = express.Router();

router.post('/', async (req, res) => {
  const { teamName, ageGroup, proficiencyLevel, kitColor, coachID } = req.body;
  
  // Create new team
  const team = new Team({
    team_name: teamName,
    age_group: ageGroup,
    proficiency_level: proficiencyLevel,
    kit_color: kitColor,
    coach_id: coachID,
  });

  // Save the team
  const savedTeam = await team.save();

  // Update the coach's User document with the new team's ID
  const coach = await User.findById(coachID);
  coach.team_id.push(savedTeam._id);
  await coach.save();

  res.json({ status: 'success', teamId: savedTeam._id });
});

module.exports = router;
