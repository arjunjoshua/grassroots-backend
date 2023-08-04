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

module.exports = router;
