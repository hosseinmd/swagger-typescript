#!/usr/bin/env node
const { generate } = require("../lib");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;

generate(undefined, {
  tag: argv._,
});
