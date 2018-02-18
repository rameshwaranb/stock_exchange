const bookshelf = require('../db/bookshelf');
const CompanyCountry = require('./company_country');
const Company = require('./company');
const Country = bookshelf.Model.extend({
  tableName: 'countries',
  companies() {
    return this.belongsToMany(Company).through(CompanyCountry);
  }
});

module.exports = Country;
