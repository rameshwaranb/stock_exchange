const Company = require('../models/company');
const _ = require('lodash');
const { baseTargetingCheck, budgetCheck, baseBidCheck, shortListAndUpdate } = require('../src/exchange');

async function stockExchangeHandler(req, res) {
  try {
    const { country, category, baseBid } = req.query;
    if (!country || !category || !baseBid) {
      return res.send({ error: 'Missing user input!! Country, Category and Basebid are required fields' });
    }

    const allCompanies = await Company.get();
    const groupedCompanies = _.groupBy(allCompanies.toJSON(), (company) => company.id);

    const baseTargeting = await baseTargetingCheck({ country, category }, groupedCompanies);
    if (!baseTargeting.length) {
      return res.send({ message: 'No Companies Passed from Targeting' });
    }

    const budgetFilter = budgetCheck(baseBid, baseTargeting, groupedCompanies);
    if (!budgetFilter.length) {
      return res.send({ message: 'No Companies Passed from Budget' });
    }

    const baseBidFilter = baseBidCheck(baseBid, budgetFilter, groupedCompanies);
    if (!baseBidFilter.length) {
      return res.send({ message: 'No Companies Passed from BaseBid check' });
    }

    const winner = await shortListAndUpdate(baseBid, baseBidFilter);

    return res.send({ winner });
  } catch (err) {
    return res.send({ error: err.message });
  }
}

module.exports = { stockExchangeHandler };
