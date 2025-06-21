#!/usr/bin/env node
const args = process.argv.slice(2);

const isSkip = args[0] ? args[0] === '--skip' || args[0] === '-s' : false;
console.log(isSkip, args);
require('../dist/index.js').default(isSkip);