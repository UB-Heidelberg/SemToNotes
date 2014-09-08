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
***REMOVED*** @fileoverview Wrapper for an IndexedDB transaction.
***REMOVED***
***REMOVED***


goog.provide('goog.db.Transaction');
goog.provide('goog.db.Transaction.TransactionMode');

goog.require('goog.async.Deferred');
goog.require('goog.db.Error');
goog.require('goog.db.ObjectStore');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Creates a new transaction. Transactions contain methods for accessing object
***REMOVED*** stores and are created from the database object. Should not be created
***REMOVED*** directly, open a database and call createTransaction on it.
***REMOVED*** @see goog.db.IndexedDb#createTransaction
***REMOVED***
***REMOVED*** @param {!IDBTransaction} tx IndexedDB transaction to back this wrapper.
***REMOVED*** @param {!goog.db.IndexedDb} db The database that this transaction modifies.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.db.Transaction = function(tx, db) {
  goog.db.Transaction.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying IndexedDB transaction object.
  ***REMOVED***
  ***REMOVED*** @type {!IDBTransaction}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tx_ = tx;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The database that this transaction modifies.
  ***REMOVED***
  ***REMOVED*** @type {!goog.db.IndexedDb}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.db_ = db;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for this transaction.
  ***REMOVED***
  ***REMOVED*** @type {!goog.events.EventHandler.<!goog.db.Transaction>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  // TODO(user): remove these casts once the externs file is updated to
  // correctly reflect that IDBTransaction extends EventTarget
  this.eventHandler_.listen(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (this.tx_),
      'complete',
      goog.bind(
          this.dispatchEvent,
          this,
          goog.db.Transaction.EventTypes.COMPLETE));
  this.eventHandler_.listen(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (this.tx_),
      'abort',
      goog.bind(
          this.dispatchEvent,
          this,
          goog.db.Transaction.EventTypes.ABORT));
  this.eventHandler_.listen(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (this.tx_),
      'error',
      this.dispatchError_);
***REMOVED***
goog.inherits(goog.db.Transaction, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Dispatches an error event based on the given event, wrapping the error
***REMOVED*** if necessary.
***REMOVED***
***REMOVED*** @param {Event} ev The error event given to the underlying IDBTransaction.
***REMOVED*** @private
***REMOVED***
goog.db.Transaction.prototype.dispatchError_ = function(ev) {
  if (ev.target instanceof goog.db.Error) {
    this.dispatchEvent({
      type: goog.db.Transaction.EventTypes.ERROR,
      target: ev.target
    });
  } else {
    this.dispatchEvent({
      type: goog.db.Transaction.EventTypes.ERROR,
      target: goog.db.Error.fromRequest(
         ***REMOVED*****REMOVED*** @type {!IDBRequest}***REMOVED*** (ev.target), 'in transaction')
    });
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event types the Transaction can dispatch. COMPLETE events are dispatched
***REMOVED*** when the transaction is committed. If a transaction is aborted it dispatches
***REMOVED*** both an ABORT event and an ERROR event with the ABORT_ERR code. Error events
***REMOVED*** are dispatched on any error.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.db.Transaction.EventTypes = {
  COMPLETE: 'complete',
  ABORT: 'abort',
  ERROR: 'error'
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.db.Transaction.TransactionMode} The transaction's mode.
***REMOVED***
goog.db.Transaction.prototype.getMode = function() {
  return***REMOVED*****REMOVED*** @type {goog.db.Transaction.TransactionMode}***REMOVED*** (this.tx_.mode);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.db.IndexedDb} The database that this transaction modifies.
***REMOVED***
goog.db.Transaction.prototype.getDatabase = function() {
  return this.db_;
***REMOVED***


***REMOVED***
***REMOVED*** Opens an object store to do operations on in this transaction. The requested
***REMOVED*** object store must be one that is in this transaction's scope.
***REMOVED*** @see goog.db.IndexedDb#createTransaction
***REMOVED***
***REMOVED*** @param {string} name The name of the requested object store.
***REMOVED*** @return {!goog.db.ObjectStore} The wrapped object store.
***REMOVED*** @throws {goog.db.Error} In case of error getting the object store.
***REMOVED***
goog.db.Transaction.prototype.objectStore = function(name) {
  try {
    return new goog.db.ObjectStore(this.tx_.objectStore(name));
  } catch (ex) {
    throw goog.db.Error.fromException(ex, 'getting object store ' + name);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} A deferred that will fire once the
***REMOVED***     transaction is complete. It fires the errback chain if an error occurs
***REMOVED***     in the transaction, or if it is aborted.
***REMOVED***
goog.db.Transaction.prototype.wait = function() {
  var d = new goog.async.Deferred();
  goog.events.listenOnce(
      this, goog.db.Transaction.EventTypes.COMPLETE, goog.bind(d.callback, d));
  goog.events.listenOnce(
      this, goog.db.Transaction.EventTypes.ABORT, function() {
        d.errback(new goog.db.Error(goog.db.Error.ErrorCode.ABORT_ERR,
            'waiting for transaction to complete'));
      });
  goog.events.listenOnce(
      this, goog.db.Transaction.EventTypes.ERROR, function(e) {
        d.errback(e.target);
      });

  var db = this.getDatabase();
  return d.addCallback(function() {
    return db;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Aborts this transaction. No pending operations will be applied to the
***REMOVED*** database. Dispatches an ABORT event.
***REMOVED***
goog.db.Transaction.prototype.abort = function() {
  this.tx_.abort();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.db.Transaction.prototype.disposeInternal = function() {
  goog.db.Transaction.base(this, 'disposeInternal');
  this.eventHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** The three possible transaction modes.
***REMOVED*** @see http://www.w3.org/TR/IndexedDB/#idl-def-IDBTransaction
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.db.Transaction.TransactionMode = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite',
  VERSION_CHANGE: 'versionchange'
***REMOVED***
