const healthRoute = require('express').Router();
const { getHealthStatus } = require('../controllers/health');

healthRoute.get('/health', getHealthStatus);

module.exports = { healthRoute };
