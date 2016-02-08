'use strict';

var blessed = require('blessed');
var _ = require('lodash');

var util = require('./util');

module.exports = function(currentUser, kbfsFile) { // Create a screen object.
  this.screen = blessed.screen({
    smartCSR: true
  });

  this.screen.title = 'kbfs chat - ' + kbfsFile;

  // Create a box perfectly centered horizontally and vertically.
  var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
  });

  // Append our box to the screen.
  this.screen.append(box);

  // Quit on Escape, q, or Control-C.
  this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Focus our element.
  box.focus();

  // setup listener on kbfsfile
  var watcher = util.watchFile(kbfsFile, _.bind(function(line) {
    var content = box.getContent();
    content += line;
    box.setContent(content);
    this.screen.render();
  }, this));


  // grab the last few lines of the file and show them in the client
  var lastLines = util.lastLines(kbfsFile);
  box.setContent(lastLines);

  // create an input for entering text
  var form = blessed.form({
    parent: this.screen,
    left: 0,
    bottom: 0,
    width: '100%',
    height: 1,
  });

  var input = blessed.textarea({
      parent: form,
      inputOnFocus: true,
      name: 'input',
      input: true,
      keys: true,
      top: 0,
      left: 0,
      height: 1,
      width: '100%',
      style: {
          fg: 'blue',
          bg: 'black',
          focus: {
              bg: 'black',
              fg: 'white'
          }
      }
  });

  input.focus();

  // on enter, submit the entered text
  input.key('enter', _.bind(function() {
    var value = input.getValue();
    if (!value) {
      return;
    }

    input.clearValue();
    value = currentUser + ': ' + value;
    value = value.replace(/(\r\n|\n|\r)/gm, '');
    value += '\n';
    util.appendFile(kbfsFile, value);
  }, this));

  this.screen.render();
}
