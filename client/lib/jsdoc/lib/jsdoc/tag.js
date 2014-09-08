/*global env: true***REMOVED***
***REMOVED***
    @overview
    @author Michael Mathews <micmath@gmail.com>
    @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***

***REMOVED***
    Functionality related to JSDoc tags.
    @module jsdoc/tag
    @requires jsdoc/tag/dictionary
    @requires jsdoc/tag/validator
    @requires jsdoc/tag/type
***REMOVED***
'use strict';

var jsdoc = {
    tag: {
        dictionary: require('jsdoc/tag/dictionary'),
        validator: require('jsdoc/tag/validator'),
        type: require('jsdoc/tag/type')
    },
    util: {
        logger: require('jsdoc/util/logger')
    }
***REMOVED***
var path = require('jsdoc/path');

function trim(text, opts) {
    var indentMatcher;
    var match;

    opts = opts || {***REMOVED***
    text = text || '';

    if (opts.keepsWhitespace) {
        text = text.replace(/^[\n\r\f]+|[\n\r\f]+$/g, '');
        if (opts.removesIndent) {
            match = text.match(/^([ \t]+)/);
            if (match && match[1]) {
                indentMatcher = new RegExp('^' + match[1], 'gm');
                text = text.replace(indentMatcher, '');
            }
        }
    }
    else {
        text = text.replace(/^\s+|\s+$/g, '');
    }

    return text;
}

function processTagText(tag, tagDef) {
    var tagType;

    if (tagDef.onTagText) {
        tag.text = tagDef.onTagText(tag.text);
    }

    if (tagDef.canHaveType || tagDef.canHaveName) {
       ***REMOVED*****REMOVED*** The value property represents the result of parsing the tag text.***REMOVED***
        tag.value = {***REMOVED***

        tagType = jsdoc.tag.type.parse(tag.text, tagDef.canHaveName, tagDef.canHaveType);

        // It is possible for a tag to***REMOVED***not* have a type but still have
        // optional or defaultvalue, e.g. '@param [foo]'.
        // Although tagType.type.length == 0 we should still copy the other properties.
        if (tagType.type) {
            if (tagType.type.length) {
                tag.value.type = {
                    names: tagType.type
               ***REMOVED*****REMOVED***
            }
            tag.value.optional = tagType.optional;
            tag.value.nullable = tagType.nullable;
            tag.value.variable = tagType.variable;
            tag.value.defaultvalue = tagType.defaultvalue;
        }

        if (tagType.text && tagType.text.length) {
            tag.value.description = tagType.text;
        }

        if (tagDef.canHaveName) {
            // note the dash is a special case: as a param name it means "no name"
            if (tagType.name && tagType.name !== '-') { tag.value.name = tagType.name; }
        }
    }
    else {
        tag.value = tag.text;
    }
}

***REMOVED***
    Constructs a new tag object. Calls the tag validator.
    @class
    @classdesc Represents a single doclet tag.
    @param {string} tagTitle
    @param {string=} tagBody
    @param {object=} meta
***REMOVED***
var Tag = exports.Tag = function(tagTitle, tagBody, meta) {
    var tagDef;
    var trimOpts;

    meta = meta || {***REMOVED***

    this.originalTitle = trim(tagTitle);

   ***REMOVED*****REMOVED*** The title part of the tag: @title text***REMOVED***
    this.title = jsdoc.tag.dictionary.normalise(this.originalTitle);

    tagDef = jsdoc.tag.dictionary.lookUp(this.title);
    trimOpts = {
        keepsWhitespace: tagDef.keepsWhitespace,
        removesIndent: tagDef.removesIndent
   ***REMOVED*****REMOVED***

   ***REMOVED*****REMOVED*** The text part of the tag: @title text***REMOVED***
    this.text = trim(tagBody, trimOpts);

    if (this.text) {
        try {
            processTagText(this, tagDef);
        }
        catch (e) {
            // probably a type-parsing error
            jsdoc.util.logger.error(
                'Unable to create a Tag object%s with title "%s" and body "%s": %s',
                meta.filename ? ( ' for source file ' + path.join(meta.path, meta.filename) ) : '',
                tagTitle,
                tagBody,
                e.message
          ***REMOVED***
        }
    }

    jsdoc.tag.validator.validate(this, tagDef, meta);
***REMOVED***
