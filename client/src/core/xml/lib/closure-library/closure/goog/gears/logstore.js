// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview This file implements a store for goog.debug.Logger data.
***REMOVED***

goog.provide('goog.gears.LogStore');
goog.provide('goog.gears.LogStore.Query');

goog.require('goog.async.Delay');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.LogRecord');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.gears.BaseStore');
goog.require('goog.gears.BaseStore.SchemaType');
goog.require('goog.json');



***REMOVED***
***REMOVED*** Implements a store for goog.debug.Logger data.
***REMOVED*** @param {goog.gears.Database} database Database.
***REMOVED*** @param {?string=} opt_tableName Name of logging table to use.
***REMOVED*** @extends {goog.gears.BaseStore}
***REMOVED***
***REMOVED***
goog.gears.LogStore = function(database, opt_tableName) {
  goog.gears.BaseStore.call(this, database);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Name of log table.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  var tableName = opt_tableName || goog.gears.LogStore.DEFAULT_TABLE_NAME_;
  this.tableName_ = tableName;

  // Override BaseStore schema attribute.
  this.schema = [
    {
      type: goog.gears.BaseStore.SchemaType.TABLE,
      name: tableName,
      columns: [
        // Unique ID.
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        // Timestamp.
        'millis BIGINT',
        // #goog.debug.Logger.Level value.
        'level INTEGER',
        // Message.
        'msg TEXT',
        // Name of logger object.
        'logger TEXT',
        // Serialized error object.
        'exception TEXT',
        // Full exception text.
        'exceptionText TEXT'
      ]
    },
    {
      type: goog.gears.BaseStore.SchemaType.INDEX,
      name: tableName + 'MillisIndex',
      isUnique: false,
      tableName: tableName,
      columns: ['millis']
    },
    {
      type: goog.gears.BaseStore.SchemaType.INDEX,
      name: tableName + 'LevelIndex',
      isUnique: false,
      tableName: tableName,
      columns: ['level']
    }
  ];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Buffered log records not yet flushed to DB.
  ***REMOVED*** @type {Array.<goog.debug.LogRecord>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.records_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Save the publish handler so it can be removed.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
***REMOVED***
goog.inherits(goog.gears.LogStore, goog.gears.BaseStore);


***REMOVED*** @override***REMOVED***
goog.gears.LogStore.prototype.version = 1;


***REMOVED***
***REMOVED*** Whether we are currently capturing logger output.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.isCapturing_ = false;


***REMOVED***
***REMOVED*** Size of buffered log data messages.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.bufferSize_ = 0;


***REMOVED***
***REMOVED*** Scheduler for pruning action.
***REMOVED*** @type {goog.async.Delay?}
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.delay_ = null;


***REMOVED***
***REMOVED*** Use this to protect against recursive flushing.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.isFlushing_ = false;


***REMOVED***
***REMOVED*** Logger.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.gears.LogStore');


***REMOVED***
 ***REMOVED*** Default value for how many records we keep when pruning.
 ***REMOVED*** @type {number}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.gears.LogStore.DEFAULT_PRUNE_KEEPER_COUNT_ = 1000;


***REMOVED***
 ***REMOVED*** Default value for how often to auto-prune (10 minutes).
 ***REMOVED*** @type {number}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.gears.LogStore.DEFAULT_AUTOPRUNE_INTERVAL_MILLIS_ = 10***REMOVED*** 60***REMOVED*** 1000;


***REMOVED***
 ***REMOVED*** The name for the log table.
 ***REMOVED*** @type {string}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.gears.LogStore.DEFAULT_TABLE_NAME_ = 'GoogGearsDebugLogStore';


***REMOVED***
 ***REMOVED*** Max message bytes to buffer before flushing to database.
 ***REMOVED*** @type {number}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.gears.LogStore.MAX_BUFFER_BYTES_ = 200000;


***REMOVED***
***REMOVED*** Flush buffered log records.
***REMOVED***
goog.gears.LogStore.prototype.flush = function() {
  if (this.isFlushing_ || !this.getDatabaseInternal()) {
    return;
  }
  this.isFlushing_ = true;

  // Grab local copy of records so database can log during this process.
  this.logger_.info('flushing ' + this.records_.length + ' records');
  var records = this.records_;
  this.records_ = [];

  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    var exception = record.getException();
    var serializedException = exception ? goog.json.serialize(exception) : '';
    var statement = 'INSERT INTO ' + this.tableName_ +
        ' (millis, level, msg, logger, exception, exceptionText)' +
        ' VALUES (?, ?, ?, ?, ?, ?)';
    this.getDatabaseInternal().execute(statement,
        record.getMillis(), record.getLevel().value, record.getMessage(),
        record.getLoggerName(), serializedException,
        record.getExceptionText() || '');
  }

  this.isFlushing_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Create new delay object for auto-pruning. Does not stop or
***REMOVED*** start auto-pruning, call #startAutoPrune and #startAutoPrune for that.
***REMOVED*** @param {?number=} opt_count Number of records of recent hitory to keep.
***REMOVED*** @param {?number=} opt_interval Milliseconds to wait before next pruning.
***REMOVED***
goog.gears.LogStore.prototype.createAutoPruneDelay = function(
    opt_count, opt_interval) {
  if (this.delay_) {
    this.delay_.dispose();
    this.delay_ = null;
  }
  var interval = typeof opt_interval == 'number' ?
      opt_interval : goog.gears.LogStore.DEFAULT_AUTOPRUNE_INTERVAL_MILLIS_;
  var listener = goog.bind(this.autoPrune_, this, opt_count);
  this.delay_ = new goog.async.Delay(listener, interval);
***REMOVED***


***REMOVED***
***REMOVED*** Enable periodic pruning. As a side effect, this also flushes the memory
***REMOVED*** buffer.
***REMOVED***
goog.gears.LogStore.prototype.startAutoPrune = function() {
  if (!this.delay_) {
    this.createAutoPruneDelay(
        goog.gears.LogStore.DEFAULT_PRUNE_KEEPER_COUNT_,
        goog.gears.LogStore.DEFAULT_AUTOPRUNE_INTERVAL_MILLIS_);
  }
  this.delay_.fire();
***REMOVED***


***REMOVED***
***REMOVED*** Disable scheduled pruning.
***REMOVED***
goog.gears.LogStore.prototype.stopAutoPrune = function() {
  if (this.delay_) {
    this.delay_.stop();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True iff auto prune timer is active.
***REMOVED***
goog.gears.LogStore.prototype.isAutoPruneActive = function() {
  return !!this.delay_ && this.delay_.isActive();
***REMOVED***


***REMOVED***
***REMOVED*** Prune, and schedule next pruning.
***REMOVED*** @param {?number=} opt_count Number of records of recent hitory to keep.
***REMOVED*** @private
***REMOVED***
goog.gears.LogStore.prototype.autoPrune_ = function(opt_count) {
  this.pruneBeforeCount(opt_count);
  this.delay_.start();
***REMOVED***


***REMOVED***
***REMOVED*** Keep some number of most recent log records and delete all older ones.
***REMOVED*** @param {?number=} opt_count Number of records of recent history to keep. If
***REMOVED***     unspecified, we use #goog.gears.LogStore.DEFAULT_PRUNE_KEEPER_COUNT_.
***REMOVED***     Pass in 0 to delete all log records.
***REMOVED***
goog.gears.LogStore.prototype.pruneBeforeCount = function(opt_count) {
  if (!this.getDatabaseInternal()) {
    return;
  }
  var count = typeof opt_count == 'number' ?
      opt_count : goog.gears.LogStore.DEFAULT_PRUNE_KEEPER_COUNT_;
  this.logger_.info('pruning before ' + count + ' records ago');
  this.flush();
  this.getDatabaseInternal().execute('DELETE FROM ' + this.tableName_ +
      ' WHERE id <= ((SELECT MAX(id) FROM ' + this.tableName_ + ') - ?)',
      count);
***REMOVED***


***REMOVED***
***REMOVED*** Delete log record #id and all older records.
***REMOVED*** @param {number} sequenceNumber ID before which we delete all records.
***REMOVED***
goog.gears.LogStore.prototype.pruneBeforeSequenceNumber =
    function(sequenceNumber) {
  if (!this.getDatabaseInternal()) {
    return;
  }
  this.logger_.info('pruning before sequence number ' + sequenceNumber);
  this.flush();
  this.getDatabaseInternal().execute(
      'DELETE FROM ' + this.tableName_ + ' WHERE id <= ?',
      sequenceNumber);
***REMOVED***


***REMOVED***
***REMOVED*** Whether we are currently capturing logger output.
***REMOVED*** @return {boolean} Whether we are currently capturing logger output.
***REMOVED***
goog.gears.LogStore.prototype.isCapturing = function() {
  return this.isCapturing_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether we are currently capturing logger output.
***REMOVED*** @param {boolean} capturing Whether to capture logger output.
***REMOVED***
goog.gears.LogStore.prototype.setCapturing = function(capturing) {
  if (capturing != this.isCapturing_) {
    this.isCapturing_ = capturing;

    // Attach or detach handler from the root logger.
    var rootLogger = goog.debug.LogManager.getRoot();
    if (capturing) {
      rootLogger.addHandler(this.publishHandler_);
      this.logger_.info('enabled');
    } else {
      this.logger_.info('disabling');
      rootLogger.removeHandler(this.publishHandler_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a log record.
***REMOVED*** @param {goog.debug.LogRecord} logRecord the LogRecord.
***REMOVED***
goog.gears.LogStore.prototype.addLogRecord = function(logRecord) {
  this.records_.push(logRecord);
  this.bufferSize_ += logRecord.getMessage().length;
  var exceptionText = logRecord.getExceptionText();
  if (exceptionText) {
    this.bufferSize_ += exceptionText.length;
  }
  if (this.bufferSize_ >= goog.gears.LogStore.MAX_BUFFER_BYTES_) {
    this.flush();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Select log records.
***REMOVED*** @param {goog.gears.LogStore.Query} query Query object.
***REMOVED*** @return {Array.<goog.debug.LogRecord>} Selected logs in descending
***REMOVED***     order of creation time.
***REMOVED***
goog.gears.LogStore.prototype.select = function(query) {
  if (!this.getDatabaseInternal()) {
    // This should only occur if we've been disposed.
    return [];
  }
  this.flush();

  // TODO(user) Perhaps have Query object build this SQL string so we can
  // omit unneeded WHERE clauses.
  var statement =
      'SELECT id, millis, level, msg, logger, exception, exceptionText' +
      ' FROM ' + this.tableName_ +
      ' WHERE level >= ? AND millis >= ? AND millis <= ?' +
      ' AND msg like ? and logger like ?' +
      ' ORDER BY id DESC LIMIT ?';
  var rows = this.getDatabaseInternal().queryObjectArray(statement,
      query.level.value, query.minMillis, query.maxMillis,
      query.msgLike, query.loggerLike, query.limit);

  var result = Array(rows.length);
  for (var i = rows.length - 1; i >= 0; i--) {
    var row = rows[i];

    // Parse fields, allowing for invalid values.
    var sequenceNumber = Number(row['id']) || 0;
    var level = goog.debug.Logger.Level.getPredefinedLevelByValue(
        Number(row['level']) || 0);
    var msg = row['msg'] || '';
    var loggerName = row['logger'] || '';
    var millis = Number(row['millis']) || 0;
    var serializedException = row['exception'];
    var exception = serializedException ?
        goog.json.parse(serializedException) : null;
    var exceptionText = row['exceptionText'] || '';

    // Create record.
    var record = new goog.debug.LogRecord(level, msg, loggerName,
        millis, sequenceNumber);
    if (exception) {
      record.setException(exception);
      record.setExceptionText(exceptionText);
    }

    result[i] = record;
  }
  return result;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.LogStore.prototype.disposeInternal = function() {
  this.flush();

  goog.gears.LogStore.superClass_.disposeInternal.call(this);

  if (this.delay_) {
    this.delay_.dispose();
    this.delay_ = null;
  }
***REMOVED***



***REMOVED***
***REMOVED*** Query to select log records.
***REMOVED***
***REMOVED***
goog.gears.LogStore.Query = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Minimum logging level.
***REMOVED*** @type {goog.debug.Logger.Level}
***REMOVED***
goog.gears.LogStore.Query.prototype.level = goog.debug.Logger.Level.ALL;


***REMOVED***
***REMOVED*** Minimum timestamp, inclusive.
***REMOVED*** @type {number}
***REMOVED***
goog.gears.LogStore.Query.prototype.minMillis = -1;


***REMOVED***
***REMOVED*** Maximum timestamp, inclusive.
***REMOVED*** @type {number}
***REMOVED***
goog.gears.LogStore.Query.prototype.maxMillis = Infinity;


***REMOVED***
***REMOVED*** Message 'like' pattern.
***REMOVED*** See http://www.sqlite.org/lang_expr.html#likeFunc for 'like' syntax.
***REMOVED*** @type {string}
***REMOVED***
goog.gears.LogStore.Query.prototype.msgLike = '%';


***REMOVED***
***REMOVED*** Logger name 'like' pattern.
***REMOVED*** See http://www.sqlite.org/lang_expr.html#likeFunc for 'like' syntax.
***REMOVED*** @type {string}
***REMOVED***
goog.gears.LogStore.Query.prototype.loggerLike = '%';


***REMOVED***
***REMOVED*** Max # recent records to return. -1 means no limit.
***REMOVED*** @type {number}
***REMOVED***
goog.gears.LogStore.Query.prototype.limit = -1;
