// TODO: module docs
'use strict';

// TODO: docs
exports.createParser = require('jsdoc/src/parser').createParser;

// TODO: docs
var Parser = exports.Parser = function() {
    var astBuilder;
    var visitor;

    var runtime = require('jsdoc/util/runtime');
    if ( !runtime.isRhino() ) {
        throw new Error('You must run JSDoc on Mozilla Rhino to use the Rhino parser.');
    }

    astBuilder = new ( require(runtime.getModulePath('jsdoc/src/astbuilder')) ).AstBuilder();
    visitor = new ( require(runtime.getModulePath('jsdoc/src/visitor')) ).Visitor(this);

    Parser.super_.call(this, astBuilder, visitor);
***REMOVED***
require('util').inherits(Parser, require('jsdoc/src/parser').Parser);

// TODO: update docs
***REMOVED***
***REMOVED*** Adds a node visitor to use in parsing
***REMOVED***
Parser.prototype.addNodeVisitor = function(visitor) {
    this._visitor.addRhinoNodeVisitor(visitor);
***REMOVED***

// TODO: docs
***REMOVED***
***REMOVED*** Get the node visitors used in parsing
***REMOVED***
Parser.prototype.getNodeVisitors = function() {
    return this._visitor.getRhinoNodeVisitors();
***REMOVED***
