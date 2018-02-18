const Company = require('../models/company');

async function getAllCompanies(req, res) {
  const companies = await Company.where({}).fetchAll({
    withRelated: [
      'countries',
      'categories'
    ]
  });
  res.send({ data: companies.toJSON({ omitPivot: true }) });
}

module.exports = { getAllCompanies };
