var bookshelf = require('../db/bookshelf');
var Country = bookshelf.Model.extend({
  tableName: 'countries',
  companies: function() {
    return this.belongsToMany(Company).through(CompanyCountry);
  }
});

module.exports = Country;
