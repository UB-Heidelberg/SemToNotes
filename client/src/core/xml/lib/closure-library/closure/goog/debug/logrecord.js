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
***REMOVED*** @fileoverview Definition of the LogRecord class. Please minimize
***REMOVED*** dependencies this file has on other closure classes as any dependency it
***REMOVED*** takes won't be able to use the logging infrastructure.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.LogRecord');



***REMOVED***
***REMOVED*** LogRecord objects are used to pass logging requests between
***REMOVED*** the logging framework and individual log Handlers.
***REMOVED***
***REMOVED*** @param {goog.debug.Logger.Level} level One of the level identifiers.
***REMOVED*** @param {string} msg The string message.
***REMOVED*** @param {string} loggerName The name of the source logger.
***REMOVED*** @param {number=} opt_time Time this log record was created if other than now.
***REMOVED***     If 0, we use #goog.now.
***REMOVED*** @param {number=} opt_sequenceNumber Sequence number of this log record. This
***REMOVED***     should only be passed in when restoring a log record from persistence.
***REMOVED***
goog.debug.LogRecord = function(level, msg, loggerName,
    opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
***REMOVED***


***REMOVED***
***REMOVED*** Time the LogRecord was created.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.time_;


***REMOVED***
***REMOVED*** Level of the LogRecord
***REMOVED*** @type {goog.debug.Logger.Level}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.level_;


***REMOVED***
***REMOVED*** Message associated with the record
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.msg_;


***REMOVED***
***REMOVED*** Name of the logger that created the record.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.loggerName_;


***REMOVED***
***REMOVED*** Sequence number for the LogRecord. Each record has a unique sequence number
***REMOVED*** that is greater than all log records created before it.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;


***REMOVED***
***REMOVED*** Exception associated with the record
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.exception_ = null;


***REMOVED***
***REMOVED*** Exception text associated with the record
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.prototype.exceptionText_ = null;


***REMOVED***
***REMOVED*** @define {boolean} Whether to enable log sequence numbers.
***REMOVED***
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = true;


***REMOVED***
***REMOVED*** A sequence counter for assigning increasing sequence numbers to LogRecord
***REMOVED*** objects.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.debug.LogRecord.nextSequenceNumber_ = 0;


***REMOVED***
***REMOVED*** Sets all fields of the log record.
***REMOVED*** @param {goog.debug.Logger.Level} level One of the level identifiers.
***REMOVED*** @param {string} msg The string message.
***REMOVED*** @param {string} loggerName The name of the source logger.
***REMOVED*** @param {number=} opt_time Time this log record was created if other than now.
***REMOVED***     If 0, we use #goog.now.
***REMOVED*** @param {number=} opt_sequenceNumber Sequence number of this log record. This
***REMOVED***     should only be passed in when restoring a log record from persistence.
***REMOVED***
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName,
    opt_time, opt_sequenceNumber) {
  if (goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber == 'number' ?
        opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++;
  }

  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
  delete this.exceptionText_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the source Logger's name.
***REMOVED***
***REMOVED*** @return {string} source logger name (may be null).
***REMOVED***
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the exception that is part of the log record.
***REMOVED***
***REMOVED*** @return {Object} the exception.
***REMOVED***
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the exception that is part of the log record.
***REMOVED***
***REMOVED*** @param {Object} exception the exception.
***REMOVED***
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
***REMOVED***


***REMOVED***
***REMOVED*** Get the exception text that is part of the log record.
***REMOVED***
***REMOVED*** @return {?string} Exception text.
***REMOVED***
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the exception text that is part of the log record.
***REMOVED***
***REMOVED*** @param {string} text The exception text.
***REMOVED***
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text;
***REMOVED***


***REMOVED***
***REMOVED*** Get the source Logger's name.
***REMOVED***
***REMOVED*** @param {string} loggerName source logger name (may be null).
***REMOVED***
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName;
***REMOVED***


***REMOVED***
***REMOVED*** Get the logging message level, for example Level.SEVERE.
***REMOVED*** @return {goog.debug.Logger.Level} the logging message level.
***REMOVED***
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the logging message level, for example Level.SEVERE.
***REMOVED*** @param {goog.debug.Logger.Level} level the logging message level.
***REMOVED***
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
***REMOVED***


***REMOVED***
***REMOVED*** Get the "raw" log message, before localization or formatting.
***REMOVED***
***REMOVED*** @return {string} the raw message string.
***REMOVED***
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the "raw" log message, before localization or formatting.
***REMOVED***
***REMOVED*** @param {string} msg the raw message string.
***REMOVED***
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg;
***REMOVED***


***REMOVED***
***REMOVED*** Get event time in milliseconds since 1970.
***REMOVED***
***REMOVED*** @return {number} event time in millis since 1970.
***REMOVED***
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
***REMOVED***


***REMOVED***
***REMOVED*** Set event time in milliseconds since 1970.
***REMOVED***
***REMOVED*** @param {number} time event time in millis since 1970.
***REMOVED***
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time;
***REMOVED***


***REMOVED***
***REMOVED*** Get the sequence number.
***REMOVED*** <p>
***REMOVED*** Sequence numbers are normally assigned in the LogRecord
***REMOVED*** constructor, which assigns unique sequence numbers to
***REMOVED*** each new LogRecord in increasing order.
***REMOVED*** @return {number} the sequence number.
***REMOVED***
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
***REMOVED***

