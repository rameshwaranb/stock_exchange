const Company = require('../models/company');
const _ = require('lodash');
const logger = require('../util/logger');


let companyCountryCategoryJoin = function(qb){
  return qb.join('company_categories', 'company_categories.company_id', 'companies.id')
    .join('categories', 'company_categories.category_id', 'categories.id')
    .join('company_countries', 'company_countries.company_id', 'companies.id')
    .join('countries', 'company_countries.country_id', 'countries.id')
}

let constructLog = function(caller, allCompany, currentFilter){
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

let baseTargetingCheck = async function(query, allCompany){
  let baseTargetingFilter = await Company.query((qb) => {
    companyCountryCategoryJoin(qb).where({'categories.name': query.category, 'countries.code': query.country})
    .select('companies.*').distinct();
  }).get();

  let baseTargeting = baseTargetingFilter.toJSON();
  let baseTargetingGrouped = _.groupBy(baseTargeting, (record) => (record.id));
  constructLog('BaseTargeting', allCompany, baseTargetingGrouped)

  return baseTargeting;
}

let budgetCheck = function(baseBid, baseTargeting, allCompany){
  let budgetFilter = baseTargeting.filter((record) => (record.budget > 0.0));
  let budgetFilterGrouped = _.groupBy(budgetFilter, (record) => (record.id));
  constructLog('BudgetCheck', allCompany, budgetFilterGrouped)

  return budgetFilter;
}

let baseBidCheck = function(baseBid, budgetFilter, allCompany){
  let baseBidFilter = budgetFilter.filter((record) => (baseBid <= record.budget*100 && record.bid <= baseBid));
  let baseBidFilterGrouped = _.groupBy(baseBidFilter, (record) => (record.id));
  constructLog('BaseBid', allCompany, baseBidFilterGrouped)

  return baseBidFilter;
}

let shortListAndUpdate = async function(baseBid, baseBidFilter){
  let winner = _.maxBy(baseBidFilter, 'budget');
  logger.info(`Winner = ${winner.id}`);

  let updated = await Company.update({ budget: (winner.budget - (baseBid / 100)) }, { id: winner.id });

  return updated.toJSON();
}


module.exports = { baseTargetingCheck, budgetCheck, baseBidCheck, shortListAndUpdate };

