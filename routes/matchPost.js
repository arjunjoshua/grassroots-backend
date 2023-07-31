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

router.post('/interested', async (req, res) => {
    const {userID, matchID, isInterested} = req.body;

    try {
        const selectedMatch = await MatchPost.findById(matchID);
        if (!selectedMatch)
            return res.status(400).json({ status: 'error', message: 'Match not found' });

        const interestedUser = await User.findById(userID);
        if (!interestedUser)
            return res.status(400).json({ status: 'error', message: 'User not found' });

        if (!isInterested) {   
            const index = selectedMatch.interested_users.indexOf(userID);
            if (index > -1) {
                selectedMatch.interested_users.splice(index, 1);
                selectedMatch.interested_users_names.splice(index, 1);
                await selectedMatch.save();
            }
            return res.json({ status: 'success' });
        }

        if (!selectedMatch.interested_users) {
            selectedMatch.interested_users = [];
        }
        if (!selectedMatch.interested_users_names) {
            selectedMatch.interested_users_names = [];
        }
        
        selectedMatch.interested_users_names.push(interestedUser.username);
        selectedMatch.interested_users.push(userID);
        await selectedMatch.save();
        
        return res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;