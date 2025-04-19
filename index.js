const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deliveryRoute = require('./deliveryRoute');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

// Routes
app.use('/api/delivery', deliveryRoute);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
