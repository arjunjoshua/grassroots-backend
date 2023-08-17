const connectDB = require('../database/db');
const User = require('../database/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    await connectDB();
    const { username, phoneNumber, email, password } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
        }
    
    //create new user
    user = new User({
        username,
        phoneNumber,
        email,
        password,
    });

    //save the user and return response
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ status: 'success', token, username, userID: user._id });
    }
