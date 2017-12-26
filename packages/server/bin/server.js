#!/usr/bin/env node

const { execSync } = require('child_process');
const knex = require('knex');
const knexfile = require('../knexfile');

const { NODE_ENV } = process.env;
const instance = knex(knexfile[NODE_ENV]);

instance.migrate
  .latest()
  .then(() => instance.seed.run())
  .then(() => {
    execSync('node ./lib/index.js');
  });
