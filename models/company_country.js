var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var Country = require('./country');


var CompanyCountry = bookshelf.Model.extend({
  tableName: 'company_countries',
  company: function() {
    return this.belongsTo(Company);
  },
  country: function() {
    return this.belongsTo(Country);
  }
});

module.exports = CompanyCountry;
