const connectDB = require('../../database/db');
const User = require('../../database/models/User');

module.exports = async (req, res) => {
    await connectDB(); 

    const { userID } = req.query;
    const user = await User.findById(userID);
    if (!user)
        return res.status(400).json({ status: 'error', message: 'User not found' });
    if(!user.notifications){
        user.notifications = [];    
    await user.save();
    }
    const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
    res.json(unreadNotifications);
}