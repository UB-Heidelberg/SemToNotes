/*global Set***REMOVED***
***REMOVED***
***REMOVED*** Recursively print out all names and values in a data structure.
***REMOVED*** @module jsdoc/util/dumper
***REMOVED*** @author Michael Mathews <micmath@gmail.com>
***REMOVED*** @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

var util = require('util');
var setDefined = typeof Set !== 'undefined';

function ObjectWalker() {
    if (setDefined) {
        this.seenItems = new Set();
    } else {
        this.seenItems = [];
    }
}

ObjectWalker.prototype.seen = function(object) {
    var result;
    if (setDefined) {
        result =  this.seenItems.has(object);
    } else {
        result = object.hasBeenSeenByWalkerDumper;
    }
    return result;
***REMOVED***

ObjectWalker.prototype.markAsSeen = function(object) {
    if (setDefined) {
        this.seenItems.add(object);
    } else {
        object.hasBeenSeenByWalkerDumper = true;
        this.seenItems.push(object);
    }
***REMOVED***

ObjectWalker.prototype.cleanSeenFlag = function() {
    if (setDefined) {
        this.seenItems = new Set();
    } else {
        this.seenItems.forEach(function(object) {
            delete object.hasBeenSeenByWalkerDumper;
        });
    }
***REMOVED***

// some objects are unwalkable, like Java native objects
ObjectWalker.prototype.isUnwalkable = function(o) {
    return (o && typeof o === 'object' && typeof o.constructor === 'undefined');
***REMOVED***

ObjectWalker.prototype.isFunction = function(o) {
    return (o && typeof o === 'function' || o instanceof Function);
***REMOVED***

ObjectWalker.prototype.isObject = function(o) {
    return o && o instanceof Object ||
        (o && typeof o.constructor !== 'undefined' && o.constructor.name === 'Object');
***REMOVED***

ObjectWalker.prototype.checkCircularRefs = function(o, func) {
    if ( this.seen(o) ) {
        return '<CircularRef>';
    }
    else {
        this.markAsSeen(o);
        return func(o);
    }
***REMOVED***

ObjectWalker.prototype.walk = function(o) {
    var result;

  ***REMOVED***

    if ( this.isUnwalkable(o) ) {
        result = '<Object>';
    }
    else if ( o === undefined ) {
        result = null;
    }
    else if ( Array.isArray(o) ) {
        result = this.checkCircularRefs(o, function(arr) {
            var newArray = [];
            arr.forEach(function(item) {
                newArray.push( self.walk(item) );
            });

            return newArray;
        });
    }
    else if ( util.isRegExp(o) ) {
        result = '<RegExp ' + o + '>';
    }
    else if ( util.isDate(o) ) {
        result = '<Date ' + o.toUTCString() + '>';
    }
    else if ( util.isError(o) ) {
        result = { message: o.message***REMOVED*****REMOVED***
    }
    else if ( this.isFunction(o) ) {
        result = '<Function' + (o.name ? ' ' + o.name : '') + '>';
    }
    else if ( this.isObject(o) && o !== null ) {
        result = this.checkCircularRefs(o, function(obj) {
            var newObj = {***REMOVED***
            Object.keys(obj).forEach(function(key) {
                if (!setDefined && key === 'hasBeenSeenByWalkerDumper') { return; }
                newObj[key] = self.walk(obj[key]);
            });

            return newObj;
        });
    }
    // should be safe to JSON.stringify() everything else
    else {
        result = o;
    }

    return result;
***REMOVED***

***REMOVED***
***REMOVED*** @param {*} object
***REMOVED***
exports.dump = function(object) {
    var walker = new ObjectWalker();
    var result = JSON.stringify(walker.walk(object), null, 4);
    walker.cleanSeenFlag();

    return result;
***REMOVED***
