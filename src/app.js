require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { healthRoute } = require('./routes/health');

const pool = require('./config/db.ts');

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use(healthRoute);

// listening
app.listen(process.env.PORT || 3000, () => {
  console.log('3000 port is listening');
});
