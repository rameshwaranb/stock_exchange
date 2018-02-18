var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var Category = require('./category');


var CompanyCategory = bookshelf.Model.extend({
  tableName: 'company_categories',
  company() {
    return this.belongsTo(Company);
  },
  category() {
    return this.belongsTo(Category);
  }
});

module.exports = CompanyCategory;
