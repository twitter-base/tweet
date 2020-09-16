#!/usr/bin/env node
const chunk = require('..');
var chunks = chunk(process.argv[2], Number.parseInt(process.argv[3], 10), process.argv[4]); // Limit the chunk size to a length of 600.
var records = [];
chunks.forEach(function(content) {
  records.push(content);
});
console.log(records);
