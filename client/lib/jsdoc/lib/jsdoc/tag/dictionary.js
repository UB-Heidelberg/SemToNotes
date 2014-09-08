***REMOVED***
    @overview
    @author Michael Mathews <micmath@gmail.com>
    @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

var hasOwnProp = Object.prototype.hasOwnProperty;

var _tags = {***REMOVED***
var _tagSynonyms = {***REMOVED***
var _namespaces = [];
var dictionary;

***REMOVED*** @private***REMOVED***
function TagDefinition(title, etc) {
  ***REMOVED***
    etc = etc || {***REMOVED***

    this.title = dictionary.normalise(title);

    Object.keys(etc).forEach(function(p) {
        self[p] = etc[p];
    });
}

***REMOVED*** @private***REMOVED***
TagDefinition.prototype.synonym = function(synonymName) {
    _tagSynonyms[synonymName.toLowerCase()] = this.title;
    return this; // chainable
***REMOVED***

***REMOVED*** @exports jsdoc/tag/dictionary***REMOVED***
dictionary = {
   ***REMOVED*****REMOVED*** @function***REMOVED***
    defineTag: function(title, opts) {
        var def = new TagDefinition(title, opts);
        // all the other dictionary functions use normalised names; we should too.
        _tags[def.title] = def;

        if (opts && opts.isNamespace) {
            _namespaces.push(def.title);
        }

        return _tags[def.title];
    },

   ***REMOVED*****REMOVED*** @function***REMOVED***
    lookUp: function(title) {
        title = dictionary.normalise(title);

        if ( hasOwnProp.call(_tags, title) ) {
           return _tags[title];
        }

        return false;
    },

   ***REMOVED*****REMOVED*** @function***REMOVED***
    isNamespace: function(kind) {
        if (kind) {
            kind = dictionary.normalise(kind);
            if ( _namespaces.indexOf(kind) !== -1) {
                return true;
            }
        }

        return false;
    },

   ***REMOVED*****REMOVED*** @function***REMOVED***
    normalise: function(title) {
        var canonicalName = title.toLowerCase();

        if ( hasOwnProp.call(_tagSynonyms, canonicalName) ) {
            return _tagSynonyms[canonicalName];
        }

        return canonicalName;
    }
***REMOVED***

require('jsdoc/tag/dictionary/definitions').defineTags(dictionary);

module.exports = dictionary;
