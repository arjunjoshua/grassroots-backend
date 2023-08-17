const connectDB = require('../../database/db');
const MatchPost = require('../../database/models/MatchPost');

module.exports = async (req, res) => {
    await connectDB();

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
}