var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var Country = require('./country');


var CompanyCountry = bookshelf.Model.extend({
  tableName: 'company_countries',
  company() {
    return this.belongsTo(Company);
  },
  country() {
    return this.belongsTo(Country);
  }
});

module.exports = CompanyCountry;
