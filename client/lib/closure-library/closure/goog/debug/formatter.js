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
***REMOVED*** @fileoverview Definition of various formatters for logging. Please minimize
***REMOVED*** dependencies this file has on other closure classes as any dependency it
***REMOVED*** takes won't be able to use the logging infrastructure.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.Formatter');
goog.provide('goog.debug.HtmlFormatter');
goog.provide('goog.debug.TextFormatter');

goog.require('goog.debug.RelativeTimeProvider');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Base class for Formatters. A Formatter is used to format a LogRecord into
***REMOVED*** something that can be displayed to the user.
***REMOVED***
***REMOVED*** @param {string=} opt_prefix The prefix to place before text records.
***REMOVED***
***REMOVED***
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** A provider that returns the relative start time.
  ***REMOVED*** @type {goog.debug.RelativeTimeProvider}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.startTimeProvider_ =
      goog.debug.RelativeTimeProvider.getDefaultInstance();
***REMOVED***


***REMOVED***
***REMOVED*** Whether to append newlines to the end of formatted log records.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.appendNewline = true;


***REMOVED***
***REMOVED*** Whether to show absolute time in the DebugWindow.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.showAbsoluteTime = true;


***REMOVED***
***REMOVED*** Whether to show relative time in the DebugWindow.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.showRelativeTime = true;


***REMOVED***
***REMOVED*** Whether to show the logger name in the DebugWindow.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.showLoggerName = true;


***REMOVED***
***REMOVED*** Whether to show the logger exception text.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.showExceptionText = false;


***REMOVED***
***REMOVED*** Whether to show the severity level.
***REMOVED*** @type {boolean}
***REMOVED***
goog.debug.Formatter.prototype.showSeverityLevel = false;


***REMOVED***
***REMOVED*** Formats a record.
***REMOVED*** @param {goog.debug.LogRecord} logRecord the logRecord to format.
***REMOVED*** @return {string} The formatted string.
***REMOVED***
goog.debug.Formatter.prototype.formatRecord = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets the start time provider. By default, this is the default instance
***REMOVED*** but can be changed.
***REMOVED*** @param {goog.debug.RelativeTimeProvider} provider The provider to use.
***REMOVED***
goog.debug.Formatter.prototype.setStartTimeProvider = function(provider) {
  this.startTimeProvider_ = provider;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the start time provider. By default, this is the default instance
***REMOVED*** but can be changed.
***REMOVED*** @return {goog.debug.RelativeTimeProvider} The start time provider.
***REMOVED***
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the start relative time.
***REMOVED***
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset();
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string for the time/date of the LogRecord.
***REMOVED*** @param {goog.debug.LogRecord} logRecord The record to get a time stamp for.
***REMOVED*** @return {string} A string representation of the time/date of the LogRecord.
***REMOVED*** @private
***REMOVED***
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_((time.getFullYear() - 2000)) +
         goog.debug.Formatter.getTwoDigitString_((time.getMonth() + 1)) +
         goog.debug.Formatter.getTwoDigitString_(time.getDate()) + ' ' +
         goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ':' +
         goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ':' +
         goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + '.' +
         goog.debug.Formatter.getTwoDigitString_(
             Math.floor(time.getMilliseconds() / 10));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number as a two-digit string, meaning it prepends a 0 if the
***REMOVED*** number if less than 10.
***REMOVED*** @param {number} n The number to format.
***REMOVED*** @return {string} A two-digit string representation of {@code n}.
***REMOVED*** @private
***REMOVED***
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  if (n < 10) {
    return '0' + n;
  }
  return String(n);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string for the number of seconds relative to the start time.
***REMOVED*** Prepads with spaces so that anything less than 1000 seconds takes up the
***REMOVED*** same number of characters for better formatting.
***REMOVED*** @param {goog.debug.LogRecord} logRecord The log to compare time to.
***REMOVED*** @param {number} relativeTimeStart The start time to compare to.
***REMOVED*** @return {string} The number of seconds of the LogRecord relative to the
***REMOVED***     start time.
***REMOVED*** @private
***REMOVED***
goog.debug.Formatter.getRelativeTime_ = function(logRecord,
                                                 relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart;
  var sec = ms / 1000;
  var str = sec.toFixed(3);

  var spacesToPrepend = 0;
  if (sec < 1) {
    spacesToPrepend = 2;
  } else {
    while (sec < 100) {
      spacesToPrepend++;
      sec***REMOVED***= 10;
    }
  }
  while (spacesToPrepend-- > 0) {
    str = ' ' + str;
  }
  return str;
***REMOVED***



***REMOVED***
***REMOVED*** Formatter that returns formatted html. See formatRecord for the classes
***REMOVED*** it uses for various types of formatted output.
***REMOVED***
***REMOVED*** @param {string=} opt_prefix The prefix to place before text records.
***REMOVED***
***REMOVED*** @extends {goog.debug.Formatter}
***REMOVED***
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
***REMOVED***
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);


***REMOVED***
***REMOVED*** Whether to show the logger exception text
***REMOVED*** @type {boolean}
***REMOVED*** @override
***REMOVED***
goog.debug.HtmlFormatter.prototype.showExceptionText = true;


***REMOVED***
***REMOVED*** Formats a record
***REMOVED*** @param {goog.debug.LogRecord} logRecord the logRecord to format.
***REMOVED*** @return {string} The formatted string as html.
***REMOVED*** @override
***REMOVED***
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  var className;
  switch (logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = 'dbg-sh';
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = 'dbg-sev';
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = 'dbg-w';
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = 'dbg-i';
      break;
    case goog.debug.Logger.Level.FINE.value:
    default:
      className = 'dbg-f';
      break;
  }

  // Build message html
  var sb = [];
  sb.push(this.prefix_, ' ');
  if (this.showAbsoluteTime) {
    sb.push('[', goog.debug.Formatter.getDateTimeStamp_(logRecord), '] ');
  }
  if (this.showRelativeTime) {
    sb.push('[',
        goog.string.whitespaceEscape(
            goog.debug.Formatter.getRelativeTime_(logRecord,
                this.startTimeProvider_.get())),
        's] ');
  }

  if (this.showLoggerName) {
    sb.push('[', goog.string.htmlEscape(logRecord.getLoggerName()), '] ');
  }
  if (this.showSeverityLevel) {
    sb.push('[', goog.string.htmlEscape(logRecord.getLevel().name), '] ');
  }
  sb.push('<span class="', className, '">',
      goog.string.newLineToBr(goog.string.whitespaceEscape(
          goog.string.htmlEscape(logRecord.getMessage()))));

  if (this.showExceptionText && logRecord.getException()) {
    sb.push('<br>',
        goog.string.newLineToBr(goog.string.whitespaceEscape(
            logRecord.getExceptionText() || '')));
  }
  sb.push('</span>');
  if (this.appendNewline) {
    sb.push('<br>');
  }

  return sb.join('');
***REMOVED***



***REMOVED***
***REMOVED*** Formatter that returns formatted plain text
***REMOVED***
***REMOVED*** @param {string=} opt_prefix The prefix to place before text records.
***REMOVED***
***REMOVED*** @extends {goog.debug.Formatter}
***REMOVED*** @final
***REMOVED***
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
***REMOVED***
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);


***REMOVED***
***REMOVED*** Formats a record as text
***REMOVED*** @param {goog.debug.LogRecord} logRecord the logRecord to format.
***REMOVED*** @return {string} The formatted string.
***REMOVED*** @override
***REMOVED***
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  // Build message html
  var sb = [];
  sb.push(this.prefix_, ' ');
  if (this.showAbsoluteTime) {
    sb.push('[', goog.debug.Formatter.getDateTimeStamp_(logRecord), '] ');
  }
  if (this.showRelativeTime) {
    sb.push('[', goog.debug.Formatter.getRelativeTime_(logRecord,
        this.startTimeProvider_.get()), 's] ');
  }

  if (this.showLoggerName) {
    sb.push('[', logRecord.getLoggerName(), '] ');
  }
  if (this.showSeverityLevel) {
    sb.push('[', logRecord.getLevel().name, '] ');
  }
  sb.push(logRecord.getMessage());
  if (this.showExceptionText && logRecord.getException()) {
    sb.push('\n', logRecord.getExceptionText());
  }
  if (this.appendNewline) {
    sb.push('\n');
  }
  return sb.join('');
***REMOVED***
