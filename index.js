'use strict';

var _ = require('lodash');

var client = require('./client');
var util = require('./util');

var kbfsFile = process.argv[2];

if (!kbfsFile) {
  console.log('Please provide a file to watch');
  return process.exit(0);
} else if (!_.includes(kbfsFile, 'keybase')) {
  console.log('Trying to watch non-kbfs file');
  return process.exit(0);
}

var currentUser = util.whoami();
var chatClient = new client(currentUser, kbfsFile);

