var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var CompanyCountry = require('./company_country');
var Category = require('./category');
var Country = require('./country');
var CompanyCategory = require('./company_category');

var Company = bookshelf.Model.extend({
  tableName: 'companies',
  countries: function() {
    return this.belongsToMany(Country).through(CompanyCountry);
  },
  categories: function() {
    return this.belongsToMany(Category).through(CompanyCategory);
  }
});

module.exports = Company;
