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
***REMOVED*** @fileoverview Definition of the Logger class. Please minimize dependencies
***REMOVED*** this file has on other closure classes as any dependency it takes won't be
***REMOVED*** able to use the logging infrastructure.
***REMOVED***
***REMOVED*** @see ../demos/debug.html
***REMOVED***

goog.provide('goog.debug.LogManager');
goog.provide('goog.debug.Loggable');
goog.provide('goog.debug.Logger');
goog.provide('goog.debug.Logger.Level');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.debug.LogBuffer');
goog.require('goog.debug.LogRecord');


***REMOVED***
***REMOVED*** A message value that can be handled by a Logger.
***REMOVED***
***REMOVED*** Functions are treated like callbacks, but are only called when the event's
***REMOVED*** log level is enabled. This is useful for logging messages that are expensive
***REMOVED*** to construct.
***REMOVED***
***REMOVED*** @typedef {string|function(): string}
***REMOVED***
goog.debug.Loggable;



***REMOVED***
***REMOVED*** The Logger is an object used for logging debug messages. Loggers are
***REMOVED*** normally named, using a hierarchical dot-separated namespace. Logger names
***REMOVED*** can be arbitrary strings, but they should normally be based on the package
***REMOVED*** name or class name of the logged component, such as goog.net.BrowserChannel.
***REMOVED***
***REMOVED*** The Logger object is loosely based on the java class
***REMOVED*** java.util.logging.Logger. It supports different levels of filtering for
***REMOVED*** different loggers.
***REMOVED***
***REMOVED*** The logger object should never be instantiated by application code. It
***REMOVED*** should always use the goog.debug.Logger.getLogger function.
***REMOVED***
***REMOVED***
***REMOVED*** @param {string} name The name of the Logger.
***REMOVED*** @final
***REMOVED***
goog.debug.Logger = function(name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Name of the Logger. Generally a dot-separated namespace
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.name_ = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Parent Logger.
  ***REMOVED*** @private {goog.debug.Logger}
 ***REMOVED*****REMOVED***
  this.parent_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Level that this logger only filters above. Null indicates it should
  ***REMOVED*** inherit from the parent.
  ***REMOVED*** @private {goog.debug.Logger.Level}
 ***REMOVED*****REMOVED***
  this.level_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of children loggers. The keys are the leaf names of the children and
  ***REMOVED*** the values are the child loggers.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.children_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handlers that are listening to this logger.
  ***REMOVED*** @private {Array.<Function>}
 ***REMOVED*****REMOVED***
  this.handlers_ = null;
***REMOVED***


***REMOVED*** @const***REMOVED***
goog.debug.Logger.ROOT_LOGGER_NAME = '';


***REMOVED***
***REMOVED*** @define {boolean} Toggles whether loggers other than the root logger can have
***REMOVED***     log handlers attached to them and whether they can have their log level
***REMOVED***     set. Logging is a bit faster when this is set to false.
***REMOVED***
goog.define('goog.debug.Logger.ENABLE_HIERARCHY', true);


if (!goog.debug.Logger.ENABLE_HIERARCHY) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<Function>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.debug.Logger.rootHandlers_ = [];


 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.debug.Logger.Level}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.debug.Logger.rootLevel_;
}



***REMOVED***
***REMOVED*** The Level class defines a set of standard logging levels that
***REMOVED*** can be used to control logging output.  The logging Level objects
***REMOVED*** are ordered and are specified by ordered integers.  Enabling logging
***REMOVED*** at a given level also enables logging at all higher levels.
***REMOVED*** <p>
***REMOVED*** Clients should normally use the predefined Level constants such
***REMOVED*** as Level.SEVERE.
***REMOVED*** <p>
***REMOVED*** The levels in descending order are:
***REMOVED*** <ul>
***REMOVED*** <li>SEVERE (highest value)
***REMOVED*** <li>WARNING
***REMOVED*** <li>INFO
***REMOVED*** <li>CONFIG
***REMOVED*** <li>FINE
***REMOVED*** <li>FINER
***REMOVED*** <li>FINEST  (lowest value)
***REMOVED*** </ul>
***REMOVED*** In addition there is a level OFF that can be used to turn
***REMOVED*** off logging, and a level ALL that can be used to enable
***REMOVED*** logging of all messages.
***REMOVED***
***REMOVED*** @param {string} name The name of the level.
***REMOVED*** @param {number} value The numeric value of the level.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.debug.Logger.Level = function(name, value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the level
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The numeric value of the level
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.value = value;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} String representation of the logger level.
***REMOVED*** @override
***REMOVED***
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
***REMOVED***


***REMOVED***
***REMOVED*** OFF is a special level that can be used to turn off logging.
***REMOVED*** This level is initialized to <CODE>Infinity</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.OFF =
    new goog.debug.Logger.Level('OFF', Infinity);


***REMOVED***
***REMOVED*** SHOUT is a message level for extra debugging loudness.
***REMOVED*** This level is initialized to <CODE>1200</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level('SHOUT', 1200);


***REMOVED***
***REMOVED*** SEVERE is a message level indicating a serious failure.
***REMOVED*** This level is initialized to <CODE>1000</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level('SEVERE', 1000);


***REMOVED***
***REMOVED*** WARNING is a message level indicating a potential problem.
***REMOVED*** This level is initialized to <CODE>900</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level('WARNING', 900);


***REMOVED***
***REMOVED*** INFO is a message level for informational messages.
***REMOVED*** This level is initialized to <CODE>800</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level('INFO', 800);


***REMOVED***
***REMOVED*** CONFIG is a message level for static configuration messages.
***REMOVED*** This level is initialized to <CODE>700</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level('CONFIG', 700);


***REMOVED***
***REMOVED*** FINE is a message level providing tracing information.
***REMOVED*** This level is initialized to <CODE>500</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level('FINE', 500);


***REMOVED***
***REMOVED*** FINER indicates a fairly detailed tracing message.
***REMOVED*** This level is initialized to <CODE>400</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level('FINER', 400);

***REMOVED***
***REMOVED*** FINEST indicates a highly detailed tracing message.
***REMOVED*** This level is initialized to <CODE>300</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***

goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level('FINEST', 300);


***REMOVED***
***REMOVED*** ALL indicates that all messages should be logged.
***REMOVED*** This level is initialized to <CODE>0</CODE>.
***REMOVED*** @type {!goog.debug.Logger.Level}
***REMOVED***
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level('ALL', 0);


***REMOVED***
***REMOVED*** The predefined levels.
***REMOVED*** @type {!Array.<!goog.debug.Logger.Level>}
***REMOVED*** @final
***REMOVED***
goog.debug.Logger.Level.PREDEFINED_LEVELS = [
  goog.debug.Logger.Level.OFF,
  goog.debug.Logger.Level.SHOUT,
  goog.debug.Logger.Level.SEVERE,
  goog.debug.Logger.Level.WARNING,
  goog.debug.Logger.Level.INFO,
  goog.debug.Logger.Level.CONFIG,
  goog.debug.Logger.Level.FINE,
  goog.debug.Logger.Level.FINER,
  goog.debug.Logger.Level.FINEST,
  goog.debug.Logger.Level.ALL];


***REMOVED***
***REMOVED*** A lookup map used to find the level object based on the name or value of
***REMOVED*** the level object.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.Level.predefinedLevelsCache_ = null;


***REMOVED***
***REMOVED*** Creates the predefined levels cache and populates it.
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {***REMOVED***
  for (var i = 0, level; level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
       i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level;
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the predefined level with the given name.
***REMOVED*** @param {string} name The name of the level.
***REMOVED*** @return {goog.debug.Logger.Level} The level, or null if none found.
***REMOVED***
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }

  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the highest predefined level <= #value.
***REMOVED*** @param {number} value Level value.
***REMOVED*** @return {goog.debug.Logger.Level} The level, or null if none found.
***REMOVED***
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }

  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }

  for (var i = 0; i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length; ++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Finds or creates a logger for a named subsystem. If a logger has already been
***REMOVED*** created with the given name it is returned. Otherwise a new logger is
***REMOVED*** created. If a new logger is created its log level will be configured based
***REMOVED*** on the LogManager configuration and it will configured to also send logging
***REMOVED*** output to its parent's handlers. It will be registered in the LogManager
***REMOVED*** global namespace.
***REMOVED***
***REMOVED*** @param {string} name A name for the logger. This should be a dot-separated
***REMOVED*** name and should normally be based on the package name or class name of the
***REMOVED*** subsystem, such as goog.net.BrowserChannel.
***REMOVED*** @return {!goog.debug.Logger} The named logger.
***REMOVED*** @deprecated use goog.log instead. http://go/goog-debug-logger-deprecated
***REMOVED***
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message to profiling tools, if available.
***REMOVED*** {@see https://developers.google.com/web-toolkit/speedtracer/logging-api}
***REMOVED*** {@see http://msdn.microsoft.com/en-us/library/dd433074(VS.85).aspx}
***REMOVED*** @param {string} msg The message to log.
***REMOVED***
goog.debug.Logger.logToProfilers = function(msg) {
  // Using goog.global, as loggers might be used in window-less contexts.
  if (goog.global['console']) {
    if (goog.global['console']['timeStamp']) {
      // Logs a message to Firebug, Web Inspector, SpeedTracer, etc.
      goog.global['console']['timeStamp'](msg);
    } else if (goog.global['console']['markTimeline']) {
      // TODO(user): markTimeline is deprecated. Drop this else clause entirely
      // after Chrome M14 hits stable.
      goog.global['console']['markTimeline'](msg);
    }
  }

  if (goog.global['msWriteProfilerMark']) {
    // Logs a message to the Microsoft profiler
    goog.global['msWriteProfilerMark'](msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the name of this logger.
***REMOVED*** @return {string} The name of this logger.
***REMOVED***
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a handler to the logger. This doesn't use the event system because
***REMOVED*** we want to be able to add logging to the event system.
***REMOVED*** @param {Function} handler Handler function to add.
***REMOVED***
goog.debug.Logger.prototype.addHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      if (!this.handlers_) {
        this.handlers_ = [];
      }
      this.handlers_.push(handler);
    } else {
      goog.asserts.assert(!this.name_,
          'Cannot call addHandler on a non-root logger when ' +
          'goog.debug.Logger.ENABLE_HIERARCHY is false.');
      goog.debug.Logger.rootHandlers_.push(handler);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a handler from the logger. This doesn't use the event system because
***REMOVED*** we want to be able to add logging to the event system.
***REMOVED*** @param {Function} handler Handler function to remove.
***REMOVED*** @return {boolean} Whether the handler was removed.
***REMOVED***
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ :
        goog.debug.Logger.rootHandlers_;
    return !!handlers && goog.array.remove(handlers, handler);
  } else {
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the parent of this logger.
***REMOVED*** @return {goog.debug.Logger} The parent logger or null if this is the root.
***REMOVED***
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the children of this logger as a map of the child name to the logger.
***REMOVED*** @return {!Object} The map where the keys are the child leaf names and the
***REMOVED***     values are the Logger objects.
***REMOVED***
goog.debug.Logger.prototype.getChildren = function() {
  if (!this.children_) {
    this.children_ = {***REMOVED***
  }
  return this.children_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the log level specifying which message levels will be logged by this
***REMOVED*** logger. Message levels lower than this value will be discarded.
***REMOVED*** The level value Level.OFF can be used to turn off logging. If the new level
***REMOVED*** is null, it means that this node should inherit its level from its nearest
***REMOVED*** ancestor with a specific (non-null) level value.
***REMOVED***
***REMOVED*** @param {goog.debug.Logger.Level} level The new level.
***REMOVED***
goog.debug.Logger.prototype.setLevel = function(level) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      this.level_ = level;
    } else {
      goog.asserts.assert(!this.name_,
          'Cannot call setLevel() on a non-root logger when ' +
          'goog.debug.Logger.ENABLE_HIERARCHY is false.');
      goog.debug.Logger.rootLevel_ = level;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the log level specifying which message levels will be logged by this
***REMOVED*** logger. Message levels lower than this value will be discarded.
***REMOVED*** The level value Level.OFF can be used to turn off logging. If the level
***REMOVED*** is null, it means that this node should inherit its level from its nearest
***REMOVED*** ancestor with a specific (non-null) level value.
***REMOVED***
***REMOVED*** @return {goog.debug.Logger.Level} The level.
***REMOVED***
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ?
      this.level_ : goog.debug.Logger.Level.OFF;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the effective level of the logger based on its ancestors' levels.
***REMOVED*** @return {goog.debug.Logger.Level} The level.
***REMOVED***
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }

  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail('Root logger has no level set.');
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a message of the given level would actually be logged by this
***REMOVED*** logger. This check is based on the Loggers effective level, which may be
***REMOVED*** inherited from its parent.
***REMOVED*** @param {goog.debug.Logger.Level} level The level to check.
***REMOVED*** @return {boolean} Whether the message would be logged.
***REMOVED***
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED &&
      level.value >= this.getEffectiveLevel().value;
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message. If the logger is currently enabled for the
***REMOVED*** given message level then the given message is forwarded to all the
***REMOVED*** registered output Handler objects.
***REMOVED*** @param {goog.debug.Logger.Level} level One of the level identifiers.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error|Object=} opt_exception An exception associated with the
***REMOVED***     message.
***REMOVED***
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  // java caches the effective level, not sure it's necessary here
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(level)) {
    // Message callbacks can be useful when a log message is expensive to build.
    if (goog.isFunction(msg)) {
      msg = msg();
    }

    this.doLogRecord_(this.getLogRecord(
        level, msg, opt_exception, goog.debug.Logger.prototype.log));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new log record and adds the exception (if present) to it.
***REMOVED*** @param {goog.debug.Logger.Level} level One of the level identifiers.
***REMOVED*** @param {string} msg The string message.
***REMOVED*** @param {Error|Object=} opt_exception An exception associated with the
***REMOVED***     message.
***REMOVED*** @param {Function=} opt_fnStackContext A function to use as the base
***REMOVED***     of the stack trace used in the log record.
***REMOVED*** @return {!goog.debug.LogRecord} A log record.
***REMOVED*** @suppress {es5Strict}
***REMOVED***
goog.debug.Logger.prototype.getLogRecord = function(
    level, msg, opt_exception, opt_fnStackContext) {
  if (goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord =
        goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_);
  } else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_);
  }
  if (opt_exception) {
    var context;
    if (goog.STRICT_MODE_COMPATIBLE) {
      context = opt_fnStackContext || goog.debug.Logger.prototype.getLogRecord;
    } else {
      context = opt_fnStackContext || arguments.callee.caller;
    }

    logRecord.setException(opt_exception);
    logRecord.setExceptionText(
        goog.debug.exposeException(opt_exception,
            opt_fnStackContext || goog.debug.Logger.prototype.getLogRecord));
  }
  return logRecord;
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.SHOUT level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.SEVERE level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.WARNING level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.INFO level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.CONFIG level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.FINE level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.FINER level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINER, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message at the Logger.Level.FINEST level.
***REMOVED*** If the logger is currently enabled for the given message level then the
***REMOVED*** given message is forwarded to all the registered output Handler objects.
***REMOVED*** @param {goog.debug.Loggable} msg The message to log.
***REMOVED*** @param {Error=} opt_exception An exception associated with the message.
***REMOVED***
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a LogRecord. If the logger is currently enabled for the
***REMOVED*** given message level then the given message is forwarded to all the
***REMOVED*** registered output Handler objects.
***REMOVED*** @param {goog.debug.LogRecord} logRecord A log record to log.
***REMOVED***
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a LogRecord.
***REMOVED*** @param {goog.debug.LogRecord} logRecord A log record to log.
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers('log:' + logRecord.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this;
    while (target) {
      target.callPublish_(logRecord);
      target = target.getParent();
    }
  } else {
    for (var i = 0, handler; handler = goog.debug.Logger.rootHandlers_[i++]; ) {
      handler(logRecord);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls the handlers for publish.
***REMOVED*** @param {goog.debug.LogRecord} logRecord The log record to publish.
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler; handler = this.handlers_[i]; i++) {
      handler(logRecord);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the parent of this logger. This is used for setting up the logger tree.
***REMOVED*** @param {goog.debug.Logger} parent The parent logger.
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a child to this logger. This is used for setting up the logger tree.
***REMOVED*** @param {string} name The leaf name of the child.
***REMOVED*** @param {goog.debug.Logger} logger The child logger.
***REMOVED*** @private
***REMOVED***
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
***REMOVED***


***REMOVED***
***REMOVED*** There is a single global LogManager object that is used to maintain a set of
***REMOVED*** shared state about Loggers and log services. This is loosely based on the
***REMOVED*** java class java.util.logging.LogManager.
***REMOVED***
goog.debug.LogManager = {***REMOVED***


***REMOVED***
***REMOVED*** Map of logger names to logger objects.
***REMOVED***
***REMOVED*** @type {!Object.<string, !goog.debug.Logger>}
***REMOVED*** @private
***REMOVED***
goog.debug.LogManager.loggers_ = {***REMOVED***


***REMOVED***
***REMOVED*** The root logger which is the root of the logger tree.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.debug.LogManager.rootLogger_ = null;


***REMOVED***
***REMOVED*** Initializes the LogManager if not already initialized.
***REMOVED***
goog.debug.LogManager.initialize = function() {
  if (!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(
        goog.debug.Logger.ROOT_LOGGER_NAME);
    goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] =
        goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns all the loggers.
***REMOVED*** @return {!Object.<string, !goog.debug.Logger>} Map of logger names to logger
***REMOVED***     objects.
***REMOVED***
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the root of the logger tree namespace, the logger with the empty
***REMOVED*** string as its name.
***REMOVED***
***REMOVED*** @return {!goog.debug.Logger} The root logger.
***REMOVED***
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return***REMOVED*****REMOVED*** @type {!goog.debug.Logger}***REMOVED*** (goog.debug.LogManager.rootLogger_);
***REMOVED***


***REMOVED***
***REMOVED*** Finds a named logger.
***REMOVED***
***REMOVED*** @param {string} name A name for the logger. This should be a dot-separated
***REMOVED*** name and should normally be based on the package name or class name of the
***REMOVED*** subsystem, such as goog.net.BrowserChannel.
***REMOVED*** @return {!goog.debug.Logger} The named logger.
***REMOVED***
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that can be passed to goog.debug.catchErrors. The function
***REMOVED*** will log all reported errors using the given logger.
***REMOVED*** @param {goog.debug.Logger=} opt_logger The logger to log the errors to.
***REMOVED***     Defaults to the root logger.
***REMOVED*** @return {function(Object)} The created function.
***REMOVED***
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe('Error: ' + info.message + ' (' + info.fileName +
                  ' @ Line: ' + info.line + ')');
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates the named logger. Will also create the parents of the named logger
***REMOVED*** if they don't yet exist.
***REMOVED*** @param {string} name The name of the logger.
***REMOVED*** @return {!goog.debug.Logger} The named logger.
***REMOVED*** @private
***REMOVED***
goog.debug.LogManager.createLogger_ = function(name) {
  // find parent logger
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf('.');
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = goog.debug.LogManager.getLogger(parentName);

    // tell the parent about the child and the child about the parent
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }

  goog.debug.LogManager.loggers_[name] = logger;
  return logger;
***REMOVED***
