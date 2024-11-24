const express = require('express');
const dayController = require('../controllers/dayController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { day } = require("../models");

const routerDay = express.Router();

routerDay.get('/', authenticateToken, dayController.getAllDays);
routerDay.put('/addDay', authenticateToken, dayController.addDay);

module.exports = routerDay;
