const express = require('express');
const app = express();
const cors = require('cors');
const { route } = require('./src/routes/health');

// routes
app.use(route);

// middlewares
app.use(express.json());
app.use(cors());



// listening
app.listen(3000, () => {
    console.log('3000 port is listening');
})