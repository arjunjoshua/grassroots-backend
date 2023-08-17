const connectDB = require('../../database/db');
const MatchPost = require('../../database/models/MatchPost');
const User = require('../../database/models/User');
const Team = require('../../database/models/Team');

module.exports = async (req, res) => {
    await connectDB();

    const {userID, matchID, isInterested, teamID} = req.body;

    const selectedMatch = await MatchPost.findById(matchID);
    if (!selectedMatch) {
        return res.status(400).json({ status: 'error', message: 'Match not found' });
    }

    const interestedUser = await User.findById(userID);
    if (!interestedUser){
        return res.status(400).json({ status: 'error', message: 'User not found' });
    }

    
    const interestedTeam = await Team.findById(teamID);
    if (!interestedTeam) {
        return res.status(400).json({ status: 'error', message: 'Team not found' });
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

    const postingUser = await User.findById(selectedMatch.coach_id);
    if (!postingUser) {
        return res.status(400).json({ status: 'error', message: 'Posting user not found' });
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
}
        