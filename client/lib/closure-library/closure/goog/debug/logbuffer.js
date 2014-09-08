// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A buffer for log records. The purpose of this is to improve
***REMOVED*** logging performance by re-using old objects when the buffer becomes full and
***REMOVED*** to eliminate the need for each app to implement their own log buffer. The
***REMOVED*** disadvantage to doing this is that log handlers cannot maintain references to
***REMOVED*** log records and expect that they are not overwriten at a later point.
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.debug.LogBuffer');

goog.require('goog.asserts');
goog.require('goog.debug.LogRecord');



***REMOVED***
***REMOVED*** Creates the log buffer.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(),
      'Cannot use goog.debug.LogBuffer without defining ' +
      'goog.debug.LogBuffer.CAPACITY.');
  this.clear();
***REMOVED***


***REMOVED***
***REMOVED*** A static method that always returns the same instance of LogBuffer.
***REMOVED*** @return {!goog.debug.LogBuffer} The LogBuffer singleton instance.
***REMOVED***
goog.debug.LogBuffer.getInstance = function() {
  if (!goog.debug.LogBuffer.instance_) {
    // This function is written with the return statement after the assignment
    // to avoid the jscompiler StripCode bug described in http://b/2608064.
    // After that bug is fixed this can be refactored.
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer();
  }
  return goog.debug.LogBuffer.instance_;
***REMOVED***


***REMOVED***
***REMOVED*** @define {number} The number of log records to buffer. 0 means disable
***REMOVED*** buffering.
***REMOVED***
goog.define('goog.debug.LogBuffer.CAPACITY', 0);


***REMOVED***
***REMOVED*** The array to store the records.
***REMOVED*** @type {!Array.<!goog.debug.LogRecord|undefined>}
***REMOVED*** @private
***REMOVED***
goog.debug.LogBuffer.prototype.buffer_;


***REMOVED***
***REMOVED*** The index of the most recently added record or -1 if there are no records.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.debug.LogBuffer.prototype.curIndex_;


***REMOVED***
***REMOVED*** Whether the buffer is at capacity.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.LogBuffer.prototype.isFull_;


***REMOVED***
***REMOVED*** Adds a log record to the buffer, possibly overwriting the oldest record.
***REMOVED*** @param {goog.debug.Logger.Level} level One of the level identifiers.
***REMOVED*** @param {string} msg The string message.
***REMOVED*** @param {string} loggerName The name of the source logger.
***REMOVED*** @return {!goog.debug.LogRecord} The log record.
***REMOVED***
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] =
      new goog.debug.LogRecord(level, msg, loggerName);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the log buffer is enabled.
***REMOVED***
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all buffered log records.
***REMOVED***
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the given function for each buffered log record, starting with the
***REMOVED*** oldest one.
***REMOVED*** @param {function(!goog.debug.LogRecord)} func The function to call.
***REMOVED***
goog.debug.LogBuffer.prototype.forEachRecord = function(func) {
  var buffer = this.buffer_;
  // Corner case: no records.
  if (!buffer[0]) {
    return;
  }
  var curIndex = this.curIndex_;
  var i = this.isFull_ ? curIndex : -1;
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY;
    func(***REMOVED*** @type {!goog.debug.LogRecord}***REMOVED*** (buffer[i]));
  } while (i != curIndex);
***REMOVED***

