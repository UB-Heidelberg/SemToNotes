/*global env, Packages***REMOVED***
/*eslint no-script-url:0***REMOVED***
***REMOVED***
***REMOVED*** @module jsdoc/src/parser
***REMOVED***
'use strict';

var jsdoc = {
    doclet: require('jsdoc/doclet'),
    name: require('jsdoc/name'),
    src: {
        astnode: require('jsdoc/src/astnode'),
        syntax: require('jsdoc/src/syntax')
    }
***REMOVED***
var logger = require('jsdoc/util/logger');
var util = require('util');

var hasOwnProp = Object.prototype.hasOwnProperty;
var Syntax = jsdoc.src.syntax.Syntax;

// Prefix for JavaScript strings that were provided in lieu of a filename.
var SCHEMA = 'javascript:';
// TODO: docs
var PARSERS = exports.PARSERS = {
    esprima: 'jsdoc/src/parser',
    rhino: 'rhino/jsdoc/src/parser'
***REMOVED***

// TODO: docs
// TODO: not currently used
function makeGlobalDoclet(globalScope) {
    var doclet = new jsdoc.doclet.Doclet('***REMOVED*** Auto-generated doclet for global scope***REMOVED***', {});

    if (globalScope) {
        // TODO: handle global aliases
        Object.keys(globalScope.ownedVariables).forEach(function(variable) {
            doclet.meta.vars = doclet.meta.vars || {***REMOVED***
            doclet.meta.vars[variable] = null;
        });
    }

    return doclet;
}

// TODO: docs
exports.createParser = function(type) {
    var path = require('jsdoc/path');
    var runtime = require('jsdoc/util/runtime');

    var modulePath;

    if (!type) {
        type = runtime.isRhino() ? 'rhino' : 'esprima';
    }

    if (PARSERS[type]) {
        modulePath = PARSERS[type];
    }
    else {
        modulePath = path.join( path.getResourcePath(path.dirname(type)), path.basename(type) );
    }

    try {
        return new ( require(modulePath) ).Parser();
    }
    catch (e) {
        logger.fatal('Unable to create the parser type "' + type + '": ' + e);
    }
***REMOVED***

// TODO: docs
***REMOVED***
***REMOVED*** @class
***REMOVED*** @mixes module:events.EventEmitter
***REMOVED***
***REMOVED*** @example <caption>Create a new parser.</caption>
***REMOVED*** var jsdocParser = new (require('jsdoc/src/parser').Parser)();
***REMOVED***
var Parser = exports.Parser = function(builderInstance, visitorInstance, walkerInstance) {
    this.clear();

    this._astBuilder = builderInstance || new (require('jsdoc/src/astbuilder')).AstBuilder();
    this._visitor = visitorInstance || new (require('jsdoc/src/visitor')).Visitor(this);
    this._walker = walkerInstance || new (require('jsdoc/src/walker')).Walker();

    Object.defineProperties(this, {
        astBuilder: {
            get: function() {
                return this._astBuilder;
            }
        },
        visitor: {
            get: function() {
                return this._visitor;
            }
        },
        walker: {
            get: function() {
                return this._walker;
            }
        }
    });
***REMOVED***
util.inherits(Parser, require('events').EventEmitter);

// TODO: docs
Parser.prototype.clear = function() {
    this._resultBuffer = [];
    this.refs = {***REMOVED***
    this.refs[jsdoc.src.astnode.GLOBAL_NODE_ID] = {***REMOVED***
    this.refs[jsdoc.src.astnode.GLOBAL_NODE_ID].meta = {***REMOVED***
***REMOVED***

// TODO: update docs
***REMOVED***
***REMOVED*** Parse the given source files for JSDoc comments.
***REMOVED*** @param {Array.<string>} sourceFiles An array of filepaths to the JavaScript sources.
***REMOVED*** @param {string} [encoding=utf8]
***REMOVED***
***REMOVED*** @fires module:jsdoc/src/parser.Parser.parseBegin
***REMOVED*** @fires module:jsdoc/src/parser.Parser.fileBegin
***REMOVED*** @fires module:jsdoc/src/parser.Parser.jsdocCommentFound
***REMOVED*** @fires module:jsdoc/src/parser.Parser.symbolFound
***REMOVED*** @fires module:jsdoc/src/parser.Parser.newDoclet
***REMOVED*** @fires module:jsdoc/src/parser.Parser.fileComplete
***REMOVED*** @fires module:jsdoc/src/parser.Parser.parseComplete
***REMOVED***
***REMOVED*** @example <caption>Parse two source files.</caption>
***REMOVED*** var myFiles = ['file1.js', 'file2.js'];
***REMOVED*** var docs = jsdocParser.parse(myFiles);
***REMOVED***
Parser.prototype.parse = function(sourceFiles, encoding) {
    encoding = encoding || env.conf.encoding || 'utf8';

    var filename = '';
    var sourceCode = '';
    var parsedFiles = [];
    var e = {***REMOVED***

    if (typeof sourceFiles === 'string') {
        sourceFiles = [sourceFiles];
    }

    e.sourcefiles = sourceFiles;
    logger.debug('Parsing source files: %j', sourceFiles);

    this.emit('parseBegin', e);

    for (var i = 0, l = sourceFiles.length; i < l; i++) {
        sourceCode = '';

        if (sourceFiles[i].indexOf(SCHEMA) === 0) {
            sourceCode = sourceFiles[i].substr(SCHEMA.length);
            filename = '[[string' + i + ']]';
        }
        else {
            filename = sourceFiles[i];
            try {
                sourceCode = require('jsdoc/fs').readFileSync(filename, encoding);
            }
            catch(e) {
                logger.error('Unable to read and parse the source file %s: %s', filename, e);
            }
        }

        if (sourceCode.length) {
            this._parseSourceCode(sourceCode, filename);
            parsedFiles.push(filename);
        }
    }

    this.emit('parseComplete', {
        sourcefiles: parsedFiles,
        doclets: this._resultBuffer
    });
    logger.debug('Finished parsing source files.');

    return this._resultBuffer;
***REMOVED***

// TODO: docs
Parser.prototype.fireProcessingComplete = function(doclets) {
    this.emit('processingComplete', { doclets: doclets });
***REMOVED***

// TODO: docs
Parser.prototype.results = function() {
    return this._resultBuffer;
***REMOVED***

// TODO: update docs
***REMOVED***
***REMOVED*** @param {Object} o The parse result to add to the result buffer.
***REMOVED***
Parser.prototype.addResult = function(o) {
    this._resultBuffer.push(o);
***REMOVED***

// TODO: docs
Parser.prototype.addAstNodeVisitor = function(visitor) {
    this._visitor.addAstNodeVisitor(visitor);
***REMOVED***

// TODO: docs
Parser.prototype.getAstNodeVisitors = function() {
    return this._visitor.getAstNodeVisitors();
***REMOVED***

// TODO: docs
function pretreat(code) {
    return code
        // comment out hashbang at the top of the file, like: #!/usr/bin/env node
        .replace(/^(\#\![\S \t]+\r?\n)/, '// $1')

        // to support code minifiers that preserve /*! comments, treat /*!* as equivalent to***REMOVED*****REMOVED***
        .replace(/\/\*\!\*/g, '***REMOVED***')
        // merge adjacent doclets
        .replace(/\*\/\/\*\*+/g, '@also');
}

***REMOVED*** @private***REMOVED***
Parser.prototype._parseSourceCode = function(sourceCode, sourceName) {
    var ast;
    var globalScope;

    var e = {
        filename: sourceName
   ***REMOVED*****REMOVED***

    this.emit('fileBegin', e);
    logger.printInfo('Parsing %s ...', sourceName);

    if (!e.defaultPrevented) {
        e = {
            filename: sourceName,
            source: sourceCode
       ***REMOVED*****REMOVED***
        this.emit('beforeParse', e);
        sourceCode = e.source;
        sourceName = e.filename;

        sourceCode = pretreat(e.source);

        ast = this._astBuilder.build(sourceCode, sourceName);
        if (ast) {
            this._walker.recurse(sourceName, ast, this._visitor);
        }

    }

    this.emit('fileComplete', e);
    logger.info('complete.');
***REMOVED***

// TODO: docs
Parser.prototype.addDocletRef = function(e) {
    var node;

    if (e && e.code && e.code.node) {
        node = e.code.node;
        // allow lookup from value => doclet
        if (e.doclet) {
            this.refs[node.nodeId] = e.doclet;
        }
        // keep references to undocumented anonymous functions, too, as they might have scoped vars
        else if (
            (node.type === Syntax.FunctionDeclaration || node.type === Syntax.FunctionExpression) &&
            !this.refs[node.nodeId] ) {
            this.refs[node.nodeId] = {
                longname: jsdoc.name.ANONYMOUS_LONGNAME,
                meta: {
                    code: e.code
                }
           ***REMOVED*****REMOVED***
        }
    }
***REMOVED***

// TODO: docs
Parser.prototype._getDoclet = function(id) {
    if ( hasOwnProp.call(this.refs, id) ) {
        return this.refs[id];
    }

    return null;
***REMOVED***

// TODO: docs
***REMOVED***
***REMOVED*** @param {string} name - The symbol's longname.
***REMOVED*** @return {string} The symbol's basename.
***REMOVED***
Parser.prototype.getBasename = function(name) {
    if (name !== undefined) {
        return name.replace(/^([$a-z_][$a-z_0-9]*).*?$/i, '$1');
    }
***REMOVED***

// TODO: docs
function definedInScope(doclet, basename) {
    return !!doclet && !!doclet.meta && !!doclet.meta.vars && !!basename &&
        hasOwnProp.call(doclet.meta.vars, basename);
}

// TODO: docs
***REMOVED***
***REMOVED*** Given a node, determine what the node is a member of.
***REMOVED*** @param {node} node
***REMOVED*** @returns {string} The long name of the node that this is a member of.
***REMOVED***
Parser.prototype.astnodeToMemberof = function(node) {
    var basename;
    var doclet;
    var scope;

    var result = '';
    var type = node.type;

    if ( (type === Syntax.FunctionDeclaration || type === Syntax.FunctionExpression ||
        type === Syntax.VariableDeclarator) && node.enclosingScope ) {
        doclet = this._getDoclet(node.enclosingScope.nodeId);

        if (!doclet) {
            result = jsdoc.name.ANONYMOUS_LONGNAME + jsdoc.name.INNER;
       }
        else {
            result = (doclet.longname || doclet.name) + jsdoc.name.INNER;
        }
    }
    else {
        // check local references for aliases
        scope = node;
        basename = this.getBasename( jsdoc.src.astnode.nodeToString(node) );

        // walk up the scope chain until we find the scope in which the node is defined
        while (scope.enclosingScope) {
            doclet = this._getDoclet(scope.enclosingScope.nodeId);
            if ( doclet && definedInScope(doclet, basename) ) {
                result = [doclet.meta.vars[basename], basename];
                break;
            }
            else {
                // move up
                scope = scope.enclosingScope;
            }
        }

        // do we know that it's a global?
        doclet = this.refs[jsdoc.src.astnode.GLOBAL_NODE_ID];
        if ( doclet && definedInScope(doclet, basename) ) {
            result = [doclet.meta.vars[basename], basename];
        }

        // have we seen the node's parent? if so, use that
        else if (node.parent) {
            doclet = this._getDoclet(node.parent.nodeId);

            // set the result if we found a doclet. (if we didn't, the AST node may describe a
            // global symbol.)
            if (doclet) {
                result = doclet.longname || doclet.name;
            }
        }
    }

    return result;
***REMOVED***

// TODO: docs
***REMOVED***
***REMOVED*** Resolve what "this" refers to relative to a node.
***REMOVED*** @param {node} node - The "this" node
***REMOVED*** @returns {string} The longname of the enclosing node.
***REMOVED***
Parser.prototype.resolveThis = function(node) {
    var doclet;
    var result;

    // In general, if there's an enclosing scope, we use the enclosing scope to resolve `this`.
    // For object properties, we use the node's parent (the object) instead. This is a consequence
    // of the source-rewriting hackery that we use to support the `@lends` tag.
    if (node.type !== Syntax.Property && node.enclosingScope) {
        doclet = this._getDoclet(node.enclosingScope.nodeId);

        if (!doclet) {
            result = jsdoc.name.ANONYMOUS_LONGNAME; // TODO handle global this?
        }
        else if (doclet['this']) {
            result = doclet['this'];
        }
        // like: Foo.constructor = function(n) {***REMOVED*****REMOVED*** blah***REMOVED*** this.name = n; }
        else if (doclet.kind === 'function' && doclet.memberof) {
            result = doclet.memberof;
        }
        // like: var foo = function(n) {***REMOVED*****REMOVED*** blah***REMOVED*** this.bar = n; }
        else if ( doclet.kind === 'member' && jsdoc.src.astnode.isAssignment(node) ) {
            result = doclet.longname || doclet.name;
        }
        // walk up to the closest class we can find
        else if (doclet.kind === 'class' || doclet.kind === 'module') {
            result = doclet.longname || doclet.name;
        }
        else if (node.enclosingScope) {
            result = this.resolveThis(node.enclosingScope);
        }
    }
    else if (node.parent) {
        doclet = this.refs[node.parent.nodeId];

        // TODO: is this behavior correct? when do we get here?
        if (!doclet) {
            result = ''; // global?
        }
        else {
            result = doclet.longname || doclet.name;
        }
    }
    // TODO: is this behavior correct? when do we get here?
    else {
        result = ''; // global?
    }

    return result;
***REMOVED***

// TODO: docs
***REMOVED***
***REMOVED*** Given 'var foo = { x: 1 }', find foo from x.
***REMOVED***
Parser.prototype.resolvePropertyParent = function(node) {
    var doclet;

    if (node.parent) {
        doclet = this._getDoclet(node.parent.nodeId);
    }

    return doclet;
***REMOVED***

// TODO docs
***REMOVED***
***REMOVED*** Resolve what function a var is limited to.
***REMOVED*** @param {astnode} node
***REMOVED*** @param {string} basename The leftmost name in the long name: in foo.bar.zip the basename is foo.
***REMOVED***
Parser.prototype.resolveVar = function(node, basename) {
    var doclet;
    var result;

    var scope = node.enclosingScope;

    if (!scope) {
        result = ''; // global
    }
    else {
        doclet = this._getDoclet(scope.nodeId);
        if ( definedInScope(doclet, basename) ) {
            result = doclet.longname;
        }
        else {
            result = this.resolveVar(scope, basename);
        }
    }

    return result;
***REMOVED***

// TODO: docs
Parser.prototype.resolveEnum = function(e) {
    var doclet = this.resolvePropertyParent(e.code.node.parent);

    if (doclet && doclet.isEnum) {
        if (!doclet.properties) {
            doclet.properties = [];
        }

        // members of an enum inherit the enum's type
        if (doclet.type && !e.doclet.type) {
            e.doclet.type = doclet.type;
        }

        delete e.doclet.undocumented;
        e.doclet.defaultvalue = e.doclet.meta.code.value;

        // add a copy of the doclet to the parent's properties
        doclet.properties.push( require('jsdoc/util/doop').doop(e.doclet) );
    }
***REMOVED***

// TODO: document other events
***REMOVED***
***REMOVED*** Fired once for each JSDoc comment in the current source code.
***REMOVED*** @event jsdocCommentFound
***REMOVED*** @memberof module:jsdoc/src/parser.Parser
***REMOVED*** @param {event} e
***REMOVED*** @param {string} e.comment The text content of the JSDoc comment
***REMOVED*** @param {number} e.lineno The line number associated with the found comment.
***REMOVED*** @param {string} e.filename The file name associated with the found comment.
***REMOVED***
