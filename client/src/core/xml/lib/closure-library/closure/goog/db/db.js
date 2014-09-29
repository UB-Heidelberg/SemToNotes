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
***REMOVED*** @fileoverview Wrappers for the HTML5 IndexedDB. The wrappers export nearly
***REMOVED*** the same interface as the standard API, but return goog.async.Deferred
***REMOVED*** objects instead of request objects and use Closure events. The wrapper works
***REMOVED*** and has been tested on Chrome version 22+. It may work on older Chrome
***REMOVED*** versions, but they aren't explicitly supported.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***
***REMOVED***  <code>
***REMOVED***  goog.db.openDatabase('mydb', 1, function(ev, db, tx) {
***REMOVED***    db.createObjectStore('mystore');
***REMOVED***  }).addCallback(function(db) {
***REMOVED***    var putTx = db.createTransaction(
***REMOVED***        [],
***REMOVED***        goog.db.Transaction.TransactionMode.READ_WRITE);
***REMOVED***    var store = putTx.objectStore('mystore');
***REMOVED***    store.put('value', 'key');
***REMOVED***    goog.listen(putTx, goog.db.Transaction.EventTypes.COMPLETE, function() {
***REMOVED***      var getTx = db.createTransaction([]);
***REMOVED***      var request = getTx.objectStore('mystore').get('key');
***REMOVED***      request.addCallback(function(result) {
***REMOVED***        ...
***REMOVED***      });
***REMOVED***  });
***REMOVED***  </code>
***REMOVED***
***REMOVED***


goog.provide('goog.db');

goog.require('goog.async.Deferred');
goog.require('goog.db.Error');
goog.require('goog.db.IndexedDb');
goog.require('goog.db.Transaction');


***REMOVED***
***REMOVED*** The IndexedDB factory object.
***REMOVED***
***REMOVED*** @type {IDBFactory}
***REMOVED*** @private
***REMOVED***
goog.db.indexedDb_ = goog.global.indexedDB || goog.global.mozIndexedDB ||
    goog.global.webkitIndexedDB || goog.global.moz_indexedDB;


***REMOVED***
***REMOVED*** A callback that's called if a blocked event is received. When a database is
***REMOVED*** supposed to be deleted or upgraded (i.e. versionchange), and there are open
***REMOVED*** connections to this database, a block event will be fired to prevent the
***REMOVED*** operations from going through until all such open connections are closed.
***REMOVED*** This callback can be used to notify users that they should close other tabs
***REMOVED*** that have open connections, or to close the connections manually. Databases
***REMOVED*** can also listen for the {@link goog.db.IndexedDb.EventType.VERSION_CHANGE}
***REMOVED*** event to automatically close themselves when they're blocking such
***REMOVED*** operations.
***REMOVED***
***REMOVED*** This is passed a VersionChangeEvent that has the version of the database
***REMOVED*** before it was deleted, and "null" as the new version.
***REMOVED***
***REMOVED*** @typedef {function(!goog.db.IndexedDb.VersionChangeEvent)}
***REMOVED***
goog.db.BlockedCallback;


***REMOVED***
***REMOVED*** A callback that's called when opening a database whose internal version is
***REMOVED*** lower than the version passed to {@link goog.db.openDatabase}.
***REMOVED***
***REMOVED*** This callback is passed three arguments: a VersionChangeEvent with both the
***REMOVED*** old version and the new version of the database; the database that's being
***REMOVED*** opened, for which you can create and delete object stores; and the version
***REMOVED*** change transaction, with which you can abort the version change.
***REMOVED***
***REMOVED*** Note that the transaction is not active, which means that it can't be used to
***REMOVED*** make changes to the database. However, since there is a transaction running,
***REMOVED*** you can't create another one via {@link goog.db.IndexedDb.createTransaction}.
***REMOVED*** This means that it's not possible to manipulate the database other than
***REMOVED*** creating or removing object stores in this callback.
***REMOVED***
***REMOVED*** @typedef {function(!goog.db.IndexedDb.VersionChangeEvent,
***REMOVED***                    !goog.db.IndexedDb,
***REMOVED***                    !goog.db.Transaction)}
***REMOVED***
goog.db.UpgradeNeededCallback;


***REMOVED***
***REMOVED*** Opens a database connection and wraps it.
***REMOVED***
***REMOVED*** @param {string} name The name of the database to open.
***REMOVED*** @param {number=} opt_version The expected version of the database. If this is
***REMOVED***     larger than the actual version, opt_onUpgradeNeeded will be called
***REMOVED***     (possibly after opt_onBlocked; see {@link goog.db.BlockedCallback}). If
***REMOVED***     this is passed, opt_onUpgradeNeeded must be passed as well.
***REMOVED*** @param {goog.db.UpgradeNeededCallback=} opt_onUpgradeNeeded Called if
***REMOVED***     opt_version is greater than the old version of the database. If
***REMOVED***     opt_version is passed, this must be passed as well.
***REMOVED*** @param {goog.db.BlockedCallback=} opt_onBlocked Called if there are active
***REMOVED***     connections to the database.
***REMOVED*** @return {!goog.async.Deferred} The deferred database object.
***REMOVED***
goog.db.openDatabase = function(name, opt_version, opt_onUpgradeNeeded,
                                opt_onBlocked) {
  goog.asserts.assert(
      goog.isDef(opt_version) == goog.isDef(opt_onUpgradeNeeded),
      'opt_version must be passed to goog.db.openDatabase if and only if ' +
          'opt_onUpgradeNeeded is also passed');

  var d = new goog.async.Deferred();
  var openRequest = opt_version ?
      goog.db.indexedDb_.open(name, opt_version) :
      goog.db.indexedDb_.open(name);
  openRequest.onsuccess = function(ev) {
    var db = new goog.db.IndexedDb(ev.target.result);
    d.callback(db);
 ***REMOVED*****REMOVED***
  openRequest.onerror = function(ev) {
    var msg = 'opening database ' + name;
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  openRequest.onupgradeneeded = function(ev) {
    if (!opt_onUpgradeNeeded) return;
    var db = new goog.db.IndexedDb(ev.target.result);
    opt_onUpgradeNeeded(
        new goog.db.IndexedDb.VersionChangeEvent(ev.oldVersion, ev.newVersion),
        db,
        new goog.db.Transaction(ev.target.transaction, db));
 ***REMOVED*****REMOVED***
  openRequest.onblocked = function(ev) {
    if (opt_onBlocked) {
      opt_onBlocked(new goog.db.IndexedDb.VersionChangeEvent(
          ev.oldVersion, ev.newVersion));
    }
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Deletes a database once all open connections have been closed.
***REMOVED***
***REMOVED*** @param {string} name The name of the database to delete.
***REMOVED*** @param {goog.db.BlockedCallback=} opt_onBlocked Called if there are active
***REMOVED***     connections to the database.
***REMOVED*** @return {goog.async.Deferred} A deferred object that will fire once the
***REMOVED***     database is deleted.
***REMOVED***
goog.db.deleteDatabase = function(name, opt_onBlocked) {
  var d = new goog.async.Deferred();
  var deleteRequest = goog.db.indexedDb_.deleteDatabase(name);
  deleteRequest.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
  deleteRequest.onerror = function(ev) {
    var msg = 'deleting database ' + name;
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  deleteRequest.onblocked = function(ev) {
    if (opt_onBlocked) {
      opt_onBlocked(new goog.db.IndexedDb.VersionChangeEvent(
          ev.oldVersion, ev.newVersion));
    }
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***
