const Team = require('../models/Team');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const { userID } = req.query;
    const Teams = await Team.find({ coach_id: userID });
    res.json(Teams);
    });

module.exports = router;
    