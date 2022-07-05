#!/usr/bin/env node
const { generate } = require("../lib");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).option("local").option("branch").argv;

generate(undefined, {
  tag: argv._,
  local: argv.local,
  branch: argv.branch,
});
