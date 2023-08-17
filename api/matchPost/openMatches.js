const connectDB = require('../../database/db');
const MatchPost = require('../../database/models/MatchPost');


module.exports = async (req, res) => {
    await connectDB();

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
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}
