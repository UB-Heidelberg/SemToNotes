// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Error handling utilities.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.ErrorHandler');
goog.provide('goog.debug.ErrorHandler.ProtectedFunctionError');

goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.debug.EntryPointMonitor');
goog.require('goog.debug.Trace');



***REMOVED***
***REMOVED*** The ErrorHandler can be used to to wrap functions with a try/catch
***REMOVED*** statement. If an exception is thrown, the given error handler function will
***REMOVED*** be called.
***REMOVED***
***REMOVED*** When this object is disposed, it will stop handling exceptions and tracing.
***REMOVED*** It will also try to restore window.setTimeout and window.setInterval
***REMOVED*** if it wrapped them. Notice that in the general case, it is not technically
***REMOVED*** possible to remove the wrapper, because functions have no knowledge of
***REMOVED*** what they have been assigned to. So the app is responsible for other
***REMOVED*** forms of unwrapping.
***REMOVED***
***REMOVED*** @param {Function} handler Handler for exceptions.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.debug.EntryPointMonitor}
***REMOVED***
goog.debug.ErrorHandler = function(handler) {
  goog.debug.ErrorHandler.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler for exceptions, which can do logging, reporting, etc.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.errorHandlerFn_ = handler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether errors should be wrapped in
  ***REMOVED*** goog.debug.ErrorHandler.ProtectedFunctionError before rethrowing.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.wrapErrors_ = true;  // TODO(user) Change default.

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to add a prefix to all error messages. The prefix is
  ***REMOVED*** goog.debug.ErrorHandler.ProtectedFunctionError.MESSAGE_PREFIX. This option
  ***REMOVED*** only has an effect if this.wrapErrors_  is set to false.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.prefixErrorMessages_ = false;
***REMOVED***
goog.inherits(goog.debug.ErrorHandler, goog.Disposable);


***REMOVED***
***REMOVED*** Whether to add tracers when instrumenting entry points.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorHandler.prototype.addTracersToProtectedFunctions_ = false;


***REMOVED***
***REMOVED*** Enable tracers when instrumenting entry points.
***REMOVED*** @param {boolean} newVal See above.
***REMOVED***
goog.debug.ErrorHandler.prototype.setAddTracersToProtectedFunctions =
    function(newVal) {
  this.addTracersToProtectedFunctions_ = newVal;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.debug.ErrorHandler.prototype.wrap = function(fn) {
  return this.protectEntryPoint(goog.asserts.assertFunction(fn));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.debug.ErrorHandler.prototype.unwrap = function(fn) {
  goog.asserts.assertFunction(fn);
  return fn[this.getFunctionIndex_(false)] || fn;
***REMOVED***


***REMOVED***
***REMOVED*** Private helper function to return a span that can be clicked on to display
***REMOVED*** an alert with the current stack trace. Newlines are replaced with a
***REMOVED*** placeholder so that they will not be html-escaped.
***REMOVED*** @param {string} stackTrace The stack trace to create a span for.
***REMOVED*** @return {string} A span which can be clicked on to show the stack trace.
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorHandler.prototype.getStackTraceHolder_ = function(stackTrace) {
  var buffer = [];
  buffer.push('##PE_STACK_START##');
  buffer.push(stackTrace.replace(/(\r\n|\r|\n)/g, '##STACK_BR##'));
  buffer.push('##PE_STACK_END##');
  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Get the index for a function. Used for internal indexing.
***REMOVED*** @param {boolean} wrapper True for the wrapper; false for the wrapped.
***REMOVED*** @return {string} The index where we should store the function in its
***REMOVED***     wrapper/wrapped function.
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorHandler.prototype.getFunctionIndex_ = function(wrapper) {
  return (wrapper ? '__wrapper_' : '__protected_') + goog.getUid(this) + '__';
***REMOVED***


***REMOVED***
***REMOVED*** Installs exception protection for an entry point function. When an exception
***REMOVED*** is thrown from a protected function, a handler will be invoked to handle it.
***REMOVED***
***REMOVED*** @param {Function} fn An entry point function to be protected.
***REMOVED*** @return {!Function} A protected wrapper function that calls the entry point
***REMOVED***     function.
***REMOVED***
goog.debug.ErrorHandler.prototype.protectEntryPoint = function(fn) {
  var protectedFnName = this.getFunctionIndex_(true);
  if (!fn[protectedFnName]) {
    var wrapper = fn[protectedFnName] = this.getProtectedFunction(fn);
    wrapper[this.getFunctionIndex_(false)] = fn;
  }
  return fn[protectedFnName];
***REMOVED***


***REMOVED***
***REMOVED*** Helps {@link #protectEntryPoint} by actually creating the protected
***REMOVED*** wrapper function, after {@link #protectEntryPoint} determines that one does
***REMOVED*** not already exist for the given function.  Can be overriden by subclasses
***REMOVED*** that may want to implement different error handling, or add additional
***REMOVED*** entry point hooks.
***REMOVED*** @param {!Function} fn An entry point function to be protected.
***REMOVED*** @return {!Function} protected wrapper function.
***REMOVED*** @protected
***REMOVED***
goog.debug.ErrorHandler.prototype.getProtectedFunction = function(fn) {
  var that = this;
  var tracers = this.addTracersToProtectedFunctions_;
  if (tracers) {
    var stackTrace = goog.debug.getStacktraceSimple(15);
  }
  var googDebugErrorHandlerProtectedFunction = function() {
    if (that.isDisposed()) {
      return fn.apply(this, arguments);
    }

    if (tracers) {
      var tracer = goog.debug.Trace.startTracer('protectedEntryPoint: ' +
          that.getStackTraceHolder_(stackTrace));
    }
    try {
      return fn.apply(this, arguments);
    } catch (e) {
      that.errorHandlerFn_(e);
      if (!that.wrapErrors_) {
        // Add the prefix to the existing message.
        if (that.prefixErrorMessages_) {
          if (typeof e === 'object') {
            e.message =
                goog.debug.ErrorHandler.ProtectedFunctionError.MESSAGE_PREFIX +
                e.message;
          } else {
            e = goog.debug.ErrorHandler.ProtectedFunctionError.MESSAGE_PREFIX +
                e;
          }
        }
        if (goog.DEBUG) {
          // Work around for https://code.google.com/p/v8/issues/detail?id=2625
          // and https://code.google.com/p/chromium/issues/detail?id=237059
          // Custom errors and errors with custom stack traces show the wrong
          // stack trace
          // If it has a stack and Error.captureStackTrace is supported (only
          // supported in V8 as of May 2013) log the stack to the console.
          if (e && e.stack && Error.captureStackTrace &&
              goog.global['console']) {
            goog.global['console']['error'](e.message, e.stack);
          }
        }
        // Re-throw original error. This is great for debugging as it makes
        // browser JS dev consoles show the correct error and stack trace.
        throw e;
      }
      // Re-throw it since this may be expected by the caller.
      throw new goog.debug.ErrorHandler.ProtectedFunctionError(e);
    } finally {
      if (tracers) {
        goog.debug.Trace.stopTracer(tracer);
      }
    }
 ***REMOVED*****REMOVED***
  googDebugErrorHandlerProtectedFunction[this.getFunctionIndex_(false)] = fn;
  return googDebugErrorHandlerProtectedFunction;
***REMOVED***


// TODO(user): Allow these functions to take in the window to protect.
***REMOVED***
***REMOVED*** Installs exception protection for window.setTimeout to handle exceptions.
***REMOVED***
goog.debug.ErrorHandler.prototype.protectWindowSetTimeout =
    function() {
  this.protectWindowFunctionsHelper_('setTimeout');
***REMOVED***


***REMOVED***
***REMOVED*** Install exception protection for window.setInterval to handle exceptions.
***REMOVED***
goog.debug.ErrorHandler.prototype.protectWindowSetInterval =
    function() {
  this.protectWindowFunctionsHelper_('setInterval');
***REMOVED***


***REMOVED***
***REMOVED*** Install exception protection for window.requestAnimationFrame to handle
***REMOVED*** exceptions.
***REMOVED***
goog.debug.ErrorHandler.prototype.protectWindowRequestAnimationFrame =
    function() {
  var win = goog.getObjectByName('window');
  var fnNames = [
    'requestAnimationFrame',
    'mozRequestAnimationFrame',
    'webkitAnimationFrame',
    'msRequestAnimationFrame'
  ];
  for (var i = 0; i < fnNames.length; i++) {
    var fnName = fnNames[i];
    if (fnNames[i] in win) {
      this.protectWindowFunctionsHelper_(fnName);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for protecting a function that causes a function to be
***REMOVED*** asynchronously called, for example setTimeout or requestAnimationFrame.
***REMOVED*** @param {string} fnName The name of the function to protect.
***REMOVED*** @private
***REMOVED***
goog.debug.ErrorHandler.prototype.protectWindowFunctionsHelper_ =
    function(fnName) {
  var win = goog.getObjectByName('window');
  var originalFn = win[fnName];
  var that = this;
  win[fnName] = function(fn, time) {
    // Don't try to protect strings. In theory, we could try to globalEval
    // the string, but this seems to lead to permission errors on IE6.
    if (goog.isString(fn)) {
      fn = goog.partial(goog.globalEval, fn);
    }
    fn = that.protectEntryPoint(fn);

    // IE doesn't support .call for setInterval/setTimeout, but it
    // also doesn't care what "this" is, so we can just call the
    // original function directly
    if (originalFn.call) {
      return originalFn.call(this, fn, time);
    } else {
      return originalFn(fn, time);
    }
 ***REMOVED*****REMOVED***
  win[fnName][this.getFunctionIndex_(false)] = originalFn;
***REMOVED***


***REMOVED***
***REMOVED*** Set whether to wrap errors that occur in protected functions in a
***REMOVED*** goog.debug.ErrorHandler.ProtectedFunctionError.
***REMOVED*** @param {boolean} wrapErrors Whether to wrap errors.
***REMOVED***
goog.debug.ErrorHandler.prototype.setWrapErrors = function(wrapErrors) {
  this.wrapErrors_ = wrapErrors;
***REMOVED***


***REMOVED***
***REMOVED*** Set whether to add a prefix to all error messages that occur in protected
***REMOVED*** functions.
***REMOVED*** @param {boolean} prefixErrorMessages Whether to add a prefix to error
***REMOVED***     messages.
***REMOVED***
goog.debug.ErrorHandler.prototype.setPrefixErrorMessages =
    function(prefixErrorMessages) {
  this.prefixErrorMessages_ = prefixErrorMessages;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.debug.ErrorHandler.prototype.disposeInternal = function() {
  // Try to unwrap window.setTimeout and window.setInterval.
  var win = goog.getObjectByName('window');
  win.setTimeout = this.unwrap(win.setTimeout);
  win.setInterval = this.unwrap(win.setInterval);

  goog.debug.ErrorHandler.base(this, 'disposeInternal');
***REMOVED***



***REMOVED***
***REMOVED*** Error thrown to the caller of a protected entry point if the entry point
***REMOVED*** throws an error.
***REMOVED*** @param {*} cause The error thrown by the entry point.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED***
goog.debug.ErrorHandler.ProtectedFunctionError = function(cause) {
  var message = goog.debug.ErrorHandler.ProtectedFunctionError.MESSAGE_PREFIX +
      (cause && cause.message ? String(cause.message) : String(cause));
  goog.debug.ErrorHandler.ProtectedFunctionError.base(
      this, 'constructor', message);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The error thrown by the entry point.
  ***REMOVED*** @type {*}
 ***REMOVED*****REMOVED***
  this.cause = cause;

  var stack = cause && cause.stack;
  if (stack && goog.isString(stack)) {
    this.stack =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (stack);
  }
***REMOVED***
goog.inherits(goog.debug.ErrorHandler.ProtectedFunctionError, goog.debug.Error);


***REMOVED***
***REMOVED*** Text to prefix the message with.
***REMOVED*** @type {string}
***REMOVED***
goog.debug.ErrorHandler.ProtectedFunctionError.MESSAGE_PREFIX =
    'Error in protected function: ';
