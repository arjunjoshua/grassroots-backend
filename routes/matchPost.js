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

router.get('/openMatches', async (req, res) => {
    const { ageGroup } = req.query;

    try {
        const matchPosts = await MatchPost.find({ required_age_group: ageGroup, status: 'open' });
        res.json({ status: 'success', matchPosts });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});

module.exports = router;