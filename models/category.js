var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var CompanyCategory = require('./company_category');


var Category = bookshelf.Model.extend({
  tableName: 'categories',
  companies() {
    return this.belongsToMany(Company).through(CompanyCategory);
  }
});

module.exports = Category;
