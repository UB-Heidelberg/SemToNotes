/*global env: true***REMOVED***
***REMOVED***
***REMOVED*** @overview Translate doclet descriptions from MarkDown into HTML.
***REMOVED*** @module plugins/markdown
***REMOVED*** @author Michael Mathews <micmath@gmail.com>
***REMOVED*** @author Ben Blank <ben.blank@gmail.com>
***REMOVED***
'use strict';

var conf = env.conf.markdown;
var defaultTags = [ 'classdesc', 'description', 'params', 'properties', 'returns', 'see'];
var hasOwnProp = Object.prototype.hasOwnProperty;
var parse = require('jsdoc/util/markdown').getParser();
var tags = [];
var excludeTags = [];

function shouldProcessString(tagName, text) {
    var shouldProcess = false;

    if (tagName !== 'see') {
        shouldProcess = true;
    }
    // we only want to process `@see` tags that contain Markdown links
    else if (tagName === 'see' && text.indexOf('[') !== -1) {
        shouldProcess = true;
    }

    return shouldProcess;
}

***REMOVED***
***REMOVED*** Process the markdown source in a doclet. The properties that should be
***REMOVED*** processed are configurable, but always include "classdesc", "description",
***REMOVED*** "params", "properties", and "returns".  Handled properties can be bare
***REMOVED*** strings, objects, or arrays of objects.
***REMOVED***
function process(doclet) {
    tags.forEach(function(tag) {
        if ( !hasOwnProp.call(doclet, tag) ) {
            return;
        }

        if (typeof doclet[tag] === 'string' && shouldProcessString(tag, doclet[tag]) ) {
            doclet[tag] = parse(doclet[tag]);
        }
        else if ( Array.isArray(doclet[tag]) ) {
            doclet[tag].forEach(function(value, index, original) {
                var inner = {***REMOVED***
                inner[tag] = value;
                process(inner);
                original[index] = inner[tag];
            });
        }
        else if (doclet[tag]) {
            process(doclet[tag]);
        }
    });
}

// set up the list of "tags" (properties) to process
if (conf && conf.tags) {
    tags = conf.tags.slice();
}
// set up the list of default tags to exclude from processing
if (conf && conf.excludeTags) {
    excludeTags = conf.excludeTags.slice();
}
defaultTags.forEach(function(tag) {
    if (excludeTags.indexOf(tag) === -1 && tags.indexOf(tag) === -1) {
        tags.push(tag);
    }
});

exports.handlers = {
   ***REMOVED*****REMOVED***
    ***REMOVED*** Translate markdown syntax in a new doclet's description into HTML. Is run
    ***REMOVED*** by JSDoc 3 whenever a "newDoclet" event fires.
   ***REMOVED*****REMOVED***
    newDoclet: function(e) {
        process(e.doclet);
    }
***REMOVED***
