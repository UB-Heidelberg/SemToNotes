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

goog.require('goog.debug');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.debug.Logger');
goog.require('goog.debug.entryPointRegistry');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
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
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Context provider, if one was provided.
  ***REMOVED*** @type {?function(!Error, !Object.<string, string>)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.contextProvider_ = opt_contextProvider || null;

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

  if (!opt_noAutoProtect) {
    this.setup_();
  }
***REMOVED***
goog.inherits(goog.debug.ErrorReporter, goog.events.EventTarget);



***REMOVED***
***REMOVED*** Event broadcast when an exception is logged.
***REMOVED*** @param {Error} error The exception that was was reported.
***REMOVED*** @param {!Object.<string, string>} context The context values sent to the
***REMOVED***     server alongside this error.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
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
***REMOVED*** The internal error handler used to catch all errors.
***REMOVED***
***REMOVED*** @type {goog.debug.ErrorHandler}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.prototype.errorHandler_ = null;


***REMOVED***
***REMOVED*** Extra headers for the error-reporting XHR.
***REMOVED*** @type {Object|goog.structs.Map|undefined}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.prototype.extraHeaders_;


***REMOVED***
***REMOVED*** Logging object.
***REMOVED***
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.logger_ =
    goog.debug.Logger.getLogger('goog.debug.ErrorReporter');


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
***REMOVED*** @return {goog.debug.ErrorReporter} The error reporter.
***REMOVED***
goog.debug.ErrorReporter.install = function(
    loggingUrl, opt_contextProvider, opt_noAutoProtect) {
  var instance = new goog.debug.ErrorReporter(
      loggingUrl, opt_contextProvider, opt_noAutoProtect);
  return instance;
***REMOVED***


***REMOVED***
***REMOVED*** Default implemntation of XHR sender interface.
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
***REMOVED*** @param {Function} fn An entry point function to be protected.
***REMOVED*** @return {Function} A protected wrapper function that calls the entry point
***REMOVED***     function or null if the entry point could not be protected.
***REMOVED***
goog.debug.ErrorReporter.prototype.protectAdditionalEntryPoint = function(fn) {
  if (this.errorHandler_) {
    return this.errorHandler_.protectEntryPoint(fn);
  }
  return null;
***REMOVED***


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
***REMOVED*** Sets up the error reporter.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorReporter.prototype.setup_ = function() {
  if (goog.userAgent.IE) {
    // Use "onerror" because caught exceptions in IE don't provide line number.
    goog.debug.catchErrors(
        goog.bind(this.handleException, this), false, null);
  } else {
    // "onerror" doesn't work with FF2 or Chrome
    this.errorHandler_ = new goog.debug.ErrorHandler(
        goog.bind(this.handleException, this));

    this.errorHandler_.protectWindowSetTimeout();
    this.errorHandler_.protectWindowSetInterval();
    goog.debug.entryPointRegistry.monitorAll(this.errorHandler_);
  }
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
      goog.debug.ErrorReporter.logger_.severe('Context provider threw an ' +
          'exception: ' + err.message);
    }
  }
  this.sendErrorReport(error.message, error.fileName, error.lineNumber,
      error.stack, context);

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
    var queryMap = {***REMOVED***
    queryMap['trace'] = opt_trace;

    // Copy context into query data map
    if (opt_context) {
      for (var entry in opt_context) {
        queryMap['context.' + entry] = opt_context[entry];
      }
    }

    // Copy query data map into request.
    var queryData = goog.uri.utils.buildQueryDataFromMap(queryMap);

    // Send the request with the contents of the error.
    this.xhrSender_(requestUrl, 'POST', queryData, this.extraHeaders_);
  } catch (e) {
    var logMessage = goog.string.buildString(
        'Error occurred in sending an error report.\n\n',
        'script:', fileName, '\n',
        'line:', line, '\n',
        'error:', message, '\n',
        'trace:', opt_trace);
    goog.debug.ErrorReporter.logger_.info(logMessage);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.debug.ErrorReporter.prototype.disposeInternal = function() {
  goog.dispose(this.errorHandler_);
  goog.base(this, 'disposeInternal');
***REMOVED***
