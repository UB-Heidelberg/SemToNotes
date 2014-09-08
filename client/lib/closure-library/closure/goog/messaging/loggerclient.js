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
***REMOVED*** @fileoverview This class sends logging messages over a message channel to a
***REMOVED*** server on the main page that prints them using standard logging mechanisms.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.LoggerClient');

goog.require('goog.Disposable');
goog.require('goog.debug');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');



***REMOVED***
***REMOVED*** Creates a logger client that sends messages along a message channel for the
***REMOVED*** remote end to log. The remote end of the channel should use a
***REMOVED*** {goog.messaging.LoggerServer} with the same service name.
***REMOVED***
***REMOVED*** @param {!goog.messaging.MessageChannel} channel The channel that on which to
***REMOVED***     send the log messages.
***REMOVED*** @param {string} serviceName The name of the logging service to use.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED***
goog.messaging.LoggerClient = function(channel, serviceName) {
  if (goog.messaging.LoggerClient.instance_) {
    return goog.messaging.LoggerClient.instance_;
  }

  goog.messaging.LoggerClient.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel on which to send the log messages.
  ***REMOVED*** @type {!goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the logging service to use.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.serviceName_ = serviceName;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The bound handler function for handling log messages. This is kept in a
  ***REMOVED*** variable so that it can be deregistered when the logger client is disposed.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.publishHandler_ = goog.bind(this.sendLog_, this);
  goog.debug.LogManager.getRoot().addHandler(this.publishHandler_);

  goog.messaging.LoggerClient.instance_ = this;
***REMOVED***
goog.inherits(goog.messaging.LoggerClient, goog.Disposable);


***REMOVED***
***REMOVED*** The singleton instance, if any.
***REMOVED*** @type {goog.messaging.LoggerClient}
***REMOVED*** @private
***REMOVED***
goog.messaging.LoggerClient.instance_ = null;


***REMOVED***
***REMOVED*** Sends a log message through the channel.
***REMOVED*** @param {!goog.debug.LogRecord} logRecord The log message.
***REMOVED*** @private
***REMOVED***
goog.messaging.LoggerClient.prototype.sendLog_ = function(logRecord) {
  var name = logRecord.getLoggerName();
  var level = logRecord.getLevel();
  var msg = logRecord.getMessage();
  var originalException = logRecord.getException();

  var exception;
  if (originalException) {
    var normalizedException =
        goog.debug.normalizeErrorObject(originalException);
    exception = {
      'name': normalizedException.name,
      'message': normalizedException.message,
      'lineNumber': normalizedException.lineNumber,
      'fileName': normalizedException.fileName,
      // Normalized exceptions without a stack have 'stack' set to 'Not
      // available', so we check for the existance of 'stack' on the original
      // exception instead.
      'stack': originalException.stack ||
          goog.debug.getStacktrace(goog.debug.Logger.prototype.log)
   ***REMOVED*****REMOVED***

    if (goog.isObject(originalException)) {
      // Add messageN to the exception in case it was added using
      // goog.debug.enhanceError.
      for (var i = 0; 'message' + i in originalException; i++) {
        exception['message' + i] = String(originalException['message' + i]);
      }
    }
  }
  this.channel_.send(this.serviceName_, {
    'name': name, 'level': level.value, 'message': msg, 'exception': exception
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.LoggerClient.prototype.disposeInternal = function() {
  goog.messaging.LoggerClient.base(this, 'disposeInternal');
  goog.debug.LogManager.getRoot().removeHandler(this.publishHandler_);
  delete this.channel_;
  goog.messaging.LoggerClient.instance_ = null;
***REMOVED***
