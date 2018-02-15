var bookshelf = require('../db/bookshelf');
var Company = require('./company');
var Category = require('./category');


var CompanyCategory = bookshelf.Model.extend({
  tableName: 'company_categories',
  company: function() {
    return this.belongsTo(Company);
  },
  category: function() {
    return this.belongsTo(Category);
  }
});

module.exports = CompanyCategory;
