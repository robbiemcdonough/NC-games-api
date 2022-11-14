exports.categoryData = require('./categories.js');
exports.commentData = require('./comments.js');
exports.reviewData = require('./reviews.js');
exports.userData = require('./users.js');

const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'test';

const pathToEnvFile = `${__dirname}/.env.${ENV}`;

console.log(pathToEnvFile); 

require('dotenv').config({
  path: pathToEnvFile,
});

module.exports = new Pool();
