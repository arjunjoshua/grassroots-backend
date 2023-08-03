require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const registerTeams = require('./routes/team');
const matchPost = require('./routes/matchPost');
const teamInfo = require('./routes/teamInfo');
const notifications = require('./routes/notifications');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/teams', registerTeams);
app.use('/api/matchPost', matchPost);
app.use('/api/teamsInfo', teamInfo);
app.use('/api/notifications', notifications);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
