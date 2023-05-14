const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Define the path to the JSON file
const filePath = path.join(__dirname, 'paragraphs.json');

// Define a route to return a random paragraph
app.get('/paragraph', (req, res) => {
  // Read the content of the JSON file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    // Parse the JSON content into a JavaScript object
    const paragraphs = JSON.parse(data).paragraphs;
    // Generate a random index to select a random paragraph
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    // Return the selected paragraph as the response
    res.send(paragraphs[randomIndex]);
  });
});

// Define a route for the homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Typing Test API</title>
      </head>
      <body>
        <h1>Typing Test API</h1>
        <p>To use this API, make a GET request to the /paragraph endpoint. The response will be a random paragraph in plain text format. </p>
        <p>Example usage: <code>curl http://localhost:3000/paragraph</code></p>
      </body>
    </html>
  `);
});

// Middleware for handling undefined routes and unsupported HTTP methods
app.use((req, res, next) => {
  // If the request method is not GET
  if (req.method !== 'GET') {
    const error = new Error('Method not allowed');
    error.status = 405;
    next(error);
    return;
  }
  // If the route is not defined
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'error.html'));
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
