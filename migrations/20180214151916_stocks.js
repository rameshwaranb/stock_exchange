
exports.up = function(knex, Promise) {


   return Promise.all([

        knex.schema.createTable('categories', function(table) {
            table.increments('id').unsigned().primary();
            table.string('name');
        }),

        knex.schema.createTable('countries', function(table) {
            table.increments('id').unsigned().primary();
            table.string('name');
            table.string('code');
        }),

        knex.schema.createTable('companies', function(table){
            table.increments('id').unsigned().primary();
            table.string('name');
            table.decimal('budget', 10, 2).unsigned();
            table.integer('bid').unsigned();
        }),

        knex.schema.createTable('company_countries', function(table) {
            table.increments('id').unsigned().primary();
            table.integer('company_id').unsigned()
                 .references('id')
                 .inTable('companies');
            table.integer('country_id').unsigned()
                 .references('id')
                 .inTable('countries');
        }),

        knex.schema.createTable('company_categories', function(table) {
            table.increments('id').unsigned().primary();
            table.integer('company_id').unsigned()
                 .references('id')
                 .inTable('companies');
            table.integer('category_id').unsigned()
                 .references('id')
                 .inTable('categories');
        })
      ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('company_categories'),
        knex.schema.dropTable('company_countries'),
        knex.schema.dropTable('categories'),
        knex.schema.dropTable('countries'),
        knex.schema.dropTable('companies')
    ])
};
