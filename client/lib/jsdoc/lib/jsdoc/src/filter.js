/*global env: true***REMOVED***
***REMOVED***
    @module jsdoc/src/filter

    @author Michael Mathews <micmath@gmail.com>
    @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

var path = require('jsdoc/path');

var pwd = env.pwd;

function makeRegExp(config) {
    var regExp = null;

    if (config) {
        regExp = (typeof config === 'string') ? new RegExp(config) : config;
    }

    return regExp;
}

***REMOVED***
    @constructor
    @param {object} opts
    @param {string[]} opts.exclude - Specific files to exclude.
    @param {string|RegExp} opts.includePattern
    @param {string|RegExp} opts.excludePattern
***REMOVED***
exports.Filter = function(opts) {
    this.exclude = opts.exclude && Array.isArray(opts.exclude) ?
        opts.exclude.map(function($) {
            return path.resolve(pwd, $);
        }) :
        null;
    this.includePattern = makeRegExp(opts.includePattern);
    this.excludePattern = makeRegExp(opts.excludePattern);
***REMOVED***

***REMOVED***
    @param {string} filepath - The filepath to check.
    @returns {boolean} Should the given file be included?
***REMOVED***
exports.Filter.prototype.isIncluded = function(filepath) {
    var included = true;

    filepath = path.resolve(pwd, filepath);

    if ( this.includePattern && !this.includePattern.test(filepath) ) {
        included = false;
    }

    if ( this.excludePattern && this.excludePattern.test(filepath) ) {
        included = false;
    }

    if (this.exclude) {
        this.exclude.forEach(function(exclude) {
            if ( filepath.indexOf(exclude) === 0 ) {
                included = false;
            }
        });
    }

    return included;
***REMOVED***
