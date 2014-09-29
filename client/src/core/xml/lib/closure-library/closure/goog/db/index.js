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
***REMOVED*** @fileoverview Wrapper for an IndexedDB index.
***REMOVED***
***REMOVED***


goog.provide('goog.db.Index');

goog.require('goog.async.Deferred');
goog.require('goog.db.Error');
goog.require('goog.debug');



***REMOVED***
***REMOVED*** Creates an IDBIndex wrapper object. Indexes are associated with object
***REMOVED*** stores and provide methods for looking up objects based on their non-key
***REMOVED*** properties. Should not be created directly, access through the object store
***REMOVED*** it belongs to.
***REMOVED*** @see goog.db.ObjectStore#getIndex
***REMOVED***
***REMOVED*** @param {!IDBIndex} index Underlying IDBIndex object.
***REMOVED***
***REMOVED***
goog.db.Index = function(index) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying IndexedDB index object.
  ***REMOVED***
  ***REMOVED*** @type {!IDBIndex}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.index_ = index;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} Name of the index.
***REMOVED***
goog.db.Index.prototype.getName = function() {
  return this.index_.name;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} Key path of the index.
***REMOVED***
goog.db.Index.prototype.getKeyPath = function() {
  return this.index_.keyPath;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the index enforces that there is only one object
***REMOVED***     for each unique value it indexes on.
***REMOVED***
goog.db.Index.prototype.isUnique = function() {
  return this.index_.unique;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for get and getKey.
***REMOVED***
***REMOVED*** @param {string} fn Function name to call on the index to get the request.
***REMOVED*** @param {string} msg Message to give to the error.
***REMOVED*** @param {IDBKeyType} key The key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} The resulting deferred object.
***REMOVED*** @private
***REMOVED***
goog.db.Index.prototype.get_ = function(fn, msg, key) {
  var d = new goog.async.Deferred();
  var request;
  try {
    request = this.index_[fn](key);
  } catch (err) {
    msg += ' with key ' + goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback(ev.target.result);
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    msg += ' with key ' + goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Fetches a single object from the object store. Even if there are multiple
***REMOVED*** objects that match the given key, this method will get only one of them.
***REMOVED***
***REMOVED*** @param {IDBKeyType} key Key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} The deferred object for the given record.
***REMOVED***
goog.db.Index.prototype.get = function(key) {
  return this.get_('get', 'getting from index ' + this.getName(), key);
***REMOVED***


***REMOVED***
***REMOVED*** Looks up a single object from the object store and gives back the key that
***REMOVED*** it's listed under in the object store. Even if there are multiple records
***REMOVED*** that match the given key, this method returns the first.
***REMOVED***
***REMOVED*** @param {IDBKeyType} key Key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} The deferred key for the record that matches
***REMOVED***     the key.
***REMOVED***
goog.db.Index.prototype.getKey = function(key) {
  return this.get_('getKey', 'getting key from index ' + this.getName(), key);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for getAll and getAllKeys.
***REMOVED***
***REMOVED*** @param {string} fn Function name to call on the index to get the request.
***REMOVED*** @param {string} msg Message to give to the error.
***REMOVED*** @param {IDBKeyType=} opt_key Key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} The resulting deferred array of objects.
***REMOVED*** @private
***REMOVED***
goog.db.Index.prototype.getAll_ = function(fn, msg, opt_key) {
  // This is the most common use of IDBKeyRange. If more specific uses of
  // cursors are needed then a full wrapper should be created.
  var IDBKeyRange = goog.global.IDBKeyRange || goog.global.webkitIDBKeyRange;
  var d = new goog.async.Deferred();
  var request;
  try {
    if (opt_key) {
      request = this.index_[fn](IDBKeyRange.only(opt_key));
    } else {
      request = this.index_[fn]();
    }
  } catch (err) {
    if (opt_key) {
      msg += ' for key ' + goog.debug.deepExpose(opt_key);
    }
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  var result = [];
  request.onsuccess = function(ev) {
    var cursor = ev.target.result;
    if (cursor) {
      result.push(cursor.value);
      cursor['continue']();
    } else {
      d.callback(result);
    }
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    if (opt_key) {
      msg += ' for key ' + goog.debug.deepExpose(opt_key);
    }
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Gets all indexed objects. If the key is provided, gets all indexed objects
***REMOVED*** that match the key instead.
***REMOVED***
***REMOVED*** @param {IDBKeyType=} opt_key Key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} A deferred array of objects that match the
***REMOVED***     key.
***REMOVED***
goog.db.Index.prototype.getAll = function(opt_key) {
  return this.getAll_(
      'openCursor',
      'getting all from index ' + this.getName(),
      opt_key);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the keys to look up all the indexed objects. If the key is provided,
***REMOVED*** gets all records for objects that match the key instead.
***REMOVED***
***REMOVED*** @param {IDBKeyType=} opt_key Key to look up in the index.
***REMOVED*** @return {!goog.async.Deferred} A deferred array of keys for objects that
***REMOVED***     match the key.
***REMOVED***
goog.db.Index.prototype.getAllKeys = function(opt_key) {
  return this.getAll_(
      'openKeyCursor',
      'getting all keys from index ' + this.getName(),
      opt_key);
***REMOVED***
