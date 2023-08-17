const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../database/db');

module.exports = async (req, res) => {
    await connectDB();
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
        }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
        }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { username } = user;

    res.json({ status: 'success', token, username, userId: user._id });
    }
    
