var knex = require('./knex');
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin(require('bookshelf-eloquent'));

module.exports = bookshelf;
