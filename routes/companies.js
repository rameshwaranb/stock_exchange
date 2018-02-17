var express = require('express');
var router = express.Router();

var Company = require('../models/company');

/* GET home page. */
router.get('/', function(req, res, next) {
  Company.where({}).fetchAll({withRelated: ['countries', 'categories']}).then(function(result){
    res.send({data: result.toJSON({omitPivot: true})});
  })
});

module.exports = router;
