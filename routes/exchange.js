const express = require('express');
const router = express.Router();
const exchange = require('../route_handlers/exchange');

// Query parameters:
// baseBid
// country
// category
router.get('/', exchange.stockExchangeHandler);

module.exports = router;
