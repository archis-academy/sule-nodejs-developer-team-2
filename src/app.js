require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { healthRoute } = require('./routes/health.js');
const prisma = require('./config/db.ts');
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use(healthRoute);

// server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server ${process.env.PORT || 3000} portunda çalışıyor`);
});
