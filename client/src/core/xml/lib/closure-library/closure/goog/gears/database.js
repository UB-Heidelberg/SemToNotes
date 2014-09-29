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
***REMOVED*** @fileoverview This file contains functions for using the Gears database.
***REMOVED***

goog.provide('goog.gears.Database');
goog.provide('goog.gears.Database.EventType');
goog.provide('goog.gears.Database.TransactionEvent');

goog.require('goog.array');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.gears');
goog.require('goog.json');



***REMOVED***
***REMOVED*** Class that for accessing a Gears database
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @param {string} userId the id token for this user.
***REMOVED*** @param {string} appName  the name of the application creating this database.
***REMOVED***
goog.gears.Database = function(userId, appName) {
  goog.events.EventTarget.call(this);

  var factory = goog.gears.getFactory();
  try {
   ***REMOVED*****REMOVED***
    ***REMOVED*** The pointer to the Gears database object
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.database_ = factory.create('beta.database', '1.0');
  } catch (ex) {
    // We will fail here if we cannot get a version of the database that is
    // compatible with the JS code.
    throw Error('Could not create the database. ' + ex.message);
  }

  if (this.database_ != null) {
    var dbId = userId + '-' + appName;
    var safeDbId = goog.gears.makeSafeFileName(dbId);
    if (dbId != safeDbId) {
      this.logger_.info('database name ' + dbId + '->' + safeDbId);
    }
    this.safeDbId_ = safeDbId;
    this.database_.open(safeDbId);
  } else {
    throw Error('Could not create the database');
  }
***REMOVED***
goog.inherits(goog.gears.Database, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Constants for transaction event names.
***REMOVED*** @enum {string}
***REMOVED***
goog.gears.Database.EventType = {
  BEFOREBEGIN: 'beforebegin',
  BEGIN: 'begin',
  BEFORECOMMIT: 'beforecommit',
  COMMIT: 'commit',
  BEFOREROLLBACK: 'beforerollback',
  ROLLBACK: 'rollback'
***REMOVED***



***REMOVED***
***REMOVED*** Event info for transaction events.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @param {goog.gears.Database.EventType} eventType The type of event.
***REMOVED***
goog.gears.Database.TransactionEvent = function(eventType) {
  goog.events.Event.call(this, eventType);
***REMOVED***
goog.inherits(goog.gears.Database.TransactionEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Logger object
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.gears.Database.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.gears.Database');


***REMOVED***
***REMOVED*** The safe name of the database.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.gears.Database.prototype.safeDbId_;


***REMOVED***
***REMOVED*** True if the database will be using transactions
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.gears.Database.prototype.useTransactions_ = true;


***REMOVED***
***REMOVED*** Number of currently openned transactions. Use this to allow
***REMOVED*** for nested Begin/Commit transactions. Will only do the real
***REMOVED*** commit when this equals 0
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.gears.Database.prototype.openTransactions_ = 0;


***REMOVED***
***REMOVED*** True if the outstanding opened transactions need to be rolled back
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.gears.Database.prototype.needsRollback_ = false;


***REMOVED***
***REMOVED*** The default type of begin statement to use.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.gears.Database.prototype.defaultBeginType_ = 'IMMEDIATE';


***REMOVED***
***REMOVED*** Indicaton of the level of the begin. This is used to make sure
***REMOVED*** nested begins do not elivate the level of the begin.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.gears.Database.BeginLevels_ = {
  'DEFERRED': 0,
  'IMMEDIATE': 1,
  'EXCLUSIVE': 2
***REMOVED***


***REMOVED***
***REMOVED*** The begin level of the currently opened transaction
***REMOVED*** @type {goog.gears.Database.BeginLevels_}
***REMOVED*** @private
***REMOVED***
goog.gears.Database.prototype.currentBeginLevel_ =
    goog.gears.Database.BeginLevels_['DEFERRED'];


***REMOVED***
***REMOVED*** Returns an array of arrays, where each sub array contains the selected
***REMOVED*** values for each row in the result set.
***REMOVED*** result values
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {Array} An array of arrays. Returns an empty array if
***REMOVED***                  there are no matching rows.
***REMOVED***
goog.gears.Database.resultSetToArrays = function(rs) {
  var rv = [];
  if (rs) {
    var cols = rs['fieldCount']();
    while (rs['isValidRow']()) {
      var row = new Array(cols);
      for (var i = 0; i < cols; i++) {
        row[i] = rs['field'](i);
      }
      rv.push(row);
      rs['next']();
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a array of hash objects, one per row in the result set,
***REMOVED*** where the column names in the query are used as the members of
***REMOVED*** the object.
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {Array.<Object>} An array containing hashes. Returns an empty
***REMOVED***     array if there are no matching rows.
***REMOVED***
goog.gears.Database.resultSetToObjectArray = function(rs) {
  var rv = [];
  if (rs) {
    var cols = rs['fieldCount']();
    var colNames = [];
    for (var i = 0; i < cols; i++) {
      colNames.push(rs['fieldName'](i));
    }

    while (rs['isValidRow']()) {
      var h = {***REMOVED***
      for (var i = 0; i < cols; i++) {
        h[colNames[i]] = rs['field'](i);
      }
      rv.push(h);
      rs['next']();
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array containing the first item of each row in a result set.
***REMOVED*** This is useful for query that returns one column
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {Array.<Object>} An array containing the values in the first column
***REMOVED***                     Returns an empty array if there are no matching rows.
***REMOVED***
goog.gears.Database.resultSetToValueArray = function(rs) {
  var rv = [];
  if (rs) {
    while (rs['isValidRow']()) {
      rv.push(rs['field'](0));
      rs['next']();
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a single value from the results (first column in first row).
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {(number,string,null)} The first item in the first row of the
***REMOVED***     result set. Returns null if there are no matching rows.
***REMOVED***
goog.gears.Database.resultSetToValue = function(rs) {
  if (rs && rs['isValidRow']()) {
    return rs['field'](0);
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns a single hashed object from the result set (the first row),
***REMOVED*** where the column names in the query are used as the members of
***REMOVED*** the object.
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {Object} a hash map with the key-value-pairs from the first row.
***REMOVED***     Returns null is there are no matching rows.
***REMOVED***
goog.gears.Database.resultSetToObject = function(rs) {
  if (rs && rs['isValidRow']()) {
    var rv = {***REMOVED***
    var cols = rs['fieldCount']();
    for (var i = 0; i < cols; i++) {
      rv[rs['fieldName'](i)] = rs['field'](i);
    }
    return rv;
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of the first row in the result set
***REMOVED***
***REMOVED*** @param {GearsResultSet} rs the result set returned by execute.
***REMOVED*** @return {Array} An array containing the values in the
***REMOVED***     first result set. Returns an empty array if there no
***REMOVED***     matching rows.
***REMOVED***
goog.gears.Database.resultSetToArray = function(rs) {
  var rv = [];
  if (rs && rs['isValidRow']()) {
    var cols = rs['fieldCount']();
    for (var i = 0; i < cols; i++) {
      rv[i] = rs['field'](i);
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Execute a sql statement with a set of arguments
***REMOVED***
***REMOVED*** @param {string} sql The sql statement to execute.
***REMOVED*** @param {...*} var_args The arguments to execute, either as a single
***REMOVED*** array argument or as var_args.
***REMOVED*** @return {GearsResultSet} The results.
***REMOVED***
goog.gears.Database.prototype.execute = function(sql, var_args) {
  this.logger_.finer('Executing SQL: ' + sql);

  // TODO(user): Remove when Gears adds more rubust type handling.
  // Safety measure since Gears behaves very badly if it gets an unexpected
  // data type.
  sql = String(sql);

  var args;
  try {
    if (arguments.length == 1) {
      return this.database_.execute(sql);
    }

    if (arguments.length == 2 && goog.isArray(arguments[1])) {
      args = arguments[1];
    } else {
      args = goog.array.slice(arguments, 1);
    }
    this.logger_.finest('SQL arguments: ' + args);

    // TODO(user): Type safety checking for args?
    return this.database_.execute(sql, args);
  } catch (e) {
    if (args) {
      sql += ': ' + goog.json.serialize(args);
    }

    throw goog.debug.enhanceError(e, sql);
  }
***REMOVED***


***REMOVED***
***REMOVED*** This is useful to remove all the arguments juggling from inside the
***REMOVED*** different helper functions.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} sql The SQL statement.
***REMOVED*** @param {Object} params An Array or arguments Object containing the query
***REMOVED***     params. If the element at startIndex is an array, it will be used as
***REMOVED***     the arguments passed to the execute method.
***REMOVED*** @param {number} startIndex Where to start getting the query params from
***REMOVED***     params.
***REMOVED*** @return {GearsResultSet} The results of the command.
***REMOVED***
goog.gears.Database.prototype.executeVarArgs_ = function(sql, params,
                                                         startIndex) {
  if (params.length == 0 || startIndex >= params.length) {
    return this.execute(sql);
  } else {
    if (goog.isArray(params[startIndex])) {
      return this.execute(sql, params[startIndex]);
    }
    var args = Array.prototype.slice.call(
       ***REMOVED*****REMOVED*** @type {{length:number}}***REMOVED*** (params), startIndex);
    return this.execute(sql, args);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper methods for queryArrays, queryObjectArray, queryValueArray,
***REMOVED*** queryValue, queryObject.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} sql The SQL statement.
***REMOVED*** @param {Function} f The function to call on the result set.
***REMOVED*** @param {Object} params query params as an Array or an arguments object. If
***REMOVED***     the element at startIndex is an array, it will be used as the arguments
***REMOVED***     passed to the execute method.
***REMOVED*** @param {number} startIndex Where to start getting the query params from
***REMOVED***     params.
***REMOVED*** @return {(Object,number,string,boolean,undefined,null)} whatever 'f'
***REMOVED***     returns, which could be any type.
***REMOVED***
goog.gears.Database.prototype.queryObject_ = function(sql,
    f, params, startIndex) {
  var rs = this.executeVarArgs_(sql, params, startIndex);
  try {
    return f(rs);
  } finally {
    if (rs) {
      rs.close();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and builds a two dimensional array
***REMOVED*** containing the result.
***REMOVED***
***REMOVED*** @param {string} sql The SQL statement.
***REMOVED*** @param {...*} var_args Query params. An array or multiple arguments.
***REMOVED*** @return {Array} An array of arrays containing the results of the query.
***REMOVED***
goog.gears.Database.prototype.queryArrays = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToArrays,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and builds an array containing hashes
***REMOVED***
***REMOVED*** @param {string} sql Ths SQL statement.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED*** @return {Array} An array of hashes containing the results of the query.
***REMOVED***
goog.gears.Database.prototype.queryObjectArray = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToObjectArray,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and returns an array containing the values
***REMOVED*** in the first column. This is useful if the result set only contains one
***REMOVED*** column.
***REMOVED***
***REMOVED*** @param {string} sql SQL statement.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED*** @return {Array} The values in the first column.
***REMOVED***
goog.gears.Database.prototype.queryValueArray = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToValueArray,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and returns the first value in the first
***REMOVED*** row.
***REMOVED***
***REMOVED*** @param {string} sql SQL statement.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED*** @return {(number,string,null)} The first value in
***REMOVED***     the first row.
***REMOVED***
goog.gears.Database.prototype.queryValue = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {(number,string,null)}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToValue,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and returns the first row as a hash map
***REMOVED*** where the keys are the column names.
***REMOVED***
***REMOVED*** @param {string} sql SQL statement.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED*** @return {Object} The first row as a hash map.
***REMOVED***
goog.gears.Database.prototype.queryObject = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToObject,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** This calls query on the database and returns the first row as an array
***REMOVED***
***REMOVED*** @param {string} sql SQL statement.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED*** @return {Array} The first row as an array.
***REMOVED***
goog.gears.Database.prototype.queryArray = function(sql, var_args) {
  return***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.queryObject_(sql,
      goog.gears.Database.resultSetToArray,
      arguments,
      1));
***REMOVED***


***REMOVED***
***REMOVED*** For each value in the result set f will be called with the following
***REMOVED*** parameters; value, rowIndex, columnIndex, columnName. Values will continue
***REMOVED*** being processed as long as f returns true.
***REMOVED***
***REMOVED*** @param {string} sql The SQL statement to execute.
***REMOVED*** @param {Function} f Function to call for each value.
***REMOVED*** @param {Object=} opt_this If present f will be called using this object as
***REMOVED***                          'this'.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED***
goog.gears.Database.prototype.forEachValue = function(sql,
    f, opt_this, var_args) {
  var rs = this.executeVarArgs_(sql, arguments, 3);
  try {
    var rowIndex = 0;
    var cols = rs['fieldCount']();
    var colNames = [];
    for (var i = 0; i < cols; i++) {
      colNames.push(rs['fieldName'](i));
    }

    mainLoop: while (rs['isValidRow']()) {
      for (var i = 0; i < cols; i++) {
        if (!f.call(opt_this, rs['field'](i), rowIndex, i, colNames[i])) {
          break mainLoop;
        }
      }
      rs['next']();
      rowIndex++;
    }
  } finally {
    rs.close();
  }
***REMOVED***


***REMOVED***
***REMOVED*** For each row in the result set f will be called with the following
***REMOVED*** parameters: row (array of values), rowIndex and columnNames.  Rows will
***REMOVED*** continue being processed as long as f returns true.
***REMOVED***
***REMOVED*** @param {string} sql The SQL statement to execute.
***REMOVED*** @param {Function} f Function to call for each row.
***REMOVED*** @param {Object=} opt_this If present f will be called using this
***REMOVED***                          object as 'this'.
***REMOVED*** @param {...*} var_args query params. An array or multiple arguments.
***REMOVED***
goog.gears.Database.prototype.forEachRow = function(sql,
    f, opt_this, var_args) {
  var rs = this.executeVarArgs_(sql, arguments, 3);
  try {
    var rowIndex = 0;
    var cols = rs['fieldCount']();
    var colNames = [];
    for (var i = 0; i < cols; i++) {
      colNames.push(rs['fieldName'](i));
    }

    var row;
    while (rs['isValidRow']()) {
      row = [];
      for (var i = 0; i < cols; i++) {
        row.push(rs['field'](i));
      }
      if (!f.call(opt_this, row, rowIndex, colNames)) {
        break;
      }
      rs['next']();
      rowIndex++;
    }
  } finally {
    rs.close();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Executes a function transactionally.
***REMOVED***
***REMOVED*** @param {Function} func the function to execute transactionally.
***REMOVED*** Takes no params.
***REMOVED*** @return {Object|number|boolean|string|null|undefined} the return value
***REMOVED***     of 'func()'.
***REMOVED***
goog.gears.Database.prototype.transact = function(func) {
  this.begin();
  try {
    var result = func();
    this.commit();
  } catch (e) {
    this.rollback(e);
    throw e;
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Helper that performs either a COMMIT or ROLLBACK command and dispatches
***REMOVED*** pre/post commit/rollback events.
***REMOVED***
***REMOVED*** @private
***REMOVED***
***REMOVED*** @param {boolean} rollback Whether to rollback or commit.
***REMOVED*** @return {boolean} True if the transaction was closed, false otherwise.
***REMOVED***
goog.gears.Database.prototype.closeTransaction_ = function(rollback) {
  // Send before rollback/commit event
  var cmd;
  var eventType;
  cmd = rollback ? 'ROLLBACK' : 'COMMIT';
  eventType = rollback ? goog.gears.Database.EventType.BEFOREROLLBACK :
      goog.gears.Database.EventType.BEFORECOMMIT;
  var event = new goog.gears.Database.TransactionEvent(eventType);
  var returnValue = this.dispatchEvent(event);

  // Only commit/rollback and send events if none of the event listeners
  // called preventDefault().
  if (returnValue) {
    this.database_.execute(cmd);
    this.openTransactions_ = 0;
    eventType = rollback ? goog.gears.Database.EventType.ROLLBACK :
        goog.gears.Database.EventType.COMMIT;
    this.dispatchEvent(new goog.gears.Database.TransactionEvent(eventType));
  }

  return returnValue;
***REMOVED***


***REMOVED***
***REMOVED*** Whether transactions are used for the database
***REMOVED***
***REMOVED*** @param {boolean} b Whether to use transactions or not.
***REMOVED***
goog.gears.Database.prototype.setUseTransactions = function(b) {
  this.useTransactions_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** Whether transactions are used for the database
***REMOVED***
***REMOVED*** @return {boolean} true if transactions should be used.
***REMOVED***
goog.gears.Database.prototype.getUseTransactions = function() {
  return this.useTransactions_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default begin type.
***REMOVED***
***REMOVED*** @param {string} beginType The default begin type.
***REMOVED***
goog.gears.Database.prototype.setDefaultBeginType = function(beginType) {
  if (beginType in goog.gears.Database.BeginLevels_) {
    this.defaultBeginType_ = beginType;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Marks the beginning of a database transaction. Does a real BEGIN operation
***REMOVED*** if useTransactions is true for this database and the this is the first
***REMOVED*** opened transaction
***REMOVED*** @private
***REMOVED***
***REMOVED*** @param {string} beginType the type of begin comand.
***REMOVED*** @return {boolean} true if the BEGIN has been executed.
***REMOVED***
goog.gears.Database.prototype.beginTransaction_ = function(beginType) {
  if (this.useTransactions_) {
    if (this.openTransactions_ == 0) {
      this.needsRollback_ = false;
      this.dispatchEvent(
          new goog.gears.Database.TransactionEvent(
              goog.gears.Database.EventType.BEFOREBEGIN));
      this.database_.execute('BEGIN ' + beginType);
      this.currentBeginLevel_ =
          goog.gears.Database.BeginLevels_[beginType];
      this.openTransactions_ = 1;
      try {
        this.dispatchEvent(
            new goog.gears.Database.TransactionEvent(
                goog.gears.Database.EventType.BEGIN));
      } catch (e) {
        this.database_.execute('ROLLBACK');
        this.openTransactions_ = 0;
        throw e;
      }
      return true;
    } else if (this.needsRollback_) {
      throw Error(
          'Cannot begin a transaction with a rollback pending');
    } else if (goog.gears.Database.BeginLevels_[beginType] >
               this.currentBeginLevel_) {
      throw Error(
          'Cannot elevate the level within a nested begin');
    } else {
      this.openTransactions_++;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Marks the beginning of a database transaction using the default begin
***REMOVED*** type. Does a real BEGIN operation if useTransactions is true for this
***REMOVED*** database and this is the first opened transaction. This will throw
***REMOVED*** an exception if this is a nested begin and is trying to elevate the
***REMOVED*** begin type from the original BEGIN that was processed.
***REMOVED***
***REMOVED*** @return {boolean} true if the BEGIN has been executed.
***REMOVED***
goog.gears.Database.prototype.begin = function() {
  return this.beginTransaction_(this.defaultBeginType_);
***REMOVED***


***REMOVED***
***REMOVED*** Marks the beginning of a deferred database transaction.
***REMOVED*** Does a real BEGIN operation if useTransactions is true for this
***REMOVED*** database and this is the first opened transaction.
***REMOVED***
***REMOVED*** @return {boolean} true if the BEGIN has been executed.
***REMOVED***
goog.gears.Database.prototype.beginDeferred = function() {
  return this.beginTransaction_('DEFERRED');
***REMOVED***


***REMOVED***
***REMOVED*** Marks the beginning of an immediate database transaction.
***REMOVED*** Does a real BEGIN operation if useTransactions is true for this
***REMOVED*** database and this is the first opened transaction. This will throw
***REMOVED*** an exception if this is a nested begin and is trying to elevate the
***REMOVED*** begin type from the original BEGIN that was processed.
***REMOVED***
***REMOVED*** @return {boolean} true if the BEGIN has been executed.
***REMOVED***
goog.gears.Database.prototype.beginImmediate = function() {
  return this.beginTransaction_('IMMEDIATE');
***REMOVED***


***REMOVED***
***REMOVED*** Marks the beginning of an exclusive database transaction.
***REMOVED*** Does a real BEGIN operation if useTransactions is true for this
***REMOVED*** database and this is the first opened transaction. This will throw
***REMOVED*** an exception if this is a nested begin and is trying to elevate the
***REMOVED*** begin type from the original BEGIN that was processed.
***REMOVED***
***REMOVED*** @return {boolean} true if the BEGIN has been executed.
***REMOVED***
goog.gears.Database.prototype.beginExclusive = function() {
  return this.beginTransaction_('EXCLUSIVE');
***REMOVED***


***REMOVED***
***REMOVED*** Marks the end of a successful transaction. Will do a real COMMIT
***REMOVED*** if this the last outstanding transaction unless a nested transaction
***REMOVED*** was closed with a ROLLBACK in which case a real ROLLBACK will be performed.
***REMOVED***
***REMOVED*** @return {boolean} true if the COMMIT has been executed.
***REMOVED***
goog.gears.Database.prototype.commit = function() {
  if (this.useTransactions_) {
    if (this.openTransactions_ <= 0) {
      throw Error('Unbalanced transaction');
    }

    // Only one left.
    if (this.openTransactions_ == 1) {
      var closed = this.closeTransaction_(this.needsRollback_);
      return !this.needsRollback_ && closed;
    } else {
      this.openTransactions_--;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Marks the end of an unsuccessful transaction. Will do a real ROLLBACK
***REMOVED*** if this the last outstanding transaction, otherwise the real ROLLBACK will
***REMOVED*** be deferred until the last outstanding transaction is closed.
***REMOVED***
***REMOVED*** @param {Error=} opt_e the exception that caused this rollback. If it
***REMOVED***                          is provided then that exception is rethown if
***REMOVED***                          the rollback does not take place.
***REMOVED*** @return {boolean} true if the ROLLBACK has been executed or if we are not
***REMOVED***                   using transactions.
***REMOVED***
goog.gears.Database.prototype.rollback = function(opt_e) {
  var closed = true;
  if (this.useTransactions_) {
    if (this.openTransactions_ <= 0) {
      throw Error('Unbalanced transaction');
    }
    // Only one left.
    if (this.openTransactions_ == 1) {
      closed = this.closeTransaction_(true);
    } else {
      this.openTransactions_--;
      this.needsRollback_ = true;
      if (opt_e) {
        throw opt_e;
      }
      return false;
    }
  }

  return closed;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not we're in a transaction.
***REMOVED***
***REMOVED*** @return {boolean} true if a transaction has been started and is not yet
***REMOVED***                   complete.
***REMOVED***
goog.gears.Database.prototype.isInTransaction = function() {
  return this.useTransactions_ && this.openTransactions_ > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Ensures there is no open transaction upon return. An existing open
***REMOVED*** transaction is rolled back.
***REMOVED***
***REMOVED*** @param {string=} opt_logMsgPrefix a prefix to the message that is logged when
***REMOVED***     an unexpected open transaction is found.
***REMOVED***
goog.gears.Database.prototype.ensureNoTransaction = function(opt_logMsgPrefix) {
  if (this.isInTransaction()) {
    this.logger_.warning((opt_logMsgPrefix || 'ensureNoTransaction') +
                         ' - rolling back unexpected transaction');
    do {
      this.rollback();
    } while (this.isInTransaction());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not the current transaction has a pending rollback.
***REMOVED*** Returns false if there is no current transaction.
***REMOVED***
***REMOVED*** @return {boolean} Whether a started transaction has a rollback pending.
***REMOVED***
goog.gears.Database.prototype.needsRollback = function() {
  return this.useTransactions_ &&
         this.openTransactions_ > 0 &&
         this.needsRollback_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the time in Ms that database operations have currently
***REMOVED*** consumed. This only exists in debug builds, but it still may be useful
***REMOVED*** for goog.gears.Trace.
***REMOVED***
***REMOVED*** @return {number} The time in Ms that database operations have currently
***REMOVED***     consumed.
***REMOVED***
goog.gears.Database.prototype.getExecutionTime = function() {
  return this.database_['executeMsec'] || 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The id of the last inserted row.
***REMOVED***
goog.gears.Database.prototype.getLastInsertRowId = function() {
  return this.database_['lastInsertRowId'];
***REMOVED***


***REMOVED***
***REMOVED*** Opens the database.
***REMOVED***
goog.gears.Database.prototype.open = function() {
  if (this.database_ && this.safeDbId_) {
    this.database_.open(this.safeDbId_);
  } else {
    throw Error('Could not open the database');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Closes the database.
***REMOVED***
goog.gears.Database.prototype.close = function() {
  if (this.database_) {
    this.database_.close();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.Database.prototype.disposeInternal = function() {
  goog.gears.Database.superClass_.disposeInternal.call(this);
  this.database_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the exception is a locking error.
***REMOVED*** @param {Error|string} ex The exception object or error string.
***REMOVED*** @return {boolean} Whether this is a database locked exception.
***REMOVED***
goog.gears.Database.isLockedException = function(ex) {
  // TODO(user): change the test when gears provides a reasonable
  // error code to check.
  var message = goog.isString(ex) ? ex : ex.message;
  return !!message && message.indexOf('database is locked') >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the database.
***REMOVED*** @throws {Error} This requires Gears 0.5 or newer and will throw an error if
***REMOVED***     called on a too old version of Gears.
***REMOVED***
goog.gears.Database.prototype.remove = function() {
  this.database_.remove();
***REMOVED***
