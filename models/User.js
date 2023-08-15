const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const User_Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  team_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  notifications: [{
    category: String,
    message: String,
    isRead: Boolean,
    date: Date,
    matchID: String,
    interested_team_name: String,
    sendingUser: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
});

// Hash the password before saving it to the database
User_Schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', User_Schema);
