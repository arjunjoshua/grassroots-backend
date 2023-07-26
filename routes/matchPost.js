const express = require('express');
const MatchPost = require('../models/MatchPost');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const { teamID, date, time, pitchName, pitchLocation, requiredAgeGroup, requiredProficiencyLevel, details } = req.body;

    // Create new match post
    const matchPost = new MatchPost({
        team_id: teamID,
        date,
        time,
        pitchName,
        pitchLocation,
        required_age_group: requiredAgeGroup,
        required_proficiency_level: requiredProficiencyLevel,
        details,
    });

    const savedMatchPost = await matchPost.save();

    res.json({ status: 'success'});
});

module.exports = router;