const Team = require('../database/Team');
const User = require('../database/User');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const { userID } = req.query;
    const Teams = await Team.find({ coach_id: userID });
    res.json(Teams);
    });

module.exports = router;
    