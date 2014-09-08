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
***REMOVED*** @fileoverview Static methods for serializing and deserializing log
***REMOVED*** messages.  These methods are deliberately kept separate from logrecord.js
***REMOVED*** and logger.js because they add dependencies on goog.json and goog.object.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.logRecordSerializer');

goog.require('goog.debug.LogRecord');
goog.require('goog.debug.Logger.Level');
goog.require('goog.json');
goog.require('goog.object');


***REMOVED***
***REMOVED*** Enumeration of object keys used when serializing a log message.
***REMOVED*** @enum {string}
***REMOVED*** @private
***REMOVED***
goog.debug.logRecordSerializer.Param_ = {
  TIME: 't',
  LEVEL_NAME: 'ln',
  LEVEL_VALUE: 'lv',
  MSG: 'm',
  LOGGER_NAME: 'n',
  SEQUENCE_NUMBER: 's',
  EXCEPTION: 'e',
  EXCEPTION_TEXT: 'et'
***REMOVED***


***REMOVED***
***REMOVED*** Serializes a LogRecord to a JSON string.  Note that any associated
***REMOVED*** exception is likely to be lost.
***REMOVED*** @param {goog.debug.LogRecord} record The record to serialize.
***REMOVED*** @return {string} Serialized JSON string of the log message.
***REMOVED***
goog.debug.logRecordSerializer.serialize = function(record) {
  var param = goog.debug.logRecordSerializer.Param_;
  return goog.json.serialize(goog.object.create(
      param.TIME, record.getMillis(),
      param.LEVEL_NAME, record.getLevel().name,
      param.LEVEL_VALUE, record.getLevel().value,
      param.MSG, record.getMessage(),
      param.LOGGER_NAME, record.getLoggerName(),
      param.SEQUENCE_NUMBER, record.getSequenceNumber(),
      param.EXCEPTION, record.getException(),
      param.EXCEPTION_TEXT, record.getExceptionText()));
***REMOVED***


***REMOVED***
***REMOVED*** Deserializes a JSON-serialized LogRecord.
***REMOVED*** @param {string} s The JSON serialized record.
***REMOVED*** @return {!goog.debug.LogRecord} The deserialized record.
***REMOVED***
goog.debug.logRecordSerializer.parse = function(s) {
  return goog.debug.logRecordSerializer.reconstitute_(goog.json.parse(s));
***REMOVED***


***REMOVED***
***REMOVED*** Deserializes a JSON-serialized LogRecord.  Use this only if you're
***REMOVED*** naive enough to blindly trust any JSON formatted input that comes
***REMOVED*** your way.
***REMOVED*** @param {string} s The JSON serialized record.
***REMOVED*** @return {!goog.debug.LogRecord} The deserialized record.
***REMOVED***
goog.debug.logRecordSerializer.unsafeParse = function(s) {
  return goog.debug.logRecordSerializer.reconstitute_(goog.json.unsafeParse(s));
***REMOVED***


***REMOVED***
***REMOVED*** Common reconsitution method for for parse and unsafeParse.
***REMOVED*** @param {Object} o The JSON object.
***REMOVED*** @return {!goog.debug.LogRecord} The reconstituted record.
***REMOVED*** @private
***REMOVED***
goog.debug.logRecordSerializer.reconstitute_ = function(o) {
  var param = goog.debug.logRecordSerializer.Param_;
  var level = goog.debug.logRecordSerializer.getLevel_(
      o[param.LEVEL_NAME], o[param.LEVEL_VALUE]);

  var ret = new goog.debug.LogRecord(level, o[param.MSG],
      o[param.LOGGER_NAME], o[param.TIME], o[param.SEQUENCE_NUMBER]);
  ret.setException(o[param.EXCEPTION]);
  ret.setExceptionText(o[param.EXCEPTION_TEXT]);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} name The name of the log level to return.
***REMOVED*** @param {number} value The numeric value of the log level to return.
***REMOVED*** @return {!goog.debug.Logger.Level} Returns a goog.debug.Logger.Level with
***REMOVED***     the specified name and value.  If the name and value match a predefined
***REMOVED***     log level, that instance will be returned, otherwise a new one will be
***REMOVED***     created.
***REMOVED*** @private
***REMOVED***
goog.debug.logRecordSerializer.getLevel_ = function(name, value) {
  var level = goog.debug.Logger.Level.getPredefinedLevel(name);
  return level && level.value == value ?
      level : new goog.debug.Logger.Level(name, value);
***REMOVED***
