// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a JS storage class implementing the HTML5 Storage
***REMOVED*** interface.
***REMOVED***


goog.require('goog.structs.Map');


goog.provide('goog.testing.MockStorage');



***REMOVED***
***REMOVED*** A JS storage instance, implementing the HMTL5 Storage interface.
***REMOVED*** See http://www.w3.org/TR/webstorage/ for details.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {Storage}
***REMOVED*** @final
***REMOVED***
goog.testing.MockStorage = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying storage object.
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.store_ = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of elements in the storage.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Sets an item to the storage.
***REMOVED*** @param {string} key Storage key.
***REMOVED*** @param {*} value Storage value. Must be convertible to string.
***REMOVED*** @override
***REMOVED***
goog.testing.MockStorage.prototype.setItem = function(key, value) {
  this.store_.set(key, String(value));
  this.length = this.store_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Gets an item from the storage.  The item returned is the "structured clone"
***REMOVED*** of the value from setItem.  In practice this means it's the value cast to a
***REMOVED*** string.
***REMOVED*** @param {string} key Storage key.
***REMOVED*** @return {?string} Storage value for key; null if does not exist.
***REMOVED*** @override
***REMOVED***
goog.testing.MockStorage.prototype.getItem = function(key) {
  var val = this.store_.get(key);
  // Enforce that getItem returns string values.
  return (val != null) ?***REMOVED*****REMOVED*** @type {string}***REMOVED*** (val) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Removes and item from the storage.
***REMOVED*** @param {string} key Storage key.
***REMOVED*** @override
***REMOVED***
goog.testing.MockStorage.prototype.removeItem = function(key) {
  this.store_.remove(key);
  this.length = this.store_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Clears the storage.
***REMOVED*** @override
***REMOVED***
goog.testing.MockStorage.prototype.clear = function() {
  this.store_.clear();
  this.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the key at the given index.
***REMOVED*** @param {number} index The index for the key.
***REMOVED*** @return {?string} Key at the given index, null if not found.
***REMOVED*** @override
***REMOVED***
goog.testing.MockStorage.prototype.key = function(index) {
  return this.store_.getKeys()[index] || null;
***REMOVED***
