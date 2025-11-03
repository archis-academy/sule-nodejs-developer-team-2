require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { route } = require('./routes/health');

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use(route);

// listening
app.listen(process.env.PORT || 3000, () => {
    console.log('3000 port is listening');
})