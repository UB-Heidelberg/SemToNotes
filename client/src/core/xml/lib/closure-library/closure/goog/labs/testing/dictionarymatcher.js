// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides the built-in dictionary matcher methods like
***REMOVED***     hasEntry, hasEntries, hasKey, hasValue, etc.
***REMOVED***



goog.provide('goog.labs.testing.HasEntriesMatcher');
goog.provide('goog.labs.testing.HasEntryMatcher');
goog.provide('goog.labs.testing.HasKeyMatcher');
goog.provide('goog.labs.testing.HasValueMatcher');


goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.labs.testing.Matcher');
goog.require('goog.string');



***REMOVED***
***REMOVED*** The HasEntries matcher.
***REMOVED***
***REMOVED*** @param {!Object} entries The entries to check in the object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.HasEntriesMatcher = function(entries) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entries_ = entries;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object has particular entries.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasEntriesMatcher.prototype.matches =
    function(actualObject) {
  goog.asserts.assertObject(actualObject, 'Expected an Object');
  var object =***REMOVED*****REMOVED*** @type {!Object}***REMOVED***(actualObject);
  return goog.object.every(this.entries_, function(value, key) {
    return goog.object.containsKey(object, key) &&
           object[key] === value;
  });
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasEntriesMatcher.prototype.describe =
    function(actualObject) {
  goog.asserts.assertObject(actualObject, 'Expected an Object');
  var object =***REMOVED*****REMOVED*** @type {!Object}***REMOVED***(actualObject);
  var errorString = 'Input object did not contain the following entries:\n';
  goog.object.forEach(this.entries_, function(value, key) {
    if (!goog.object.containsKey(object, key) ||
        object[key] !== value) {
      errorString += key + ': ' + value + '\n';
    }
  });
  return errorString;
***REMOVED***



***REMOVED***
***REMOVED*** The HasEntry matcher.
***REMOVED***
***REMOVED*** @param {string} key The key for the entry.
***REMOVED*** @param {*} value The value for the key.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.HasEntryMatcher = function(key, value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.key_ = key;
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object has a particular entry.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasEntryMatcher.prototype.matches =
    function(actualObject) {
  goog.asserts.assertObject(actualObject);
  return goog.object.containsKey(actualObject, this.key_) &&
         actualObject[this.key_] === this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasEntryMatcher.prototype.describe =
    function(actualObject) {
  goog.asserts.assertObject(actualObject);
  var errorMsg;
  if (goog.object.containsKey(actualObject, this.key_)) {
    errorMsg = 'Input object did not contain key: ' + this.key_;
  } else {
    errorMsg = 'Value for key did not match value: ' + this.value_;
  }
  return errorMsg;
***REMOVED***



***REMOVED***
***REMOVED*** The HasKey matcher.
***REMOVED***
***REMOVED*** @param {string} key The key to check in the object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.HasKeyMatcher = function(key) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.key_ = key;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object has a key.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasKeyMatcher.prototype.matches =
    function(actualObject) {
  goog.asserts.assertObject(actualObject);
  return goog.object.containsKey(actualObject, this.key_);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasKeyMatcher.prototype.describe =
    function(actualObject) {
  goog.asserts.assertObject(actualObject);
  return 'Input object did not contain the key: ' + this.key_;
***REMOVED***



***REMOVED***
***REMOVED*** The HasValue matcher.
***REMOVED***
***REMOVED*** @param {*} value The value to check in the object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.HasValueMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object contains a value
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasValueMatcher.prototype.matches =
    function(actualObject) {
  goog.asserts.assertObject(actualObject, 'Expected an Object');
  var object =***REMOVED*****REMOVED*** @type {!Object}***REMOVED***(actualObject);
  return goog.object.containsValue(object, this.value_);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasValueMatcher.prototype.describe =
    function(actualObject) {
  return 'Input object did not contain the value: ' + this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Gives a matcher that asserts an object contains all the given key-value pairs
***REMOVED*** in the input object.
***REMOVED***
***REMOVED*** @param {!Object} entries The entries to check for presence in the object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.HasEntriesMatcher} A HasEntriesMatcher.
***REMOVED***
function hasEntries(entries) {
  return new goog.labs.testing.HasEntriesMatcher(entries);
}


***REMOVED***
***REMOVED*** Gives a matcher that asserts an object contains the given key-value pair.
***REMOVED***
***REMOVED*** @param {string} key The key to check for presence in the object.
***REMOVED*** @param {*} value The value to check for presence in the object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.HasEntryMatcher} A HasEntryMatcher.
***REMOVED***
function hasEntry(key, value) {
  return new goog.labs.testing.HasEntryMatcher(key, value);
}


***REMOVED***
***REMOVED*** Gives a matcher that asserts an object contains the given key.
***REMOVED***
***REMOVED*** @param {string} key The key to check for presence in the object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.HasKeyMatcher} A HasKeyMatcher.
***REMOVED***
function hasKey(key) {
  return new goog.labs.testing.HasKeyMatcher(key);
}


***REMOVED***
***REMOVED*** Gives a matcher that asserts an object contains the given value.
***REMOVED***
***REMOVED*** @param {*} value The value to check for presence in the object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.HasValueMatcher} A HasValueMatcher.
***REMOVED***
function hasValue(value) {
  return new goog.labs.testing.HasValueMatcher(value);
}
