const connectDB = require('../../database/db');
const MatchPost = require('../../database/models/MatchPost');
const User = require('../../database/User');
const sendEmail = require('../../utils/sendEmail');

module.exports = async (req, res) => {
    await connectDB();

    const { userID, notificationID } = req.body;
    const user = await User.findById(userID);
    if (!user)
        return res.status(400).json({ status: 'error', message: 'User not found' });

    const selectedNotification = user.notifications.id(notificationID);
    const opponentCoachID = user.notifications.id(notificationID).sendingUser;
    
    if (!selectedNotification)
        return res.status(400).json({ status: 'error', message: 'Notification not found' });

    selectedNotification.isRead = true;
    
    const match = await MatchPost.findById(selectedNotification.matchID);
    
    if (!match)
        return res.status(400).json({ status: 'error', message: 'Match not found' });
    
    match.status = 'confirmed';

    const opponentCoach = await User.findById(opponentCoachID);
    if (!opponentCoach)
        return res.status(400).json({ status: 'error', message: 'Opponent coach not found' });
    if (!opponentCoach.notifications) {
            opponentCoach.notifications = [];
       }
      opponentCoach.notifications.push({
          category: 'accepted',
          message: `Your match has been confirmed by ${user.username}. You will receive an email with the contact details of your opponent.`,
          isRead: false,
          date: Date.now(),
          matchID: match._id,
      });

      try {
        await sendEmail(user.email, opponentCoach.phoneNumber, user.username);
    } catch (error) {
        console.log(error);
    }

    try {
        await sendEmail(opponentCoach.email, user.phoneNumber, opponentCoach.username);
    }
    catch (error) {
        console.log(error);
    }

    await match.save();
    await user.save();
    await opponentCoach.save();

    const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
    res.json(unreadNotifications);
}