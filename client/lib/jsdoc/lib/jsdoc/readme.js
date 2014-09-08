/*global env: true***REMOVED***

***REMOVED***
***REMOVED*** Make the contents of a README file available to include in the output.
***REMOVED*** @module jsdoc/readme
***REMOVED*** @author Michael Mathews <micmath@gmail.com>
***REMOVED*** @author Ben Blank <ben.blank@gmail.com>
***REMOVED***
'use strict';

var fs = require('jsdoc/fs'),
    markdown = require('jsdoc/util/markdown');

***REMOVED***
***REMOVED*** @class
***REMOVED*** @classdesc Represents a README file.
***REMOVED*** @param {string} path - The filepath to the README.
***REMOVED***
function ReadMe(path) {
    var content = fs.readFileSync(path, env.opts.encoding),
        parse = markdown.getParser();

    this.html = parse(content);
}

module.exports = ReadMe;
