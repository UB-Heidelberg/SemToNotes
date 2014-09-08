/*global Packages: true***REMOVED***
***REMOVED***
***REMOVED*** Creates an Esprima-compatible AST using Rhino's JavaScript parser.
***REMOVED*** @module rhino/jsdoc/src/astbuilder
***REMOVED***
'use strict';

var AstBuilder = exports.AstBuilder = function() {
    this._builder = new Packages.org.jsdoc.AstBuilder();
***REMOVED***

AstBuilder.prototype.build = function(sourceCode, sourceName) {
    return this._builder.build(sourceCode, sourceName);
***REMOVED***

AstBuilder.prototype.getRhinoNodes = function() {
    return this._builder.getRhinoNodes();
***REMOVED***
