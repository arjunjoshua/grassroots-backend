const User = require('../models/User');
const router = require('express').Router();
const express = require('express');
const MatchPost = require('../models/MatchPost');
const Team = require('../models/Team');

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
    
    if (!selectedNotification)
        return res.status(400).json({ status: 'error', message: 'Notification not found' });

    selectedNotification.isRead = true;
    
    const match = await MatchPost.findById(selectedNotification.matchID);
    
    if (!match)
        return res.status(400).json({ status: 'error', message: 'Match not found' });

    const teamName = selectedNotification.interested_team_name;

    const team = await Team.findOne({ team_name: teamName });
    if (!team)
        return res.status(400).json({ status: 'error', message: 'Team not found' });

    match.opponent_team_id = team._id;
    match.status = 'confirmed';

    await match.save();
    await user.save();

    const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
    res.json(unreadNotifications);
});


module.exports = router;
