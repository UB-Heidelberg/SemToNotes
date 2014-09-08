// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Basic strippable logging definitions.
***REMOVED*** @see http://go/closurelogging
***REMOVED***
***REMOVED*** @author johnlenz@google.com (John Lenz)
***REMOVED***

goog.provide('goog.log');
goog.provide('goog.log.Level');
goog.provide('goog.log.LogRecord');
goog.provide('goog.log.Logger');

goog.require('goog.debug');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.LogRecord');
goog.require('goog.debug.Logger');


***REMOVED*** @define {boolean} Whether logging is enabled.***REMOVED***
goog.define('goog.log.ENABLED', goog.debug.LOGGING_ENABLED);


***REMOVED*** @const***REMOVED***
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;



***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.log.Logger = goog.debug.Logger;



***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.log.Level = goog.debug.Logger.Level;



***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.log.LogRecord = goog.debug.LogRecord;


***REMOVED***
***REMOVED*** Finds or creates a logger for a named subsystem. If a logger has already been
***REMOVED*** created with the given name it is returned. Otherwise a new logger is
***REMOVED*** created. If a new logger is created its log level will be configured based
***REMOVED*** on the goog.debug.LogManager configuration and it will configured to also
***REMOVED*** send logging output to its parent's handlers.
***REMOVED*** @see goog.debug.LogManager
***REMOVED***
***REMOVED*** @param {string} name A name for the logger. This should be a dot-separated
***REMOVED***     name and should normally be based on the package name or class name of
***REMOVED***     the subsystem, such as goog.net.BrowserChannel.
***REMOVED*** @param {goog.log.Level=} opt_level If provided, override the
***REMOVED***     default logging level with the provided level.
***REMOVED*** @return {goog.log.Logger} The named logger or null if logging is disabled.
***REMOVED***
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    if (opt_level && logger) {
      logger.setLevel(opt_level);
    }
    return logger;
  } else {
    return null;
  }
***REMOVED***


// TODO(johnlenz): try to tighten the types to these functions.
***REMOVED***
***REMOVED*** Adds a handler to the logger. This doesn't use the event system because
***REMOVED*** we want to be able to add logging to the event system.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {Function} handler Handler function to add.
***REMOVED***
goog.log.addHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    logger.addHandler(handler);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a handler from the logger. This doesn't use the event system because
***REMOVED*** we want to be able to add logging to the event system.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {Function} handler Handler function to remove.
***REMOVED*** @return {boolean} Whether the handler was removed.
***REMOVED***
goog.log.removeHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    return logger.removeHandler(handler);
  } else {
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message. If the logger is currently enabled for the
***REMOVED*** given message level then the given message is forwarded to all the
***REMOVED*** registered output Handler objects.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {goog.log.Level} level One of the level identifiers.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error|Object=} opt_exception An exception associated with the
***REMOVED***     message.
***REMOVED***
goog.log.log = function(logger, level, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.log(level, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Level.SEVERE level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.log.error = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.severe(msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Level.WARNING level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.log.warning = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.warning(msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Level.INFO level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.log.info = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.info(msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Level.Fine level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.log.Logger} logger
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.log.fine = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.fine(msg, opt_exception);
  }
***REMOVED***
