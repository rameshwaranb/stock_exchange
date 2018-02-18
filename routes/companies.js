var express = require('express');
var router = express.Router();
const companies = require('../route_handlers/companies');

/* GET home page. */
router.get('/', companies.getAllCompanies);

module.exports = router;
