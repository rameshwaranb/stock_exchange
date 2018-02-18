### Stock Exchange


Clone the repository  
Use node 8.0  
From the root folder do
`npm install`

Create MySQL Database

Create `.env` file and assign values to all variables in `.env.template` file  

Migration  
`NODE_ENV=development node -r dotenv/config ./node_modules/knex/bin/cli.js migrate:latest`

Seeding  
`NODE_ENV=development node -r dotenv/config ./node_modules/knex/bin/cli.js seed:run`

To run the application  
`npm start`

To run test cases  
`npm test`