/*global env: true***REMOVED***
***REMOVED***
***REMOVED*** @overview Dump information about parser events to the console.
***REMOVED*** @module plugins/eventDumper
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED***
'use strict';

var _ = require('underscore');
var util = require('util');

var conf = env.conf.eventDumper || {***REMOVED***
var isRhino = require('jsdoc/util/runtime').isRhino();

// Dump the included parser events (defaults to all events)
var events = conf.include || [
    'parseBegin',
    'fileBegin',
    'beforeParse',
    'jsdocCommentFound',
    'symbolFound',
    'newDoclet',
    'fileComplete',
    'parseComplete',
    'processingComplete'
];
// Don't dump the excluded parser events
if (conf.exclude) {
    events = _.difference(events, conf.exclude);
}

***REMOVED***
***REMOVED*** Check whether a variable appears to be a Java native object.
***REMOVED***
***REMOVED*** @param {*} o - The variable to check.
***REMOVED*** @return {boolean} Set to `true` for Java native objects and `false` in all other cases.
***REMOVED***
function isJavaNativeObject(o) {
    if (!isRhino) {
        return false;
    }

    return o && typeof o === 'object' && typeof o.getClass === 'function';
}

***REMOVED***
***REMOVED*** Replace AST node objects in events with a placeholder.
***REMOVED***
***REMOVED*** @param {Object} o - An object whose properties may contain AST node objects.
***REMOVED*** @return {Object} The modified object.
***REMOVED***
function replaceNodeObjects(o) {
    var doop = require('jsdoc/util/doop');

    var OBJECT_PLACEHOLDER = '<Object>';

    if (o.code && o.code.node) {
        // don't break the original object!
        o.code = doop(o.code);
        o.code.node = OBJECT_PLACEHOLDER;
    }

    if (o.doclet && o.doclet.meta && o.doclet.meta.code && o.doclet.meta.code.node) {
        // don't break the original object!
        o.doclet.meta.code = doop(o.doclet.meta.code);
        o.doclet.meta.code.node = OBJECT_PLACEHOLDER;
    }

    if (o.astnode) {
        o.astnode = OBJECT_PLACEHOLDER;
    }

    return o;
}

***REMOVED***
***REMOVED*** Get rid of unwanted crud in an event object.
***REMOVED***
***REMOVED*** @param {object} e The event object.
***REMOVED*** @return {object} The fixed-up object.
***REMOVED***
function cleanse(e) {
    var result = {***REMOVED***

    Object.keys(e).forEach(function(prop) {
        // by default, don't stringify properties that contain an array of functions
        if (!conf.includeFunctions && util.isArray(e[prop]) && e[prop][0] &&
            String(typeof e[prop][0]) === 'function') {
            result[prop] = 'function[' + e[prop].length + ']';
        }
        // never include functions that belong to the object
        else if (typeof e[prop] !== 'function') {
            // don't call JSON.stringify() on Java native objects--Rhino will throw an exception
            result[prop] = isJavaNativeObject(e[prop]) ? String(e[prop]) : e[prop];
        }
    });

    // allow users to omit node objects, which can be enormous
    if (conf.omitNodes) {
        result = replaceNodeObjects(result);
    }

    return result;
}

exports.handlers = {***REMOVED***

events.forEach(function(eventType) {
    exports.handlers[eventType] = function(e) {
        console.log( JSON.stringify({
            type: eventType,
            content: cleanse(e)
        }, null, 4) );
   ***REMOVED*****REMOVED***
});
