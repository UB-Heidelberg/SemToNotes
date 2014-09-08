// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of the ErrorReporter class, which creates an error
***REMOVED*** handler that reports any errors raised to a URL.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.ErrorReporter');
goog.provide('goog.debug.ErrorReporter.ExceptionEvent');

goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.debug.entryPointRegistry');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
***REMOVED***
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.uri.utils');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Constructs an error reporter. Internal Use Only. To install an error
***REMOVED*** reporter see the {@see #install} method below.
***REMOVED***
***REMOVED*** @param {string} handlerUrl The URL to which all errors will be reported.
***REMOVED*** @param {function(!Error, !Object.<string, string>)=}
***REMOVED***     opt_contextProvider When a report is to be sent to the server,
***REMOVED***     this method will be called, and given an opportunity to modify the
***REMOVED***     context object before submission to the server.
***REMOVED*** @param {boolean=} opt_noAutoProtect Whether to automatically add handlers for
***REMOVED***     onerror and to protect entry points.  If apps have other error reporting
***REMOVED***     facilities, it may make sense for them to set these up themselves and use
***REMOVED***     the ErrorReporter just for transmission of reports.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.debug.ErrorReporter = function(
    handlerUrl, opt_contextProvider, opt_noAutoProtect) {
  goog.debug.ErrorReporter.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Context provider, if one was provided.
  ***REMOVED*** @type {?function(!Error, !Object.<string, string>)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.contextProvider_ = opt_contextProvider || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The string prefix of any optional context parameters logged with the error.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.contextPrefix_ = 'context.';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of bytes after which the ErrorReporter truncates the POST body.
  ***REMOVED*** If null, the ErrorReporter won't truncate the body.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.truncationLimit_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Additional arguments to append to URL before sending XHR.
  ***REMOVED*** @private {!Object.<string,string>}
 ***REMOVED*****REMOVED***
  this.additionalArguments_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** XHR sender.
  ***REMOVED*** @type {function(string, string, string, (Object|goog.structs.Map)=)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xhrSender_ = goog.debug.ErrorReporter.defaultXhrSender;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL at which all errors caught by this handler will be logged.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handlerUrl_ = handlerUrl;

  if (goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT) {
    if (!opt_noAutoProtect) {
     ***REMOVED*****REMOVED***
      ***REMOVED*** The internal error handler used to catch all errors.
      ***REMOVED***
      ***REMOVED*** @private {goog.debug.ErrorHandler}
     ***REMOVED*****REMOVED***
      this.errorHandler_ = null;

      this.setup_();
    }
  } else if (!opt_noAutoProtect) {
    goog.asserts.fail(
        'opt_noAutoProtect cannot be false while ' +
        'goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT is false.  Setting ' +
        'ALLOW_AUTO_PROTECT to false removes the necessary auto-protect code ' +
        'in compiled/optimized mode.');
  }
***REMOVED***
goog.inherits(goog.debug.ErrorReporter, goog.events.EventTarget);


***REMOVED***
***REMOVED*** @define {boolean} If true, the code that provides additional entry point
***REMOVED***     protection and setup is exposed in this file.  Set to false to avoid
***REMOVED***     bringing in a lot of code from ErrorHandler and entryPointRegistry in
***REMOVED***     compiled mode.
***REMOVED***
goog.define('goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT', true);



***REMOVED***
***REMOVED*** Event broadcast when an exception is logged.
***REMOVED*** @param {Error} error The exception that was was reported.
***REMOVED*** @param {!Object.<string, string>} context The context values sent to the
***REMOVED***     server alongside this error.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.debug.ErrorReporter.ExceptionEvent = function(error, context) {
  goog.events.Event.call(this, goog.debug.ErrorReporter.ExceptionEvent.TYPE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The error that was reported.
  ***REMOVED*** @type {Error}
 ***REMOVED*****REMOVED***
  this.error = error;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Context values sent to the server alongside this report.
  ***REMOVED*** @type {!Object.<string, string>}
 ***REMOVED*****REMOVED***
  this.context = context;
***REMOVED***
goog.inherits(goog.debug.ErrorReporter.ExceptionEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Event type for notifying of a logged exception.
***REMOVED*** @type {string}
***REMOVED***
goog.debug.ErrorReporter.ExceptionEvent.TYPE =
    goog.events.getUniqueId('exception');


***REMOVED***
***REMOVED*** Extra headers for the error-reporting XHR.
***REMOVED*** @type {Object|goog.structs.Map|undefined}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.prototype.extraHeaders_;


***REMOVED***
***REMOVED*** Logging object.
***REMOVED***
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.logger_ =
    goog.log.getLogger('goog.debug.ErrorReporter');


***REMOVED***
***REMOVED*** Installs an error reporter to catch all JavaScript errors raised.
***REMOVED***
***REMOVED*** @param {string} loggingUrl The URL to which the errors caught will be
***REMOVED***     reported.
***REMOVED*** @param {function(!Error, !Object.<string, string>)=}
***REMOVED***     opt_contextProvider When a report is to be sent to the server,
***REMOVED***     this method will be called, and given an opportunity to modify the
***REMOVED***     context object before submission to the server.
***REMOVED*** @param {boolean=} opt_noAutoProtect Whether to automatically add handlers for
***REMOVED***     onerror and to protect entry points.  If apps have other error reporting
***REMOVED***     facilities, it may make sense for them to set these up themselves and use
***REMOVED***     the ErrorReporter just for transmission of reports.
***REMOVED*** @return {!goog.debug.ErrorReporter} The error reporter.
***REMOVED***
goog.debug.ErrorReporter.install = function(
    loggingUrl, opt_contextProvider, opt_noAutoProtect) {
  var instance = new goog.debug.ErrorReporter(
      loggingUrl, opt_contextProvider, opt_noAutoProtect);
  return instance;
***REMOVED***


***REMOVED***
***REMOVED*** Default implementation of XHR sender interface.
***REMOVED***
***REMOVED*** @param {string} uri URI to make request to.
***REMOVED*** @param {string} method Send method.
***REMOVED*** @param {string} content Post data.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED***
goog.debug.ErrorReporter.defaultXhrSender = function(uri, method, content,
    opt_headers) {
  goog.net.XhrIo.send(uri, null, method, content, opt_headers);
***REMOVED***


***REMOVED***
***REMOVED*** Installs exception protection for an entry point function in addition
***REMOVED*** to those that are protected by default.
***REMOVED*** Has no effect in IE because window.onerror is used for reporting
***REMOVED*** exceptions in that case.
***REMOVED***
***REMOVED*** @this {goog.debug.ErrorReporter}
***REMOVED*** @param {Function} fn An entry point function to be protected.
***REMOVED*** @return {Function} A protected wrapper function that calls the entry point
***REMOVED***     function or null if the entry point could not be protected.
***REMOVED***
goog.debug.ErrorReporter.prototype.protectAdditionalEntryPoint =
    goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT ?
    function(fn) {
      if (this.errorHandler_) {
        return this.errorHandler_.protectEntryPoint(fn);
      }
      return null;
    } :
    function(fn) {
      goog.asserts.fail(
          'Cannot call protectAdditionalEntryPoint while ALLOW_AUTO_PROTECT ' +
          'is false.  If ALLOW_AUTO_PROTECT is false, the necessary ' +
          'auto-protect code in compiled/optimized mode is removed.');
      return null;
   ***REMOVED*****REMOVED***


if (goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Sets up the error reporter.
  ***REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.debug.ErrorReporter.prototype.setup_ = function() {
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('10')) {
      // Use "onerror" because caught exceptions in IE don't provide line
      // number.
      goog.debug.catchErrors(
          goog.bind(this.handleException, this), false, null);
    } else {
      // "onerror" doesn't work with FF2 or Chrome
      this.errorHandler_ = new goog.debug.ErrorHandler(
          goog.bind(this.handleException, this));

      this.errorHandler_.protectWindowSetTimeout();
      this.errorHandler_.protectWindowSetInterval();
      this.errorHandler_.protectWindowRequestAnimationFrame();
      goog.debug.entryPointRegistry.monitorAll(this.errorHandler_);
    }
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Add headers to the logging url.
***REMOVED*** @param {Object|goog.structs.Map} loggingHeaders Extra headers to send
***REMOVED***     to the logging URL.
***REMOVED***
goog.debug.ErrorReporter.prototype.setLoggingHeaders =
    function(loggingHeaders) {
  this.extraHeaders_ = loggingHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Set the function used to send error reports to the server.
***REMOVED*** @param {function(string, string, string, (Object|goog.structs.Map)=)}
***REMOVED***     xhrSender If provided, this will be used to send a report to the
***REMOVED***     server instead of the default method. The function will be given the URI,
***REMOVED***     HTTP method request content, and (optionally) request headers to be
***REMOVED***     added.
***REMOVED***
goog.debug.ErrorReporter.prototype.setXhrSender = function(xhrSender) {
  this.xhrSender_ = xhrSender;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for caught exceptions. Sends report to the LoggingServlet and
***REMOVED*** notifies any listeners.
***REMOVED***
***REMOVED*** @param {Object} e The exception.
***REMOVED*** @param {!Object.<string, string>=} opt_context Context values to optionally
***REMOVED***     include in the error report.
***REMOVED***
goog.debug.ErrorReporter.prototype.handleException = function(e,
    opt_context) {
  var error =***REMOVED*****REMOVED*** @type {!Error}***REMOVED*** (goog.debug.normalizeErrorObject(e));

  // Construct the context, possibly from the one provided in the argument, and
  // pass it to the context provider if there is one.
  var context = opt_context ? goog.object.clone(opt_context) : {***REMOVED***
  if (this.contextProvider_) {
    try {
      this.contextProvider_(error, context);
    } catch (err) {
      goog.log.error(goog.debug.ErrorReporter.logger_,
          'Context provider threw an exception: ' + err.message);
    }
  }
  // Truncate message to a reasonable length, since it will be sent in the URL.
  var message = error.message.substring(0, 2000);
  this.sendErrorReport(message, error.fileName, error.lineNumber, error.stack,
      context);

  try {
    this.dispatchEvent(
        new goog.debug.ErrorReporter.ExceptionEvent(error, context));
  } catch (ex) {
    // Swallow exception to avoid infinite recursion.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends an error report to the logging URL.  This will not consult the context
***REMOVED*** provider, the report will be sent exactly as specified.
***REMOVED***
***REMOVED*** @param {string} message Error description.
***REMOVED*** @param {string} fileName URL of the JavaScript file with the error.
***REMOVED*** @param {number} line Line number of the error.
***REMOVED*** @param {string=} opt_trace Call stack trace of the error.
***REMOVED*** @param {!Object.<string, string>=} opt_context Context information to include
***REMOVED***     in the request.
***REMOVED***
goog.debug.ErrorReporter.prototype.sendErrorReport =
    function(message, fileName, line, opt_trace, opt_context) {
  try {
    // Create the logging URL.
    var requestUrl = goog.uri.utils.appendParams(this.handlerUrl_,
        'script', fileName, 'error', message, 'line', line);

    if (!goog.object.isEmpty(this.additionalArguments_)) {
      requestUrl = goog.uri.utils.appendParamsFromMap(requestUrl,
          this.additionalArguments_);
    }

    var queryMap = {***REMOVED***
    queryMap['trace'] = opt_trace;

    // Copy context into query data map
    if (opt_context) {
      for (var entry in opt_context) {
        queryMap[this.contextPrefix_ + entry] = opt_context[entry];
      }
    }

    // Copy query data map into request.
    var queryData = goog.uri.utils.buildQueryDataFromMap(queryMap);

    // Truncate if truncationLimit set.
    if (goog.isNumber(this.truncationLimit_)) {
      queryData = queryData.substring(0, this.truncationLimit_);
    }

    // Send the request with the contents of the error.
    this.xhrSender_(requestUrl, 'POST', queryData, this.extraHeaders_);
  } catch (e) {
    var logMessage = goog.string.buildString(
        'Error occurred in sending an error report.\n\n',
        'script:', fileName, '\n',
        'line:', line, '\n',
        'error:', message, '\n',
        'trace:', opt_trace);
    goog.log.info(goog.debug.ErrorReporter.logger_, logMessage);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} prefix The prefix to appear prepended to all context
***REMOVED***     variables in the error report body.
***REMOVED***
goog.debug.ErrorReporter.prototype.setContextPrefix = function(prefix) {
  this.contextPrefix_ = prefix;
***REMOVED***


***REMOVED***
***REMOVED*** @param {?number} limit Size in bytes to begin truncating POST body.  Set to
***REMOVED***     null to prevent truncation.  The limit must be >= 0.
***REMOVED***
goog.debug.ErrorReporter.prototype.setTruncationLimit = function(limit) {
  goog.asserts.assert(!goog.isNumber(limit) || limit >= 0,
      'Body limit must be valid number >= 0 or null');
  this.truncationLimit_ = limit;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Object.<string,string>} urlArgs Set of key-value pairs to append
***REMOVED***     to handlerUrl_ before sending XHR.
***REMOVED***
goog.debug.ErrorReporter.prototype.setAdditionalArguments = function(urlArgs) {
  this.additionalArguments_ = urlArgs;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.debug.ErrorReporter.prototype.disposeInternal = function() {
  if (goog.debug.ErrorReporter.ALLOW_AUTO_PROTECT) {
    goog.dispose(this.errorHandler_);
  }
  goog.debug.ErrorReporter.base(this, 'disposeInternal');
***REMOVED***
