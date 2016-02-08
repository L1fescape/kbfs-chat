'use strict';

var shell = require('shelljs');
var chokidar = require('chokidar');
var fs = require('fs');

function whoami() {
  return shell.exec('keybase status | grep Username | awk \'{print $NF}\'', {
    silent: true
  }).stdout;
}

function watchFile(fileName, callback) {
  var watcher = chokidar.watch(fileName, {
    ignored: /[\/\\]\./, persistent: true
  });

  watcher.on('change', function() {
    callback(lastLines(fileName, 1));
  });
}

function lastLines(fileName, numLines) {
  numLines = numLines || 10;
  var lastLines = shell.exec('tail -n ' + numLines + ' ' + fileName, { silent: true}).stdout;
  return lastLines;
}

function appendFile(fileName, content) {
  fs.appendFile(fileName, content);
}

module.exports = {
  whoami: whoami,
  watchFile: watchFile,
  lastLines: lastLines,
  appendFile: appendFile
};
