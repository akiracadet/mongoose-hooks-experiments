require('dotenv').config();

const PORT = process.env.PORT || 8080;

const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('Database connection successful');
});

const app = express();

app.use(express.json());
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
