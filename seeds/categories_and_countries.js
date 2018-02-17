
var countries = [{id: 1, name: 'France', code: 'FR'},
{id: 2, name: 'United States', code: 'US'},
{id: 3, name: 'India', code: 'IN'},
{id: 4, name: 'Russia', code: 'RU'}];

var categories = [{id: 1, name: 'Automobile'},
{id: 2, name: 'Finance'},
{id: 3, name: 'IT'}];

exports.seed = async function(knex, Promise) {
  await knex('company_categories').del()
  await knex('company_countries').del()
  await knex('countries').del()
  await knex('categories').del()
  await knex('countries').insert(countries);
  await knex('categories').insert(categories);
};
