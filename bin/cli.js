#!/usr/bin/env node

const commander = require('commander');
const getStdin = require('get-stdin');
const { readFileSync } = require('fs');
const StlParser = require('../dist/index').default;

const { version } = require('../package.json');

commander
  .version(version)
  .usage('[options] <file ...>')
  //.option('--some-option', 'This is an example of an option')
  .parse(process.argv);

const { args: files } = commander;

const processText = text => {
  const parser = new StlParser(text);
  process.stdout.write(parser.toString());
};

getStdin().then(stdin => {
  if (!files.length && !stdin) {
    commander.outputHelp();
    process.exit(0);
  }

  if (stdin) {
    processText(stdin);
  } else {
    files.forEach(file => {
      processText(readFileSync(file, 'utf8'));
    });
  }
});
