// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');  // Import the path module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve the index.html file
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

// Endpoint to get databases
app.post('/databases', async (req, res) => {
  const { connectionString } = req.body;

  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const databases = await client.db().admin().listDatabases();
    await client.close();

    res.json(databases.databases.map(db => db.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB' });
  }
});

// Endpoint to get collections in a database
app.post('/collections', async (req, res) => {
  const { connectionString, databaseName } = req.body;

  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collections = await client.db(databaseName).listCollections().toArray();
    await client.close();

    res.json(collections.map(col => col.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB' });
  }
});

// Endpoint to get documents from a collection
app.post('/documents', async (req, res) => {
  const { connectionString, databaseName, collectionName } = req.body;

  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const documents = await client.db(databaseName).collection(collectionName).find().toArray();
    await client.close();

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
