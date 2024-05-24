#!/usr/bin/env node
import { generate } from "../lib/index.mjs";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("local")
  .option("branch")
  .option("config", {
    string: true,
  }).argv;

generate(undefined, {
  tag: argv._,
  local: argv.local,
  branch: argv.branch,
  config: argv.config,
});
