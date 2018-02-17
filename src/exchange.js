const express = require('express');

const Company = require('../models/company');
const CompanyCountry = require('../models/company_country');
const _ = require('lodash');

const logger = require('../util/logger');

var companyCountryCategoryJoin = function(qb){
  return qb.join('company_categories', 'company_categories.company_id', 'companies.id')
    .join('categories', 'company_categories.category_id', 'categories.id')
    .join('company_countries', 'company_countries.company_id', 'companies.id')
    .join('countries', 'company_countries.country_id', 'countries.id')
}

var constructLog = function(caller, allCompany, currentFilter){
  let combinedLog = _.map(_.sortBy(_.keys(allCompany)), (key) => {
    if(currentFilter[key]){
      return `{${allCompany[key][0].name}, Passed}`
    }
    else{
      return `{${allCompany[key][0].name}, Failed}`
    }
  });

  logger.info(`${caller}: ${combinedLog.join(',')}`);
}


var baseTargetingCheck = async function(query, allCompany){
  let baseTargetingFilter = await Company.query((qb) => {
    companyCountryCategoryJoin(qb).where({'categories.name': query.category, 'countries.code': query.country})
    .select('companies.*').distinct();
  }).get();

  let baseTargeting = baseTargetingFilter.toJSON();
  let baseTargetingGrouped = _.groupBy(baseTargeting, (record) => (record.id));
  constructLog('BaseTargeting', allCompany, baseTargetingGrouped)

  return baseTargeting;
}

var budgetCheck = function(baseBid, baseTargeting, allCompany){
  let budgetFilter = baseTargeting.filter((record) => (record.budget > 0.0));
  let budgetFilterGrouped = _.groupBy(budgetFilter, (record) => (record.id));
  constructLog('BudgetCheck', allCompany, budgetFilterGrouped)

  return budgetFilter;
}

var baseBidCheck = function(baseBid, budgetFilter, allCompany){
  let baseBidFilter = budgetFilter.filter((record) => (baseBid <= record.budget*100 && record.bid <= baseBid));
  let baseBidFilterGrouped = _.groupBy(baseBidFilter, (record) => (record.id));
  constructLog('BaseBid', allCompany, baseBidFilterGrouped)

  return baseBidFilter;
}

var shortListAndUpdate = async function(baseBid, baseBidFilter){
  let winner = _.maxBy(baseBidFilter, 'budget');
  logger.info(`Winner = ${winner.id}`);

  let updated = await Company.update({ budget: (winner.budget - (baseBid / 100)) }, { id: winner.id })

  return updated;
}

exports.stockExchangeHandler = async function(req, res, next) {
  try{
    let {country, category, baseBid} = req.query;
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

    let winner = shortListAndUpdate(baseBid, baseBidFilter);

    return res.send({winner: winner});
  }
  catch(err){
    return res.send({error: err.message})
  }
};

