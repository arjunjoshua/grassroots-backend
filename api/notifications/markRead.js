const connectDB = require('../../database/db');
const User = require('../../database/User');

module.exports = async (req, res) => {
    await connectDB();

    const { userID, notificationID } = req.body;
    const user = await User.findById(userID);
    if (!user)
        return res.status(400).json({ status: 'error', message: 'User not found' });

    const selectedNotification = user.notifications.id(notificationID);

    if (!selectedNotification)
        return res.status(400).json({ status: 'error', message: 'Notification not found' });

    selectedNotification.isRead = true;

    await user.save();
    const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
    res.json(unreadNotifications);
}