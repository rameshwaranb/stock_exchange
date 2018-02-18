const express = require('express');
const router = express.Router();
const exchange = require('../route_handlers/exchange');

router.get('/', exchange.stockExchangeHandler);

module.exports = router;
