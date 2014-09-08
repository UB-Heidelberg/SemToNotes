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
***REMOVED*** @fileoverview Wrapper for an IndexedDB object store.
***REMOVED***
***REMOVED***


goog.provide('goog.db.ObjectStore');

goog.require('goog.async.Deferred');
goog.require('goog.db.Cursor');
goog.require('goog.db.Error');
goog.require('goog.db.Index');
goog.require('goog.debug');
***REMOVED***



***REMOVED***
***REMOVED*** Creates an IDBObjectStore wrapper object. Object stores have methods for
***REMOVED*** storing and retrieving records, and are accessed through a transaction
***REMOVED*** object. They also have methods for creating indexes associated with the
***REMOVED*** object store. They can only be created when setting the version of the
***REMOVED*** database. Should not be created directly, access object stores through
***REMOVED*** transactions.
***REMOVED*** @see goog.db.IndexedDb#setVersion
***REMOVED*** @see goog.db.Transaction#objectStore
***REMOVED***
***REMOVED*** @param {!IDBObjectStore} store The backing IndexedDb object.
***REMOVED***
***REMOVED***
***REMOVED*** TODO(user): revisit msg in exception and errors in this class. In newer
***REMOVED***     Chrome (v22+) the error/request come with a DOM error string that is
***REMOVED***     already very descriptive.
***REMOVED*** @final
***REMOVED***
goog.db.ObjectStore = function(store) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying IndexedDB object store object.
  ***REMOVED***
  ***REMOVED*** @type {!IDBObjectStore}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.store_ = store;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The name of the object store.
***REMOVED***
goog.db.ObjectStore.prototype.getName = function() {
  return this.store_.name;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for put and add.
***REMOVED***
***REMOVED*** @param {string} fn Function name to call on the object store.
***REMOVED*** @param {string} msg Message to give to the error.
***REMOVED*** @param {*} value Value to insert into the object store.
***REMOVED*** @param {IDBKeyType=} opt_key The key to use.
***REMOVED*** @return {!goog.async.Deferred} The resulting deferred request.
***REMOVED*** @private
***REMOVED***
goog.db.ObjectStore.prototype.insert_ = function(fn, msg, value, opt_key) {
  // TODO(user): refactor wrapping an IndexedDB request in a Deferred by
  // creating a higher-level abstraction for it (mostly affects here and
  // goog.db.Index)
  var d = new goog.async.Deferred();
  var request;
  try {
    // put or add with (value, undefined) throws an error, so we need to check
    // for undefined ourselves
    if (opt_key) {
      request = this.store_[fn](value, opt_key);
    } else {
      request = this.store_[fn](value);
    }
  } catch (ex) {
    msg += goog.debug.deepExpose(value);
    if (opt_key) {
      msg += ', with key ' + goog.debug.deepExpose(opt_key);
    }
    d.errback(goog.db.Error.fromException(ex, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
***REMOVED***
  request.onerror = function(ev) {
    msg += goog.debug.deepExpose(value);
    if (opt_key) {
      msg += ', with key ' + goog.debug.deepExpose(opt_key);
    }
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an object to the object store. Replaces existing objects with the
***REMOVED*** same key.
***REMOVED***
***REMOVED*** @param {*} value The value to put.
***REMOVED*** @param {IDBKeyType=} opt_key The key to use. Cannot be used if the
***REMOVED***     keyPath was specified for the object store. If the keyPath was not
***REMOVED***     specified but autoIncrement was not enabled, it must be used.
***REMOVED*** @return {!goog.async.Deferred} The deferred put request.
***REMOVED***
goog.db.ObjectStore.prototype.put = function(value, opt_key) {
  return this.insert_(
      'put',
      'putting into ' + this.getName() + ' with value',
      value,
      opt_key);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an object to the object store. Requires that there is no object with
***REMOVED*** the same key already present.
***REMOVED***
***REMOVED*** @param {*} value The value to add.
***REMOVED*** @param {IDBKeyType=} opt_key The key to use. Cannot be used if the
***REMOVED***     keyPath was specified for the object store. If the keyPath was not
***REMOVED***     specified but autoIncrement was not enabled, it must be used.
***REMOVED*** @return {!goog.async.Deferred} The deferred add request.
***REMOVED***
goog.db.ObjectStore.prototype.add = function(value, opt_key) {
  return this.insert_(
      'add',
      'adding into ' + this.getName() + ' with value ',
      value,
      opt_key);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an object from the store. No-op if there is no object present with
***REMOVED*** the given key.
***REMOVED***
***REMOVED*** @param {IDBKeyType} key The key to remove objects under.
***REMOVED*** @return {!goog.async.Deferred} The deferred remove request.
***REMOVED***
goog.db.ObjectStore.prototype.remove = function(key) {
  var d = new goog.async.Deferred();
  var request;
  try {
    request = this.store_['delete'](key);
  } catch (err) {
    var msg = 'removing from ' + this.getName() + ' with key ' +
        goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
***REMOVED***
  request.onerror = function(ev) {
    var msg = 'removing from ' + self.getName() + ' with key ' +
        goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Gets an object from the store. If no object is present with that key
***REMOVED*** the result is {@code undefined}.
***REMOVED***
***REMOVED*** @param {IDBKeyType} key The key to look up.
***REMOVED*** @return {!goog.async.Deferred} The deferred get request.
***REMOVED***
goog.db.ObjectStore.prototype.get = function(key) {
  var d = new goog.async.Deferred();
  var request;
  try {
    request = this.store_.get(key);
  } catch (err) {
    var msg = 'getting from ' + this.getName() + ' with key ' +
        goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback(ev.target.result);
 ***REMOVED*****REMOVED***
***REMOVED***
  request.onerror = function(ev) {
    var msg = 'getting from ' + self.getName() + ' with key ' +
        goog.debug.deepExpose(key);
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Gets all objects from the store and returns them as an array.
***REMOVED***
***REMOVED*** @param {!goog.db.KeyRange=} opt_range The key range. If undefined iterates
***REMOVED***     over the whole object store.
***REMOVED*** @param {!goog.db.Cursor.Direction=} opt_direction The direction. If undefined
***REMOVED***     moves in a forward direction with duplicates.
***REMOVED*** @return {!goog.async.Deferred} The deferred getAll request.
***REMOVED***
goog.db.ObjectStore.prototype.getAll = function(opt_range, opt_direction) {
  var d = new goog.async.Deferred();
  var cursor;
  try {
    cursor = this.openCursor(opt_range, opt_direction);
  } catch (err) {
    d.errback(err);
    return d;
  }

  var result = [];
  var key = goog.events.listen(
      cursor, goog.db.Cursor.EventType.NEW_DATA, function() {
        result.push(cursor.getValue());
        cursor.next();
      });

  goog.events.listenOnce(cursor, [
    goog.db.Cursor.EventType.ERROR,
    goog.db.Cursor.EventType.COMPLETE
  ], function(evt) {
    cursor.dispose();
    if (evt.type == goog.db.Cursor.EventType.COMPLETE) {
      d.callback(result);
    } else {
      d.errback();
    }
  });
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Opens a cursor over the specified key range. Returns a cursor object which is
***REMOVED*** able to iterate over the given range.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***
***REMOVED*** <code>
***REMOVED***  var cursor = objectStore.openCursor(goog.db.Range.bound('a', 'c'));
***REMOVED***
***REMOVED***  var key = goog.events.listen(
***REMOVED***      cursor, goog.db.Cursor.EventType.NEW_DATA, function() {
***REMOVED***    // Do something with data.
***REMOVED***    cursor.next();
***REMOVED***  });
***REMOVED***
***REMOVED***  goog.events.listenOnce(
***REMOVED***      cursor, goog.db.Cursor.EventType.COMPLETE, function() {
***REMOVED***    // Clean up listener, and perform a finishing operation on the data.
***REMOVED***    goog.events.unlistenByKey(key);
***REMOVED***  });
***REMOVED*** </code>
***REMOVED***
***REMOVED*** @param {!goog.db.KeyRange=} opt_range The key range. If undefined iterates
***REMOVED***     over the whole object store.
***REMOVED*** @param {!goog.db.Cursor.Direction=} opt_direction The direction. If undefined
***REMOVED***     moves in a forward direction with duplicates.
***REMOVED*** @return {!goog.db.Cursor} The cursor.
***REMOVED*** @throws {goog.db.Error} If there was a problem opening the cursor.
***REMOVED***
goog.db.ObjectStore.prototype.openCursor = function(opt_range, opt_direction) {
  return goog.db.Cursor.openCursor(this.store_, opt_range, opt_direction);
***REMOVED***


***REMOVED***
***REMOVED*** Deletes all objects from the store.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred clear request.
***REMOVED***
goog.db.ObjectStore.prototype.clear = function() {
  var msg = 'clearing store ' + this.getName();
  var d = new goog.async.Deferred();
  var request;
  try {
    request = this.store_.clear();
  } catch (err) {
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an index in this object store. Can only be called inside the callback
***REMOVED*** for the Deferred returned from goog.db.IndexedDb#setVersion.
***REMOVED***
***REMOVED*** @param {string} name Name of the index to create.
***REMOVED*** @param {string} keyPath Attribute to index on.
***REMOVED*** @param {!Object=} opt_parameters Optional parameters object. The only
***REMOVED***     available option is unique, which defaults to false. If unique is true,
***REMOVED***     the index will enforce that there is only ever one object in the object
***REMOVED***     store for each unique value it indexes on.
***REMOVED*** @return {!goog.db.Index} The newly created, wrapped index.
***REMOVED*** @throws {goog.db.Error} In case of an error creating the index.
***REMOVED***
goog.db.ObjectStore.prototype.createIndex = function(
    name, keyPath, opt_parameters) {
  try {
    return new goog.db.Index(this.store_.createIndex(
        name, keyPath, opt_parameters));
  } catch (ex) {
    var msg = 'creating new index ' + name + ' with key path ' + keyPath;
    throw goog.db.Error.fromException(ex, msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets an index.
***REMOVED***
***REMOVED*** @param {string} name Name of the index to fetch.
***REMOVED*** @return {!goog.db.Index} The requested wrapped index.
***REMOVED*** @throws {goog.db.Error} In case of an error getting the index.
***REMOVED***
goog.db.ObjectStore.prototype.getIndex = function(name) {
  try {
    return new goog.db.Index(this.store_.index(name));
  } catch (ex) {
    var msg = 'getting index ' + name;
    throw goog.db.Error.fromException(ex, msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Deletes an index from the object store. Can only be called inside the
***REMOVED*** callback for the Deferred returned from goog.db.IndexedDb#setVersion.
***REMOVED***
***REMOVED*** @param {string} name Name of the index to delete.
***REMOVED*** @throws {goog.db.Error} In case of an error deleting the index.
***REMOVED***
goog.db.ObjectStore.prototype.deleteIndex = function(name) {
  try {
    this.store_.deleteIndex(name);
  } catch (ex) {
    var msg = 'deleting index ' + name;
    throw goog.db.Error.fromException(ex, msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets number of records within a key range.
***REMOVED***
***REMOVED*** @param {!goog.db.KeyRange=} opt_range The key range. If undefined, this will
***REMOVED***     count all records in the object store.
***REMOVED*** @return {!goog.async.Deferred} The deferred number of records.
***REMOVED***
goog.db.ObjectStore.prototype.count = function(opt_range) {
  var request;
  var d = new goog.async.Deferred();

  try {
    var range = opt_range ? opt_range.range() : null;
    request = this.store_.count(range);
  } catch (ex) {
    d.errback(goog.db.Error.fromException(ex, this.getName()));
  }
  request.onsuccess = function(ev) {
    d.callback(ev.target.result);
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    d.errback(goog.db.Error.fromRequest(ev.target, this.getName()));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***

