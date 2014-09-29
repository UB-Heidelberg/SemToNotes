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
***REMOVED*** @fileoverview Provides a convenient API for data persistence using a selected
***REMOVED*** data storage mechanism.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.Storage');

goog.require('goog.json');
goog.require('goog.json.Serializer');
goog.require('goog.storage.ErrorCode');
goog.require('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** The base implementation for all storage APIs.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.Mechanism} mechanism The underlying
***REMOVED***     storage mechanism.
***REMOVED***
***REMOVED***
goog.storage.Storage = function(mechanism) {
  this.mechanism = mechanism;
  this.serializer_ = new goog.json.Serializer();
***REMOVED***


***REMOVED***
***REMOVED*** The mechanism used to persist key-value pairs.
***REMOVED***
***REMOVED*** @type {goog.storage.mechanism.Mechanism}
***REMOVED*** @protected
***REMOVED***
goog.storage.Storage.prototype.mechanism = null;


***REMOVED***
***REMOVED*** The JSON serializer used to serialize values.
***REMOVED***
***REMOVED*** @type {goog.json.Serializer}
***REMOVED*** @private
***REMOVED***
goog.storage.Storage.prototype.serializer_ = null;


***REMOVED***
***REMOVED*** Set an item in the data storage.
***REMOVED***
***REMOVED*** @param {string} key The key to set.
***REMOVED*** @param {*} value The value to serialize to a string and save.
***REMOVED***
goog.storage.Storage.prototype.set = function(key, value) {
  if (!goog.isDef(value)) {
    this.mechanism.remove(key);
    return;
  }
  this.mechanism.set(key, this.serializer_.serialize(value));
***REMOVED***


***REMOVED***
***REMOVED*** Get an item from the data storage.
***REMOVED***
***REMOVED*** @param {string} key The key to get.
***REMOVED*** @return {*} Deserialized value or undefined if not found.
***REMOVED***
goog.storage.Storage.prototype.get = function(key) {
  var json = this.mechanism.get(key);
  if (goog.isNull(json)) {
    return undefined;
  }
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return goog.json.parse(json);
  } catch (e) {
    throw goog.storage.ErrorCode.INVALID_VALUE;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove an item from the data storage.
***REMOVED***
***REMOVED*** @param {string} key The key to remove.
***REMOVED***
goog.storage.Storage.prototype.remove = function(key) {
  this.mechanism.remove(key);
***REMOVED***
