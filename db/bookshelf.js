var knex = require('./knex');
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin(require('bookshelf-eloquent'));
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

module.exports = bookshelf;
