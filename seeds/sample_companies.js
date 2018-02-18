
var companies = [
  { id: 1, name: 'C1', budget: 1, bid: 10 },
  { id: 2, name: 'C2', budget: 2, bid: 30 },
  { id: 3, name: 'C3', budget: 3, bid: 5 }
];

var company_categories = [
  { id: 1, company_id: 1, category_id: 1 },
  { id: 2, company_id: 1, category_id: 2 },
  { id: 3, company_id: 2, category_id: 2 },
  { id: 4, company_id: 2, category_id: 3 },
  { id: 5, company_id: 3, category_id: 3 },
  { id: 6, company_id: 3, category_id: 1 }
];

var company_countries = [
  { id: 1, company_id: 1, country_id: 1 },
  { id: 2, company_id: 1, country_id: 2 },
  { id: 3, company_id: 2, country_id: 2 },
  { id: 4, company_id: 2, country_id: 3 },
  { id: 5, company_id: 3, country_id: 2 },
  { id: 6, company_id: 3, country_id: 4 }
];

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('company_categories').del();
  await knex('company_countries').del();
  await knex('companies').del();
  await knex('companies').insert(companies);
  await knex('company_categories').insert(company_categories);
  await knex('company_countries').insert(company_countries);
};
