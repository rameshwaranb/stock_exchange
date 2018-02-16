const express = require('express');
const router = express.Router();

const Company = require('../models/company');
const CompanyCountry = require('../models/company_country');
const _ = require('lodash');

var companyCountryCategoryJoin = function(qb){
  return qb.join('company_categories', 'company_categories.company_id', 'companies.id')
    .join('categories', 'company_categories.category_id', 'categories.id')
    .join('company_countries', 'company_countries.company_id', 'companies.id')
    .join('countries', 'company_countries.country_id', 'countries.id')
}

router.get('/', async function(req, res, next) {
  try{
    let category = req.query.category;
    let country = req.query.country;
    let baseBid = req.query.baseBid;

    let baseTargeting = await Company.query((qb) => {
      companyCountryCategoryJoin(qb).where({'categories.name': category, 'countries.code': country})
      .select('companies.*').distinct();
    }).get();

    baseTargeting = baseTargeting.toJSON();

    if(!baseTargeting.length){
      return res.send({message: 'No Companies Passed from Targeting'});
    }

    let budgetFilter = baseTargeting.filter((record) => (record.budget > 0.0));

    if(!budgetFilter.length){
      return res.send({message: 'No Companies Passed from Budget'});
    }

    let baseBidFilter = budgetFilter.filter((record) => (baseBid <= record.budget*100));

    if(!baseBidFilter.length){
      return res.send({message: 'No Companies Passed from BaseBid check'});
    }

    let winner = _.maxBy(baseBidFilter, 'budget');

    let updated = await Company.update({ budget: (winner.budget - (baseBid / 100)) }, { id: winner.id })

    return res.send({winner: updated});
  }
  catch(err){
    return res.send({error: err.message})
  }
});

module.exports = router;
