const logger = require('../util/logger');
const Company = require('../models/company');
const _ = require('lodash');
const { baseTargetingCheck, budgetCheck, baseBidCheck, shortListAndUpdate} = require('../src/exchange');

let stockExchangeHandler = async function(req, res, next) {
  try{
    let {country, category, baseBid} = req.query;
    if(!country || !category || !baseBid){
      res.send({error: 'Missing user input!! Country, Category and Basebid are required fields'})
    }

    let allCompanies = await Company.get();
    let allCompany = _.groupBy(allCompanies.toJSON(), (company) => company.id);

    let baseTargeting = await baseTargetingCheck({country, category}, allCompany);
    if(!baseTargeting.length){
      return res.send({message: 'No Companies Passed from Targeting'});
    }

    let budgetFilter = budgetCheck(baseBid, baseTargeting, allCompany);
    if(!budgetFilter.length){
      return res.send({message: 'No Companies Passed from Budget'});
    }

    let baseBidFilter = baseBidCheck(baseBid, budgetFilter, allCompany)
    if(!baseBidFilter.length){
      return res.send({message: 'No Companies Passed from BaseBid check'});
    }

    let winner = await shortListAndUpdate(baseBid, baseBidFilter);

    return res.send({winner: winner});
  }
  catch(err){
    return res.send({error: err.message})
  }
};

module.exports = { stockExchangeHandler }
