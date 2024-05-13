const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors'); 
const port = 3000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/leaderboard', { useNewUrlParser: true });


const leaderboardSchema = new mongoose.Schema({
  username: String,
  score: Number,
});

const userSchema = new mongoose.Schema({
username:String,
password:String,
});


const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

const ds = mongoose.model('ds', userSchema);

if(ds)console.log(ds);



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const User = await ds.findOne({ username, password });

    if (User) {
      
      res.status(200).json({ message: 'Login successful' });
    } else {
      
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 });
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new entry to the leaderboard
app.post('/leaderboard', async (req, res) => {
  try {
    const { username, score } = req.body;
    const entry = new Leaderboard({ username, score });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT request to update a user's score
app.put('/update-score', async (req, res) => {
  try {
    const { username, score } = req.body;
    const updatedEntry = await Leaderboard.findOneAndUpdate(
      { username }, 
      { score }, 
      { new: true } 
    );

    if (!updatedEntry) {
      // Handle the case where the username is not found
      res.status(404).json({ message: 'Username not found' });
    } else {
      res.json(updatedEntry);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
