const express = require('express');
const MatchPost = require('../models/MatchPost');
const User = require('../models/User');
const Team = require('../models/Team');
const router = express.Router();

router.post('/', async (req, res) => {
    const { teamID, date, time, pitchName, pitchLocation, requiredAgeGroup, requiredProficiencyLevel, details, coach_id } = req.body;

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
        coach_id,
    });

    const savedMatchPost = await matchPost.save();

    res.json({ status: 'success'});
});

router.get('/openMatches', async (req, res) => {
    const { ageGroup, userID } = req.query;
    const currentDate = new Date();

    try {
        const matchPosts = await MatchPost.find({ 
            required_age_group: ageGroup, 
            status: 'open', 
            coach_id: { $ne: userID },
            date: { $gte: currentDate }
         });
        res.json({ status: 'success', matchPosts });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});

router.post('/interested', async (req, res) => {
    const {userID, matchID, isInterested, teamID} = req.body;

    try {
        const selectedMatch = await MatchPost.findById(matchID);
        if (!selectedMatch) {
            return res.status(400).json({ status: 'error', message: 'Match not found' });
            console.log('Match not found');
        }

        const interestedUser = await User.findById(userID);
        if (!interestedUser){
            return res.status(400).json({ status: 'error', message: 'User not found' });
            console.log('User not found');
        }

        
        const interestedTeam = await Team.findById(teamID);
        if (!interestedTeam) {
            return res.status(400).json({ status: 'error', message: 'Team not found' });
            console.log('Team not found');
        }
           
        if (!isInterested) {   
            const index = selectedMatch.interested_users.indexOf(userID);
            if (index > -1) {
                selectedMatch.interested_users.splice(index, 1);
                selectedMatch.interested_users_names.splice(index, 1);
                await selectedMatch.save();
            }
            return res.json({ status: 'success' });
        }

        // Commenting out this code because it's not needed anymore.
        // if (!selectedMatch.interested_users) {
        //     selectedMatch.interested_users = [];
        // }
        // if (!selectedMatch.interested_users_names) {
        //     selectedMatch.interested_users_names = [];
        // }

       const postingUser = await User.findById(selectedMatch.coach_id);
       if (!postingUser) {
            return res.status(400).json({ status: 'error', message: 'Posting user not found' });
            console.log('Posting user not found');
       }
            
       if (!postingUser.notifications) {
              postingUser.notifications = [];
         }
        postingUser.notifications.push({
            category: 'request',
            message: `${interestedUser.username} is interested in your match post`,
            isRead: false,
            date: Date.now(),
            matchID: selectedMatch._id,
            interested_team_name: interestedTeam.team_name,
            sendingUser: userID,
        });
             
        selectedMatch.interested_users_names.push(interestedUser.username);
        selectedMatch.interested_users.push(userID);

        await postingUser.save();
        await selectedMatch.save();
        
        return res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;