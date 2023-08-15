require('dotenv').config();
const User = require('../models/User');
const router = require('express').Router();
const express = require('express');
const MatchPost = require('../models/MatchPost');
const Team = require('../models/Team');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', async (req, res) => {
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
});

router.put('/', async (req, res) => {
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
});

router.put('/accept', async (req, res) => {
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

    // const teamName = selectedNotification.interested_team_name;

    // const team = await Team.findOne({ team_name: teamName });
    // if (!team)
    //     return res.status(400).json({ status: 'error', message: 'Team not found' });

    // if(!match.opponent_team_id)
    //     match.opponent_team_id = [];

    // match.opponent_team_id = team._id;
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
});

async function sendEmail(recipient, phoneNumber, username)
{
        const msg = {
        to: recipient,
        from: process.env.EMAIL_ID,
        subject: 'Contact Details for your upcoming match',
        text: `Hello ${username}, 
         
        ${phoneNumber} is your opponent's contact number. Good luck!`,
    };

    return sgMail.send(msg);
}


module.exports = router;
