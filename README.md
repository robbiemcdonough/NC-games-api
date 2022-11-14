# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Setup Dev Environment 
Once you have cloned down the project, be sure to run npm install to instal all the relevant packages. Most of what you need is there already, but you will additionally need to install express and supertest.

We'll have two databases in this project. One for real looking dev data and another for simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. 
Into .env.test add PGDATABASE=NC_games.test. 
Into .env.development add PGDATABASE=NC_games. Double check that these .env files are .gitignored.
