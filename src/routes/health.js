const route = require('express').Router();
const { getHealthStatus } = require('../controllers/health');

route.get('/health', getHealthStatus);


module.exports = { route }