const express = require('express');
const router = express.Router();

const exchange = require('../src/exchange');

router.get('/', exchange.stockExchangeHandler);

module.exports = router;
