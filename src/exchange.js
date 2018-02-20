const Company = require('../models/company');
const _ = require('lodash');
const logger = require('../util/logger');

function companyCountryCategoryJoin(qb) {
  return qb.join('company_categories', 'company_categories.company_id', 'companies.id').
    join('categories', 'company_categories.category_id', 'categories.id').
    join('company_countries', 'company_countries.company_id', 'companies.id').
    join('countries', 'company_countries.country_id', 'countries.id');
}

//Common logger for Targeting, Budget, BasiBid Checks
function constructLog(caller, companies, currentFilter) {
  const combinedLog = _.map(_.sortBy(_.keys(companies)), (key) => {
    if (currentFilter[key]) {
      return `{${companies[key][0].name}, Passed}`;
    }

    return `{${companies[key][0].name}, Failed}`;
  });

  logger.info(`${caller}: ${combinedLog.join(',')}`);
}

// Returns companies that match given country and category
async function baseTargetingCheck(query, companies) {
  const baseTargetingFilter = await Company.query((qb) => {
    companyCountryCategoryJoin(qb).where({ 'categories.name': query.category, 'countries.code': query.country }).
    select('companies.*').
    distinct();
  }).get();

  const baseTargeting = baseTargetingFilter.toJSON();
  const baseTargetingGrouped = _.groupBy(baseTargeting, (record) => record.id);
  constructLog('BaseTargeting', companies, baseTargetingGrouped);

  return baseTargeting;
}

// Returns companies that have budget greater than zero
function budgetCheck(baseBid, baseTargeting, companies) {
  const budgetFilter = baseTargeting.filter((record) => record.budget > 0.0);
  const budgetFilterGrouped = _.groupBy(budgetFilter, (record) => record.id);
  constructLog('BudgetCheck', companies, budgetFilterGrouped);

  return budgetFilter;
}

// Returns companies whose bids are less than base bid and the remaining budget is greater than base bid
function baseBidCheck(baseBid, budgetFilter, companies) {
  const baseBidFilter = budgetFilter.filter((record) => baseBid <= record.budget * 100 && record.bid <= baseBid);
  const baseBidFilterGrouped = _.groupBy(baseBidFilter, (record) => record.id);
  constructLog('BaseBid', companies, baseBidFilterGrouped);

  return baseBidFilter;
}

//Chooses the company with higher budget as winner and updates the budget of the winner
async function shortListAndUpdate(baseBid, baseBidFilter) {
  const winner = _.maxBy(baseBidFilter, 'budget');
  logger.info(`Winner = ${winner.id}`);
  const updatedBudget = winner.budget - baseBid / 100;
  const updated = await Company.update({ budget: updatedBudget }, { id: winner.id });

  return updated.toJSON();
}

module.exports = { baseTargetingCheck, budgetCheck, baseBidCheck, shortListAndUpdate };
