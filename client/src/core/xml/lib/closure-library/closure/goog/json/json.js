// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview JSON utility functions.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.json');
goog.provide('goog.json.Serializer');


***REMOVED***
***REMOVED*** Tests if a string is an invalid JSON string. This only ensures that we are
***REMOVED*** not using any invalid characters
***REMOVED*** @param {string} s The string to test.
***REMOVED*** @return {boolean} True if the input is a valid JSON string.
***REMOVED*** @private
***REMOVED***
goog.json.isValid_ = function(s) {
  // All empty whitespace is not valid.
  if (/^\s*$/.test(s)) {
    return false;
  }

  // This is taken from http://www.json.org/json2.js which is released to the
  // public domain.
  // Changes: We dissallow \u2028 Line separator and \u2029 Paragraph separator
  // inside strings.  We also treat \u2028 and \u2029 as whitespace which they
  // are in the RFC but IE and Safari does not match \s to these so we need to
  // include them in the reg exps in all places where whitespace is allowed.
  // We allowed \x7f inside strings because some tools don't escape it,
  // e.g. http://www.json.org/java/org/json/JSONObject.java

  // Parsing happens in three stages. In the first stage, we run the text
  // against regular expressions that look for non-JSON patterns. We are
  // especially concerned with '()' and 'new' because they can cause invocation,
  // and '=' because it can cause mutation. But just to be safe, we want to
  // reject all unexpected forms.

  // We split the first stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace all backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

  // Don't make these static since they have the global flag.
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe =
      /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;

  return remainderRe.test(s.replace(backslashesRe, '@').
      replace(simpleValuesRe, ']').
      replace(openBracketsRe, ''));
***REMOVED***


***REMOVED***
***REMOVED*** Parses a JSON string and returns the result. This throws an exception if
***REMOVED*** the string is an invalid JSON string.
***REMOVED***
***REMOVED*** Note that this is very slow on large strings. If you trust the source of
***REMOVED*** the string then you should use unsafeParse instead.
***REMOVED***
***REMOVED*** @param {*} s The JSON string to parse.
***REMOVED*** @return {Object} The object generated from the JSON string.
***REMOVED***
goog.json.parse = function(s) {
  var o = String(s);
  if (goog.json.isValid_(o)) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      return***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (eval('(' + o + ')'));
    } catch (ex) {
    }
  }
  throw Error('Invalid JSON string: ' + o);
***REMOVED***


***REMOVED***
***REMOVED*** Parses a JSON string and returns the result. This uses eval so it is open
***REMOVED*** to security issues and it should only be used if you trust the source.
***REMOVED***
***REMOVED*** @param {string} s The JSON string to parse.
***REMOVED*** @return {Object} The object generated from the JSON string.
***REMOVED***
goog.json.unsafeParse = function(s) {
  return***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (eval('(' + s + ')'));
***REMOVED***


***REMOVED***
***REMOVED*** JSON replacer, as defined in Section 15.12.3 of the ES5 spec.
***REMOVED***
***REMOVED*** TODO(nicksantos): Array should also be a valid replacer.
***REMOVED***
***REMOVED*** @typedef {function(this:Object, string,***REMOVED***):***REMOVED***}
***REMOVED***
goog.json.Replacer;


***REMOVED***
***REMOVED*** JSON reviver, as defined in Section 15.12.2 of the ES5 spec.
***REMOVED***
***REMOVED*** @typedef {function(this:Object, string,***REMOVED***):***REMOVED***}
***REMOVED***
goog.json.Reviver;


***REMOVED***
***REMOVED*** Serializes an object or a value to a JSON string.
***REMOVED***
***REMOVED*** @param {*} object The object to serialize.
***REMOVED*** @param {?goog.json.Replacer=} opt_replacer A replacer function
***REMOVED***     called for each (key, value) pair that determines how the value
***REMOVED***     should be serialized. By defult, this just returns the value
***REMOVED***     and allows default serialization to kick in.
***REMOVED*** @throws Error if there are loops in the object graph.
***REMOVED*** @return {string} A JSON string representation of the input.
***REMOVED***
goog.json.serialize = function(object, opt_replacer) {
  // NOTE(nicksantos): Currently, we never use JSON.stringify.
  //
  // The last time I evaluated this, JSON.stringify had subtle bugs and behavior
  // differences on all browsers, and the performance win was not large enough
  // to justify all the issues. This may change in the future as browser
  // implementations get better.
  //
  // assertSerialize in json_test contains if branches for the cases
  // that fail.
  return new goog.json.Serializer(opt_replacer).serialize(object);
***REMOVED***



***REMOVED***
***REMOVED*** Class that is used to serialize JSON objects to a string.
***REMOVED*** @param {?goog.json.Replacer=} opt_replacer Replacer.
***REMOVED***
***REMOVED***
goog.json.Serializer = function(opt_replacer) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.json.Replacer|null|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.replacer_ = opt_replacer;
***REMOVED***


***REMOVED***
***REMOVED*** Serializes an object or a value to a JSON string.
***REMOVED***
***REMOVED*** @param {*} object The object to serialize.
***REMOVED*** @throws Error if there are loops in the object graph.
***REMOVED*** @return {string} A JSON string representation of the input.
***REMOVED***
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serialize_(object, sb);
  return sb.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Serializes a generic value to a JSON string
***REMOVED*** @private
***REMOVED*** @param {*} object The object to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED*** @throws Error if there are loops in the object graph.
***REMOVED***
goog.json.Serializer.prototype.serialize_ = function(object, sb) {
  switch (typeof object) {
    case 'string':
      this.serializeString_(***REMOVED*** @type {string}***REMOVED*** (object), sb);
      break;
    case 'number':
      this.serializeNumber_(***REMOVED*** @type {number}***REMOVED*** (object), sb);
      break;
    case 'boolean':
      sb.push(object);
      break;
    case 'undefined':
      sb.push('null');
      break;
    case 'object':
      if (object == null) {
        sb.push('null');
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray(***REMOVED*** @type {!Array}***REMOVED*** (object), sb);
        break;
      }
      // should we allow new String, new Number and new Boolean to be treated
      // as string, number and boolean? Most implementations do not and the
      // need is not very big
      this.serializeObject_(***REMOVED*** @type {Object}***REMOVED*** (object), sb);
      break;
    case 'function':
      // Skip functions.
      // TODO(user) Should we return something here?
      break;
    default:
      throw Error('Unknown type: ' + typeof object);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Character mappings used internally for goog.string.quote
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.json.Serializer.charToJsonCharCache_ = {
  '\"': '\\"',
  '\\': '\\\\',
  '/': '\\/',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',

  '\x0B': '\\u000b' // '\v' is not supported in JScript
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression used to match characters that need to be replaced.
***REMOVED*** The S60 browser has a bug where unicode characters are not matched by
***REMOVED*** regular expressions. The condition below detects such behaviour and
***REMOVED*** adjusts the regular expression accordingly.
***REMOVED*** @private
***REMOVED*** @type {RegExp}
***REMOVED***
goog.json.Serializer.charsToReplace_ = /\uffff/.test('\uffff') ?
    /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;


***REMOVED***
***REMOVED*** Serializes a string to a JSON string
***REMOVED*** @private
***REMOVED*** @param {string} s The string to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED***
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  // The official JSON implementation does not work with international
  // characters.
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    // caching the result improves performance by a factor 2-3
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }

    var cc = c.charCodeAt(0);
    var rv = '\\u';
    if (cc < 16) {
      rv += '000';
    } else if (cc < 256) {
      rv += '00';
    } else if (cc < 4096) { // \u1000
      rv += '0';
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
***REMOVED***


***REMOVED***
***REMOVED*** Serializes a number to a JSON string
***REMOVED*** @private
***REMOVED*** @param {number} n The number to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED***
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : 'null');
***REMOVED***


***REMOVED***
***REMOVED*** Serializes an array to a JSON string
***REMOVED*** @param {Array} arr The array to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED*** @protected
***REMOVED***
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push('[');
  var sep = '';
  for (var i = 0; i < l; i++) {
    sb.push(sep);

    var value = arr[i];
    this.serialize_(
        this.replacer_ ? this.replacer_.call(arr, String(i), value) : value,
        sb);

    sep = ',';
  }
  sb.push(']');
***REMOVED***


***REMOVED***
***REMOVED*** Serializes an object to a JSON string
***REMOVED*** @private
***REMOVED*** @param {Object} obj The object to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED***
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push('{');
  var sep = '';
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      // Skip functions.
      // TODO(ptucker) Should we return something for function properties?
      if (typeof value != 'function') {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(':');

        this.serialize_(
            this.replacer_ ? this.replacer_.call(obj, key, value) : value,
            sb);

        sep = ',';
      }
    }
  }
  sb.push('}');
***REMOVED***
