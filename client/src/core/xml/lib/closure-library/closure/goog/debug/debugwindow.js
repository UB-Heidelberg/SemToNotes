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
***REMOVED*** @fileoverview Definition of the DebugWindow class. Please minimize
***REMOVED*** dependencies this file has on other closure classes as any dependency it
***REMOVED*** takes won't be able to use the logging infrastructure.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.DebugWindow');

goog.require('goog.debug.HtmlFormatter');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.structs.CircularBuffer');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Provides a debug DebugWindow that is bound to the goog.debug.Logger.
***REMOVED*** It handles log messages and writes them to the DebugWindow. This doesn't
***REMOVED*** provide a lot of functionality that the old Gmail logging infrastructure
***REMOVED*** provided like saving debug logs for exporting to the server. Now that we
***REMOVED*** have an event-based logging infrastructure, we can encapsulate that
***REMOVED*** functionality in a separate class.
***REMOVED***
***REMOVED***
***REMOVED*** @param {string=} opt_identifier Identifier for this logging class.
***REMOVED*** @param {string=} opt_prefix Prefix prepended to messages.
***REMOVED***
goog.debug.DebugWindow = function(opt_identifier, opt_prefix) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Identifier for this logging class
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.identifier_ = opt_identifier || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional prefix to be prepended to error strings
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.prefix_ = opt_prefix || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array used to buffer log output
  ***REMOVED*** @type {Array}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.outputBuffer_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Buffer for saving the last 1000 messages
  ***REMOVED*** @type {goog.structs.CircularBuffer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.savedMessages_ =
      new goog.structs.CircularBuffer(goog.debug.DebugWindow.MAX_SAVED);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Save the publish handler so it can be removed
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.publishHandler_ = goog.bind(this.addLogRecord, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Formatter for formatted output
  ***REMOVED*** @type {goog.debug.Formatter}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.formatter_ = new goog.debug.HtmlFormatter(this.prefix_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Loggers that we shouldn't output
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.filteredLoggers_ = {***REMOVED***

  // enable by default
  this.setCapturing(true);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we are currently enabled. When the DebugWindow is enabled, it tries
  ***REMOVED*** to keep its window open. When it's disabled, it can still be capturing log
  ***REMOVED*** output if, but it won't try to write them to the DebugWindow window until
  ***REMOVED*** it's enabled.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.enabled_ = goog.debug.DebugWindow.isEnabled(this.identifier_);

  // timer to save the DebugWindow's window position in a cookie
  goog.global.setInterval(goog.bind(this.saveWindowPositionSize_, this), 7500);
***REMOVED***


***REMOVED***
***REMOVED*** Max number of messages to be saved
***REMOVED*** @type {number}
***REMOVED***
goog.debug.DebugWindow.MAX_SAVED = 500;


***REMOVED***
***REMOVED*** How long to keep the cookies for in milliseconds
***REMOVED*** @type {number}
***REMOVED***
goog.debug.DebugWindow.COOKIE_TIME = 30***REMOVED*** 24***REMOVED*** 60***REMOVED*** 60***REMOVED*** 1000; // 30-days


***REMOVED***
***REMOVED*** HTML string printed when the debug window opens
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.debug.DebugWindow.prototype.welcomeMessage = 'LOGGING';


***REMOVED***
***REMOVED*** Whether to force enable the window on a severe log.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.enableOnSevere_ = false;


***REMOVED***
***REMOVED*** Reference to debug window
***REMOVED*** @type {Window}
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.debug.DebugWindow.prototype.win_ = null;


***REMOVED***
***REMOVED*** In the process of opening the window
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.winOpening_ = false;


***REMOVED***
***REMOVED*** Whether we are currently capturing logger output.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.isCapturing_ = false;


***REMOVED***
***REMOVED*** Whether we already showed an alert that the DebugWindow was blocked.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.showedBlockedAlert_ = false;


***REMOVED***
***REMOVED*** Reference to timeout used to buffer the output stream.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.bufferTimeout_ = null;


***REMOVED***
***REMOVED*** Timestamp for the last time the log was written to.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.debug.DebugWindow.prototype.lastCall_ = goog.now();


***REMOVED***
***REMOVED*** Sets the welcome message shown when the window is first opened or reset.
***REMOVED***
***REMOVED*** @param {string} msg An HTML string.
***REMOVED***
goog.debug.DebugWindow.prototype.setWelcomeMessage = function(msg) {
  this.welcomeMessage = msg;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the debug window.
***REMOVED***
goog.debug.DebugWindow.prototype.init = function() {
  if (this.enabled_) {
    this.openWindow_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether the DebugWindow is enabled. When the DebugWindow is enabled, it
***REMOVED*** tries to keep its window open and logs all messages to the window.  When the
***REMOVED*** DebugWindow is disabled, it stops logging messages to its window.
***REMOVED***
***REMOVED*** @return {boolean} Whether the DebugWindow is enabled.
***REMOVED***
goog.debug.DebugWindow.prototype.isEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the DebugWindow is enabled. When the DebugWindow is enabled, it
***REMOVED*** tries to keep its window open and log all messages to the window. When the
***REMOVED*** DebugWindow is disabled, it stops logging messages to its window. The
***REMOVED*** DebugWindow also saves this state to a cookie so that it's persisted across
***REMOVED*** application refreshes.
***REMOVED*** @param {boolean} enable Whether the DebugWindow is enabled.
***REMOVED***
goog.debug.DebugWindow.prototype.setEnabled = function(enable) {
  this.enabled_ = enable;

  if (this.enabled_) {
    this.openWindow_();
  }

  this.setCookie_('enabled', enable ? '1' : '0');
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the debug window should be force enabled when a severe log is
***REMOVED*** encountered.
***REMOVED*** @param {boolean} enableOnSevere Whether to enable on severe logs..
***REMOVED***
goog.debug.DebugWindow.prototype.setForceEnableOnSevere =
    function(enableOnSevere) {
  this.enableOnSevere_ = enableOnSevere;
***REMOVED***


***REMOVED***
***REMOVED*** Whether we are currently capturing logger output.
***REMOVED*** @return {boolean} whether we are currently capturing logger output.
***REMOVED***
goog.debug.DebugWindow.prototype.isCapturing = function() {
  return this.isCapturing_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether we are currently capturing logger output.
***REMOVED*** @param {boolean} capturing Whether to capture logger output.
***REMOVED***
goog.debug.DebugWindow.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }
  this.isCapturing_ = capturing;

  // attach or detach handler from the root logger
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the formatter for outputting to the debug window. The default formatter
***REMOVED*** is an instance of goog.debug.HtmlFormatter
***REMOVED*** @return {goog.debug.Formatter} The formatter in use.
***REMOVED***
goog.debug.DebugWindow.prototype.getFormatter = function() {
  return this.formatter_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the formatter for outputting to the debug window.
***REMOVED*** @param {goog.debug.Formatter} formatter The formatter to use.
***REMOVED***
goog.debug.DebugWindow.prototype.setFormatter = function(formatter) {
  this.formatter_ = formatter;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a separator to the debug window.
***REMOVED***
goog.debug.DebugWindow.prototype.addSeparator = function() {
  this.write_('<hr>');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there is an active window.
***REMOVED***
goog.debug.DebugWindow.prototype.hasActiveWindow = function() {
  return !!this.win_ && !this.win_.closed;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the contents of the debug window
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.debug.DebugWindow.prototype.clear_ = function() {
  this.savedMessages_.clear();
  if (this.hasActiveWindow()) {
    this.writeInitialDocument();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a log record.
***REMOVED*** @param {goog.debug.LogRecord} logRecord the LogRecord.
***REMOVED***
goog.debug.DebugWindow.prototype.addLogRecord = function(logRecord) {
  if (this.filteredLoggers_[logRecord.getLoggerName()]) {
    return;
  }
  var html = this.formatter_.formatRecord(logRecord);
  this.write_(html);
  if (this.enableOnSevere_ &&
      logRecord.getLevel().value >= goog.debug.Logger.Level.SEVERE.value) {
    this.setEnabled(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Writes a message to the log, possibly opening up the window if it's enabled,
***REMOVED*** or saving it if it's disabled.
***REMOVED*** @param {string} html The HTML to write.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.write_ = function(html) {
  // If the logger is enabled, open window and write html message to log
  // otherwise save it
  if (this.enabled_) {
    this.openWindow_();
    this.savedMessages_.add(html);
    this.writeToLog_(html);
  } else {
    this.savedMessages_.add(html);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Write to the buffer.  If a message hasn't been sent for more than 750ms just
***REMOVED*** write, otherwise delay for a minimum of 250ms.
***REMOVED*** @param {string} html HTML to post to the log.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.writeToLog_ = function(html) {
  this.outputBuffer_.push(html);
  goog.global.clearTimeout(this.bufferTimeout_);

  if (goog.now() - this.lastCall_ > 750) {
    this.writeBufferToLog();
  } else {
    this.bufferTimeout_ =
        goog.global.setTimeout(goog.bind(this.writeBufferToLog, this), 250);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Write to the log and maybe scroll into view.
***REMOVED*** @protected
***REMOVED***
goog.debug.DebugWindow.prototype.writeBufferToLog = function() {
  this.lastCall_ = goog.now();
  if (this.hasActiveWindow()) {
    var body = this.win_.document.body;
    var scroll = body &&
        body.scrollHeight - (body.scrollTop + body.clientHeight) <= 100;

    this.win_.document.write(this.outputBuffer_.join(''));
    this.outputBuffer_.length = 0;

    if (scroll) {
      this.win_.scrollTo(0, 1000000);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Writes all saved messages to the DebugWindow.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.debug.DebugWindow.prototype.writeSavedMessages_ = function() {
  var messages = this.savedMessages_.getValues();
  for (var i = 0; i < messages.length; i++) {
    this.writeToLog_(messages[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Opens the debug window if it is not already referenced
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.openWindow_ = function() {
  if (this.hasActiveWindow() || this.winOpening_) {
    return;
  }

  var winpos = this.getCookie_('dbg', '0,0,800,500').split(',');
  var x = Number(winpos[0]);
  var y = Number(winpos[1]);
  var w = Number(winpos[2]);
  var h = Number(winpos[3]);

  this.winOpening_ = true;
  this.win_ = window.open('', this.getWindowName_(), 'width=' + w +
                          ',height=' + h + ',toolbar=no,resizable=yes,' +
                          'scrollbars=yes,left=' + x + ',top=' + y +
                          ',status=no,screenx=' + x + ',screeny=' + y);

  if (!this.win_) {
    if (!this.showedBlockedAlert_) {
      // only show this once
      alert('Logger popup was blocked');
      this.showedBlockedAlert_ = true;
    }
  }

  this.winOpening_ = false;

  if (this.win_) {
    this.writeInitialDocument();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a valid window name for the debug window. Replaces invalid characters in
***REMOVED*** IE.
***REMOVED*** @return {string} Valid window name.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.getWindowName_ = function() {
  return goog.userAgent.IE ?
      this.identifier_.replace(/[\s\-\.\,]/g, '_') : this.identifier_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The style rule text, for inclusion in the initial HTML.
***REMOVED***
goog.debug.DebugWindow.prototype.getStyleRules = function() {
  return '*{font:normal 14px monospace;}' +
         '.dbg-sev{color:#F00}' +
         '.dbg-w{color:#E92}' +
         '.dbg-sh{background-color:#fd4;font-weight:bold;color:#000}' +
         '.dbg-i{color:#666}' +
         '.dbg-f{color:#999}' +
         '.dbg-ev{color:#0A0}' +
         '.dbg-m{color:#990}';
***REMOVED***


***REMOVED***
***REMOVED*** Writes the initial HTML of the debug window.
***REMOVED*** @protected
***REMOVED***
goog.debug.DebugWindow.prototype.writeInitialDocument = function() {
  if (!this.hasActiveWindow()) {
    return;
  }

  this.win_.document.open();

  var html = '<style>' + this.getStyleRules() + '</style>' +
             '<hr><div class="dbg-ev" style="text-align:center">' +
             this.welcomeMessage + '<br><small>Logger: ' +
             this.identifier_ + '</small></div><hr>';

  this.writeToLog_(html);
  this.writeSavedMessages_();
***REMOVED***


***REMOVED***
***REMOVED*** Save persistent data (using cookies) for 1 month (cookie specific to this
***REMOVED*** logger object).
***REMOVED*** @param {string} key Data name.
***REMOVED*** @param {string} value Data value.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.setCookie_ = function(key, value) {
  var fullKey = goog.debug.DebugWindow.getCookieKey_(this.identifier_, key);
  document.cookie = fullKey + '=' + encodeURIComponent(value) +
      ';path=/;expires=' +
      (new Date(goog.now() + goog.debug.DebugWindow.COOKIE_TIME)).toUTCString();
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve data (using cookies).
***REMOVED*** @param {string} key Data name.
***REMOVED*** @param {string=} opt_default Optional default value if cookie doesn't exist.
***REMOVED*** @return {string} Cookie value.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.getCookie_ = function(key, opt_default) {
  return goog.debug.DebugWindow.getCookieValue_(
      this.identifier_, key, opt_default);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a valid cookie key name which is scoped to the given identifier.
***REMOVED*** Substitutes all occurences of invalid cookie name characters (whitespace,
***REMOVED*** ';', and '=') with '_', which is a valid and readable alternative.
***REMOVED*** @see goog.net.Cookies#isValidName
***REMOVED*** @see <a href="http://tools.ietf.org/html/rfc2109">RFC 2109</a>
***REMOVED*** @param {string} identifier Identifier for logging class.
***REMOVED*** @param {string} key Data name.
***REMOVED*** @return {string} Cookie key name.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.getCookieKey_ = function(identifier, key) {
  var fullKey = key + identifier;
  return fullKey.replace(/[;=\s]/g, '_');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve data (using cookies).
***REMOVED*** @param {string} identifier Identifier for logging class.
***REMOVED*** @param {string} key Data name.
***REMOVED*** @param {string=} opt_default Optional default value if cookie doesn't exist.
***REMOVED*** @return {string} Cookie value.
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.getCookieValue_ = function(
    identifier, key, opt_default) {
  var fullKey = goog.debug.DebugWindow.getCookieKey_(identifier, key);
  var cookie = String(document.cookie);
  var start = cookie.indexOf(fullKey + '=');
  if (start != -1) {
    var end = cookie.indexOf(';', start);
    return decodeURIComponent(cookie.substring(start + fullKey.length + 1,
        end == -1 ? cookie.length : end));
  } else {
    return opt_default || '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} identifier Identifier for logging class.
***REMOVED*** @return {boolean} Whether the DebugWindow is enabled.
***REMOVED***
goog.debug.DebugWindow.isEnabled = function(identifier) {
  return goog.debug.DebugWindow.getCookieValue_(identifier, 'enabled') == '1';
***REMOVED***


***REMOVED***
***REMOVED*** Saves the window position size to a cookie
***REMOVED*** @private
***REMOVED***
goog.debug.DebugWindow.prototype.saveWindowPositionSize_ = function() {
  if (!this.hasActiveWindow()) {
    return;
  }
  var x = this.win_.screenX || this.win_.screenLeft || 0;
  var y = this.win_.screenY || this.win_.screenTop || 0;
  var w = this.win_.outerWidth || 800;
  var h = this.win_.outerHeight || 500;
  this.setCookie_('dbg', x + ',' + y + ',' + w + ',' + h);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a logger name to be filtered.
***REMOVED*** @param {string} loggerName the logger name to add.
***REMOVED***
goog.debug.DebugWindow.prototype.addFilter = function(loggerName) {
  this.filteredLoggers_[loggerName] = 1;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a logger name to be filtered.
***REMOVED*** @param {string} loggerName the logger name to remove.
***REMOVED***
goog.debug.DebugWindow.prototype.removeFilter = function(loggerName) {
  delete this.filteredLoggers_[loggerName];
***REMOVED***


***REMOVED***
***REMOVED*** Modify the size of the circular buffer. Allows the log to retain more
***REMOVED*** information while the window is closed.
***REMOVED*** @param {number} size New size of the circular buffer.
***REMOVED***
goog.debug.DebugWindow.prototype.resetBufferWithNewSize = function(size) {
  if (size > 0 && size < 50000) {
    this.clear_();
    this.savedMessages_ = new goog.structs.CircularBuffer(size);
  }
***REMOVED***
