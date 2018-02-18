const chai = require('chai');
const expect = chai.expect;
const knex = require('../../db/knex');
const _ = require('lodash');

const exchange = require('../../src/exchange');

describe('Base Targeting', function() {
  beforeEach(async function(){
    var companies = [{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}];

    var company_categories = [{id: 1, company_id: 1, category_id: 1},
    {id: 2, company_id: 1, category_id: 2},
    {id: 3, company_id: 2, category_id: 2},
    {id: 4, company_id: 2, category_id: 3},
    {id: 5, company_id: 3, category_id: 3},
    {id: 6, company_id: 3, category_id: 1}
    ];

    var company_countries = [{id: 1, company_id: 1, country_id: 1},
    {id: 2, company_id: 1, country_id: 2},
    {id: 3, company_id: 2, country_id: 2},
    {id: 4, company_id: 2, country_id: 3},
    {id: 5, company_id: 3, country_id: 2},
    {id: 6, company_id: 3, country_id: 4}
    ];

    await knex('company_categories').del()
    await knex('company_countries').del()
    await knex('companies').del()
    await knex('companies').insert(companies);
    await knex('company_categories').insert(company_categories);
    await knex('company_countries').insert(company_countries);

  });

  it('Filter only companies whose country and category matches - Matching Two companies', async function() {


    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 0, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let country = 'us';
    let category = 'finance';

    let result = await exchange.baseTargetingCheck({country, category}, all);

    expect(result).to.deep.equal([{id: 1, name: 'C1', budget: 1, bid: 10},{id: 2, name: 'C2', budget: 2, bid: 30}]);
  });

  it('Filter only companies whose country and category matches - Matching one company', async function() {
    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 0, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let country = 'ru';
    let category = 'it';

    let result = await exchange.baseTargetingCheck({country, category}, all);

    expect(result).to.deep.equal([{id: 3, name: 'C3', budget: 3, bid: 5}]);
  });

  it('Filter only companies whose country and category matches - Matching no company', async function() {
    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 0, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let country = 'fr';
    let category = 'it';

    let result = await exchange.baseTargetingCheck({country, category}, all);

    expect(result).to.deep.equal([]);
  });
});


describe('Check Budget', function() {
  it('Filter only companies whose budget greater than 0', function() {
    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 0, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let filtered = [{id: 2, name: 'C2', budget: 0, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}];

    let result = exchange.budgetCheck(10, filtered, all);

    expect(result).to.deep.equal([{id: 3, name: 'C3', budget: 3, bid: 5}]);
  });
});


describe('Check BaseBid', function() {
  it('Filter only companies whose bid less than or equal to base bid', function() {

    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let filtered = [{id: 2, name: 'C2', budget: 2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}]

    let result = exchange.baseBidCheck(10, filtered, all);

    expect(result).to.deep.equal([{id: 3, name: 'C3', budget: 3, bid: 5}]);
  });

  it('Filter only companies whose budget is greater than or equal to base bid - Try with equal budget', function() {

    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let filtered = [{id: 2, name: 'C2', budget: 0.3, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}]

    let result = exchange.baseBidCheck(30, filtered, all);

    expect(result).to.deep.equal([{id: 2, name: 'C2', budget: 0.3, bid: 30}, {id: 3, name: 'C3', budget: 3, bid: 5}]);
  });

  it('Filter only companies whose budget is greater than or equal to base bid - Try with lesser budget', function() {

    let all = _.groupBy([{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}], (company)=> (company.id))

    let filtered = [{id: 2, name: 'C2', budget: 0.2, bid: 30},
    {id: 3, name: 'C3', budget: 3, bid: 5}]

    let result = exchange.baseBidCheck(30, filtered, all);

    expect(result).to.deep.equal([{id: 3, name: 'C3', budget: 3, bid: 5}]);
  });
});


describe('ShortList and Update', function() {

  beforeEach(async function(){
    var companies = [{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30}];

    var company_categories = [{id: 1, company_id: 1, category_id: 1},
    {id: 2, company_id: 1, category_id: 2},
    {id: 3, company_id: 2, category_id: 2},
    {id: 4, company_id: 2, category_id: 3}
    ];

    var company_countries = [{id: 1, company_id: 1, country_id: 1},
    {id: 2, company_id: 1, country_id: 2},
    {id: 3, company_id: 2, country_id: 2},
    {id: 4, company_id: 2, country_id: 3}
    ];

    await knex('company_categories').del()
    await knex('company_countries').del()
    await knex('companies').del()
    await knex('companies').insert(companies);
    await knex('company_categories').insert(company_categories);
    await knex('company_countries').insert(company_countries);

  });


  it('Reduce base bid from budget', async function() {
    let inputArr = [{id: 1, name: 'C1', budget: 1, bid: 10},
    {id: 2, name: 'C2', budget: 2, bid: 30}];

    let result = await exchange.shortListAndUpdate(40, inputArr);

    expect(result).to.deep.equal({id: 2, name: 'C2', budget: 1.6, bid: 30});
  });
});


