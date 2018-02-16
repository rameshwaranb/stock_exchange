var express = require('express');
var router = express.Router();

var Company = require('../models/company');
var CompanyCountry = require('../models/company_country');

router.get('/', async function(req, res, next) {
  try{
    let category = req.query.category;
    let country = req.query.country;
    let baseBid = req.query.baseBid;
    let companies = await Company.query(function(qb){
      qb.join('company_categories', 'company_categories.company_id', 'companies.id')
      .join('categories', 'company_categories.category_id', 'categories.id')
      .join('company_countries', 'company_countries.company_id', 'companies.id')
      .join('countries', 'company_countries.country_id', 'countries.id')
      .where({'categories.name': category, 'countries.code': country})
      .where('budget', '>', baseBid/100).select('companies.*').distinct();
    }).get();

    res.send({data: companies.toJSON({omitPivot: true})});
  }
  catch(err){
    res.send({error: err.message})
  }
});

module.exports = router;
