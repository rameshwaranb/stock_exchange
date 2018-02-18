const bookshelf = require('../db/bookshelf');
const CompanyCountry = require('./company_country');
const Category = require('./category');
const Country = require('./country');
const CompanyCategory = require('./company_category');

const Company = bookshelf.Model.extend({
  tableName: 'companies',
  countries() {
    return this.belongsToMany(Country).through(CompanyCountry);
  },
  categories() {
    return this.belongsToMany(Category).through(CompanyCategory);
  },
  hasTimestamps: false
});

module.exports = Company;
