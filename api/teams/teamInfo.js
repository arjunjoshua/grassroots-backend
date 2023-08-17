const connectDB = require('../../database/db');
const Team = require('../../database/models/Team');

module.exports = async (req, res) => {
    await connectDB(); 

    const { userID } = req.query;
    const Teams = await Team.find({ coach_id: userID });
    res.json(Teams);
}

