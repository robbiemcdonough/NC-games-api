# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Create Environment Variables 
In order to connect to the right database, we need to set up our environment variables.  In the /db file we can require dotenv into the file and invoke its config method. This sets all of the environment variables from the .env file to the process.env.

require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool();

Note that if, for some reason, the PGDATABASE environment variable was not set correctly, node-postgres would connect to your default database rather than throwing an error. 
