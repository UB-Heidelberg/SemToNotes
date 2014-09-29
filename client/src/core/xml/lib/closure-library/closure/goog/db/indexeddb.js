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
***REMOVED*** @fileoverview Wrapper for an IndexedDB database.
***REMOVED***
***REMOVED***


goog.provide('goog.db.IndexedDb');

goog.require('goog.async.Deferred');
goog.require('goog.db.Error');
goog.require('goog.db.Error.VersionChangeBlockedError');
goog.require('goog.db.ObjectStore');
goog.require('goog.db.Transaction');
goog.require('goog.db.Transaction.TransactionMode');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Creates an IDBDatabase wrapper object. The database object has methods for
***REMOVED*** setting the version to change the structure of the database and for creating
***REMOVED*** transactions to get or modify the stored records. Should not be created
***REMOVED*** directly, call {@link goog.db.openDatabase} to set up the connection.
***REMOVED***
***REMOVED*** @param {!IDBDatabase} db Underlying IndexedDB database object.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.db.IndexedDb = function(db) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying IndexedDB database object.
  ***REMOVED***
  ***REMOVED*** @type {!IDBDatabase}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.db_ = db;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Internal event handler that listens to IDBDatabase events.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  this.eventHandler_.listen(
      this.db_,
      goog.db.IndexedDb.EventType.ABORT,
      goog.bind(
          this.dispatchEvent,
          this,
          goog.db.IndexedDb.EventType.ABORT));
  this.eventHandler_.listen(
      this.db_,
      goog.db.IndexedDb.EventType.ERROR,
      this.dispatchError_);
  this.eventHandler_.listen(
      this.db_,
      goog.db.IndexedDb.EventType.VERSION_CHANGE,
      this.dispatchVersionChange_);
***REMOVED***
goog.inherits(goog.db.IndexedDb, goog.events.EventTarget);


***REMOVED***
***REMOVED*** True iff the database connection is open.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.db.IndexedDb.prototype.open_ = true;


***REMOVED***
***REMOVED*** Dispatches a wrapped error event based on the given event.
***REMOVED***
***REMOVED*** @param {Event} ev The error event given to the underlying IDBDatabase.
***REMOVED*** @private
***REMOVED***
goog.db.IndexedDb.prototype.dispatchError_ = function(ev) {
  this.dispatchEvent({
    type: goog.db.IndexedDb.EventType.ERROR,
    errorCode:***REMOVED*****REMOVED*** @type {IDBRequest}***REMOVED*** (ev.target).errorCode
  });
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches a wrapped version change event based on the given event.
***REMOVED***
***REMOVED*** @param {Event} ev The version change event given to the underlying
***REMOVED***     IDBDatabase.
***REMOVED*** @private
***REMOVED***
goog.db.IndexedDb.prototype.dispatchVersionChange_ = function(ev) {
  this.dispatchEvent(new goog.db.IndexedDb.VersionChangeEvent(
      ev.oldVersion, ev.newVersion));
***REMOVED***


***REMOVED***
***REMOVED*** Closes the database connection. Metadata queries can still be made after this
***REMOVED*** method is called, but otherwise this wrapper should not be used further.
***REMOVED***
goog.db.IndexedDb.prototype.close = function() {
  if (this.open_) {
    this.db_.close();
    this.open_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether a connection is open and the database can be used.
***REMOVED***
goog.db.IndexedDb.prototype.isOpen = function() {
  return this.open_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The name of this database.
***REMOVED***
goog.db.IndexedDb.prototype.getName = function() {
  return this.db_.name;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The current database version.
***REMOVED***
goog.db.IndexedDb.prototype.getVersion = function() {
  return this.db_.version;
***REMOVED***


***REMOVED***
***REMOVED*** @return {DOMStringList} List of object stores in this database.
***REMOVED***
goog.db.IndexedDb.prototype.getObjectStoreNames = function() {
  return this.db_.objectStoreNames;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an object store in this database. Can only be called inside a
***REMOVED*** {@link goog.db.UpgradeNeededCallback} or the callback for the Deferred
***REMOVED*** returned from #setVersion.
***REMOVED***
***REMOVED*** @param {string} name Name for the new object store.
***REMOVED*** @param {Object=} opt_params Options object. The available options are:
***REMOVED***     keyPath, which is a string and determines what object attribute
***REMOVED***     to use as the key when storing objects in this object store; and
***REMOVED***     autoIncrement, which is a boolean, which defaults to false and determines
***REMOVED***     whether the object store should automatically generate keys for stored
***REMOVED***     objects. If keyPath is not provided and autoIncrement is false, then all
***REMOVED***     insert operations must provide a key as a parameter.
***REMOVED*** @return {goog.db.ObjectStore} The newly created object store.
***REMOVED*** @throws {goog.db.Error} If there's a problem creating the object store.
***REMOVED***
goog.db.IndexedDb.prototype.createObjectStore = function(name, opt_params) {
  try {
    return new goog.db.ObjectStore(this.db_.createObjectStore(
        name, opt_params));
  } catch (ex) {
    throw goog.db.Error.fromException(ex, 'creating object store ' + name);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Deletes an object store. Can only be called inside a
***REMOVED*** {@link goog.db.UpgradeNeededCallback} or the callback for the Deferred
***REMOVED*** returned from #setVersion.
***REMOVED***
***REMOVED*** @param {string} name Name of the object store to delete.
***REMOVED*** @throws {goog.db.Error} If there's a problem deleting the object store.
***REMOVED***
goog.db.IndexedDb.prototype.deleteObjectStore = function(name) {
  try {
    this.db_.deleteObjectStore(name);
  } catch (ex) {
    throw goog.db.Error.fromException(ex, 'deleting object store ' + name);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the version of the database and returns a Deferred transaction.
***REMOVED*** The database's structure can be changed inside this Deferred's callback, but
***REMOVED*** nowhere else. This means adding or deleting object stores, and adding or
***REMOVED*** deleting indexes. The version change will not succeed unless there are no
***REMOVED*** other connections active for this database anywhere. A new database
***REMOVED*** connection should be opened after the version change is finished to pick
***REMOVED*** up changes.
***REMOVED***
***REMOVED*** This is deprecated, and only supported on Chrome prior to version 25. New
***REMOVED*** applications should use the version parameter to {@link goog.db.openDatabase}
***REMOVED*** instead.
***REMOVED***
***REMOVED*** @param {string} version The new version of the database.
***REMOVED*** @return {!goog.async.Deferred} The deferred transaction for changing the
***REMOVED***     version.
***REMOVED***
goog.db.IndexedDb.prototype.setVersion = function(version) {
***REMOVED***
  var d = new goog.async.Deferred();
  var request = this.db_.setVersion(version);
  request.onsuccess = function(ev) {
    // the transaction is in the result field (the transaction field is null
    // for version change requests)
    d.callback(new goog.db.Transaction(ev.target.result, self));
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    // If a version change is blocked, onerror and onblocked may both fire.
    // Check d.hasFired() to avoid an AlreadyCalledError.
    if (!d.hasFired()) {
      d.errback(goog.db.Error.fromRequest(ev.target, 'setting version'));
    }
 ***REMOVED*****REMOVED***
  request.onblocked = function(ev) {
    // If a version change is blocked, onerror and onblocked may both fire.
    // Check d.hasFired() to avoid an AlreadyCalledError.
    if (!d.hasFired()) {
      d.errback(new goog.db.Error.VersionChangeBlockedError());
    }
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new transaction.
***REMOVED***
***REMOVED*** @param {!Array.<string>} storeNames A list of strings that contains the
***REMOVED***     transaction's scope, the object stores that this transaction can operate
***REMOVED***     on.
***REMOVED*** @param {goog.db.Transaction.TransactionMode=} opt_mode The mode of the
***REMOVED***     transaction. If not present, the default is READ_ONLY. For VERSION_CHANGE
***REMOVED***     transactions call {@link goog.db.IndexedDB#setVersion} instead.
***REMOVED*** @return {!goog.db.Transaction} The wrapper for the newly created transaction.
***REMOVED*** @throws {goog.db.Error} If there's a problem creating the transaction.
***REMOVED***
goog.db.IndexedDb.prototype.createTransaction = function(storeNames, opt_mode) {
  try {
    // IndexedDB on Chrome 22+ requires that opt_mode not be passed rather than
    // be explicitly passed as undefined.
    var transaction = opt_mode ?
        this.db_.transaction(storeNames, opt_mode) :
        this.db_.transaction(storeNames);
    return new goog.db.Transaction(transaction, this);
  } catch (ex) {
    throw goog.db.Error.fromException(ex, 'creating transaction');
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.db.IndexedDb.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.eventHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Event types fired by a database.
***REMOVED***
***REMOVED*** @enum {string} The event types for the web socket.
***REMOVED***
goog.db.IndexedDb.EventType = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when a transaction is aborted and the event bubbles to its database.
 ***REMOVED*****REMOVED***
  ABORT: 'abort',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when a transaction has an error.
 ***REMOVED*****REMOVED***
  ERROR: 'error',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when someone (possibly in another window) is attempting to modify the
  ***REMOVED*** structure of the database. Since a change can only be made when there are
  ***REMOVED*** no active database connections, this usually means that the database should
  ***REMOVED*** be closed so that the other client can make its changes.
 ***REMOVED*****REMOVED***
  VERSION_CHANGE: 'versionchange'
***REMOVED***



***REMOVED***
***REMOVED*** Event representing a (possibly attempted) change in the database structure.
***REMOVED***
***REMOVED*** At time of writing, no Chrome versions support oldVersion or newVersion. See
***REMOVED*** http://crbug.com/153122.
***REMOVED***
***REMOVED*** @param {number} oldVersion The previous version of the database.
***REMOVED*** @param {number} newVersion The version the database is being or has been
***REMOVED***     updated to.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.db.IndexedDb.VersionChangeEvent = function(oldVersion, newVersion) {
  goog.base(this, goog.db.IndexedDb.EventType.VERSION_CHANGE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The previous version of the database.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.oldVersion = oldVersion;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The version the database is being or has been updated to.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.newVersion = newVersion;
***REMOVED***
goog.inherits(goog.db.IndexedDb.VersionChangeEvent, goog.events.Event);
