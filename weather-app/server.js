const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// CORS middleware to allow requests from your React app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/quakes', async (req, res) => {
  const period = req.query.time;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const microserviceURL = 'http://localhost:5000/quakes';

  try {
    const microserviceResponse = await forwardRequestToMicroservice(microserviceURL, 'GET', { period, lat, lon });
    res.json(microserviceResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching earthquake data');
  }
});

function forwardRequestToMicroservice(url, method, data) {
  return axios({
    method,
    url,
    data
  })
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw new Error('Error forwarding request to microservice');
    });
}

// Serve the React app
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
