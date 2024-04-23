import express from 'express';
import pool from './utils/database'; // Change import statement
import identifyRouter from './controllers/identifyController'; // Move import statement to the top
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port
app.use(express.json()); // Parse incoming JSON payloads

// Mount the router, possibly with a prefix
app.use('/api', identifyRouter);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// Error handling (Basic example - you might want a more robust approach)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
);

// Start the server
pool
  .connect() // Connecting to the database
  .then(() => {
    console.log('Database connection successful');
    app.listen(port, () => {
      console.log(`Bitespeed Customer Identification service listening on port ${port}`);
    });
  })
  .catch((error: any) => {
    // Explicitly type 'error' as 'any'
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if database connection fails
  });
