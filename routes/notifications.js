const User = require('../models/User');
const router = require('express').Router();
const express = require('express');

router.get('/', async (req, res) => {
    const { userID } = req.query;
    const user = await User.findById(userID);
    if (!user)
        return res.status(400).json({ status: 'error', message: 'User not found' });
    if(!user.notifications){
        user.notifications = [];    
    await user.save();
    }
    res.json(user.notifications);
});

router.put('/', async (req, res) => {
    const { userID, notificationID } = req.body;
    const user = await User.findById(userID);
    if (!user)
        return res.status(400).json({ status: 'error', message: 'User not found' });

    const selectedNotification = user.notifications.id(notificationID);
    selectedNotification.isRead = true;

    if (!selectedNotification)
        return res.status(400).json({ status: 'error', message: 'Notification not found' });

    await user.save();
    const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
    res.json(unreadNotifications);
});


module.exports = router;
