// index.js - A standalone Node.js backend using Express.
// This server stores all data in memory, so it will be reset if the server restarts.

const express = require('express');
const cors = require('cors');

// --- Initialization ---
const app = express();
const port = 5000; // The port the server will listen on

// --- In-Memory Database ---
// A simple JavaScript object to store machine data.
// The key will be the machineId.
const machinesDB = {};

// --- Middleware ---
// Enable CORS (Cross-Origin Resource Sharing) to allow your frontend
// to make requests to this backend.
app.use(cors());
// Enable the express server to parse JSON request bodies.
app.use(express.json());


// --- API Routes ---

/**
 * Endpoint to accept system health data from client utilities.
 * This route expects a POST request to /api/report.
 */
app.post('/api/report', (req, res) => {
  // 1. Validate the incoming data
  const data = req.body;
  const { machineId, hostname, os, healthData } = data;

  if (!machineId || !hostname || !os || !healthData) {
    return res.status(400).send({ 
      error: "Bad Request: Missing required fields (machineId, hostname, os, healthData)." 
    });
  }

  // 2. Prepare the data object for storage
  const machineDoc = {
    ...data,
    // Add a timestamp from the server
    lastCheckIn: new Date().toISOString(),
  };

  // 3. Write the data to our in-memory DB
  machinesDB[machineId] = machineDoc;

  console.log(`Successfully updated health data for machine: ${machineId}`);
  return res.status(200).send({ status: "success", machineId: machineId });
});


/**
 * Endpoint for the frontend dashboard to fetch all machine data.
 * This route responds to GET requests at /api/machines.
 */
app.get('/api/machines', (req, res) => {
  // Convert the machinesDB object into a list (array)
  const machineList = Object.values(machinesDB);
  res.status(200).json(machineList);
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Standalone backend server listening at http://localhost:${port}`);
});
