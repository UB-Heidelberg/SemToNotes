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
***REMOVED*** @fileoverview Simple logger that logs to the window console if available.
***REMOVED***
***REMOVED*** Has an autoInstall option which can be put into initialization code, which
***REMOVED*** will start logging if "Debug=true" is in document.location.href
***REMOVED***
***REMOVED***

goog.provide('goog.debug.Console');

goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger.Level');
goog.require('goog.debug.TextFormatter');



***REMOVED***
***REMOVED*** Create and install a log handler that logs to window.console if available
***REMOVED***
***REMOVED***
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Formatter for formatted output.
  ***REMOVED*** @type {!goog.debug.TextFormatter}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.formatter_ = new goog.debug.TextFormatter();
  this.formatter_.showAbsoluteTime = false;
  this.formatter_.showExceptionText = false;

  this.isCapturing_ = false;
  this.logBuffer_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Loggers that we shouldn't output.
  ***REMOVED*** @type {!Object.<boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.filteredLoggers_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text formatter used by this console
***REMOVED*** @return {!goog.debug.TextFormatter} The text formatter.
***REMOVED***
goog.debug.Console.prototype.getFormatter = function() {
  return this.formatter_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether we are currently capturing logger output.
***REMOVED*** @param {boolean} capturing Whether to capture logger output.
***REMOVED***
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }

  // attach or detach handler from the root logger
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
    this.logBuffer = '';
  }
  this.isCapturing_ = capturing;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a log record.
***REMOVED*** @param {goog.debug.LogRecord} logRecord The log entry.
***REMOVED***
goog.debug.Console.prototype.addLogRecord = function(logRecord) {

  // Check to see if the log record is filtered or not.
  if (this.filteredLoggers_[logRecord.getLoggerName()]) {
    return;
  }

  var record = this.formatter_.formatRecord(logRecord);
  var console = goog.debug.Console.console_;
  if (console) {
    switch (logRecord.getLevel()) {
      case goog.debug.Logger.Level.SHOUT:
        goog.debug.Console.logToConsole_(console, 'info', record);
        break;
      case goog.debug.Logger.Level.SEVERE:
        goog.debug.Console.logToConsole_(console, 'error', record);
        break;
      case goog.debug.Logger.Level.WARNING:
        goog.debug.Console.logToConsole_(console, 'warn', record);
        break;
      default:
        goog.debug.Console.logToConsole_(console, 'debug', record);
        break;
    }
  } else if (window.opera) {
    // window.opera.postError is considered an undefined property reference
    // by JSCompiler, so it has to be referenced using array notation instead.
    window.opera['postError'](record);
  } else {
    this.logBuffer_ += record;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a logger name to be filtered.
***REMOVED*** @param {string} loggerName the logger name to add.
***REMOVED***
goog.debug.Console.prototype.addFilter = function(loggerName) {
  this.filteredLoggers_[loggerName] = true;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a logger name to be filtered.
***REMOVED*** @param {string} loggerName the logger name to remove.
***REMOVED***
goog.debug.Console.prototype.removeFilter = function(loggerName) {
  delete this.filteredLoggers_[loggerName];
***REMOVED***


***REMOVED***
***REMOVED*** Global console logger instance
***REMOVED*** @type {goog.debug.Console}
***REMOVED***
goog.debug.Console.instance = null;


***REMOVED***
***REMOVED*** The console to which to log.  This is a property so it can be mocked out in
***REMOVED*** this unit test for goog.debug.Console.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.debug.Console.console_ = window.console;


***REMOVED***
***REMOVED*** Sets the console to which to log.
***REMOVED*** @param {!Object} console The console to which to log.
***REMOVED***
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
***REMOVED***


***REMOVED***
***REMOVED*** Install the console and start capturing if "Debug=true" is in the page URL
***REMOVED***
goog.debug.Console.autoInstall = function() {
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console();
  }

  if (window.location.href.indexOf('Debug=true') != -1) {
    goog.debug.Console.instance.setCapturing(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Show an alert with all of the captured debug information.
***REMOVED*** Information is only captured if console is not available
***REMOVED***
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
***REMOVED***


***REMOVED***
***REMOVED*** Logs the record to the console using the given function.  If the function is
***REMOVED*** not available on the console object, the log function is used instead.
***REMOVED*** @param {!Object} console The console object.
***REMOVED*** @param {string} fnName The name of the function to use.
***REMOVED*** @param {string} record The record to log.
***REMOVED*** @private
***REMOVED***
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
***REMOVED***
