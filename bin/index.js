#!/usr/bin/env node
const { generate } = require("../lib");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).command(
  "swag-ts [tag]",
  true,
  (yarg) => {
    return yarg.positional("tag", {
      describe: "Just a tag will be updated",
      default: "",
    });
  },
  (argv) => {
    generate(undefined, {
      tag: argv._?.[0],
    });
  },
).argv;

if (argv.internal) {
  generate(undefined, {
    tag: argv._?.[0],
  });
}
console.log(argv);

//   .option("tag", {
//     type: "string",
//     description: "Update a Tag endpoints and related types",
//   })
