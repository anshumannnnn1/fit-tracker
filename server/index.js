const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/steps', require('./routes/steps'));
app.use('/api/calories', require('./routes/calories'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/water', require('./routes/water'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/diet', require('./routes/diet'));

app.get('/api/health', (req, res) => res.json({ status: 'FitTrack API running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
