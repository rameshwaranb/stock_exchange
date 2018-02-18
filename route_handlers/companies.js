var Company = require('../models/company');

let getAllCompanies = async function(req, res, next) {
  let companies = await Company.where({}).fetchAll({withRelated: ['countries', 'categories']})
  res.send({data: companies.toJSON({omitPivot: true})});
};


module.exports = { getAllCompanies };
