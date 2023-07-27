const Team = require('../models/Team');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/teamsInfo', async (req, res) => {
    const { userID } = req.params;
    const Teams = await Team.find({ user_id: userID });
    res.json(Teams);
    });

module.exports = router;
    