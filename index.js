const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');

// Load .env variables
dotenv.config();

// Route imports
const authRoutes = require('./routes/auth');
const marathonRoutes = require('./routes/marathons');
const applyRoutes = require('./routes/apply');
const statsRoutes = require('./routes/stats'); // ✅ Added for stats

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URI);
let marathonCollection, applyCollection;

async function run() {
  try {
    await client.connect();
    console.log('MongoDB connected successfully');
    const db = client.db('marathonDB');
    marathonCollection = db.collection('marathons');
    applyCollection = db.collection('applications');

    // Pass collections to app
    app.locals.marathonCollection = marathonCollection;
    app.locals.applyCollection = applyCollection;

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/marathons', marathonRoutes);
    app.use('/api/apply', applyRoutes);
    app.use('/api', statsRoutes); // ✅ Mount stats route
    

    // Default route
    app.get('/', (req, res) => {
      res.send('Marathon Management API Running');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

run();
