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
***REMOVED*** @fileoverview Tools for parsing and pretty printing error stack traces.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.stacktrace');
goog.provide('goog.testing.stacktrace.Frame');



***REMOVED***
***REMOVED*** Class representing one stack frame.
***REMOVED*** @param {string} context Context object, empty in case of global functions or
***REMOVED***     if the browser doesn't provide this information.
***REMOVED*** @param {string} name Function name, empty in case of anonymous functions.
***REMOVED*** @param {string} alias Alias of the function if available. For example the
***REMOVED***     function name will be 'c' and the alias will be 'b' if the function is
***REMOVED***     defined as <code>a.b = function c() {***REMOVED***</code>.
***REMOVED*** @param {string} args Arguments of the function in parentheses if available.
***REMOVED*** @param {string} path File path or URL including line number and optionally
***REMOVED***     column number separated by colons.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.stacktrace.Frame = function(context, name, alias, args, path) {
  this.context_ = context;
  this.name_ = name;
  this.alias_ = alias;
  this.args_ = args;
  this.path_ = path;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The function name or empty string if the function is
***REMOVED***     anonymous and the object field which it's assigned to is unknown.
***REMOVED***
goog.testing.stacktrace.Frame.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the stack frame contains an anonymous function.
***REMOVED***
goog.testing.stacktrace.Frame.prototype.isAnonymous = function() {
  return !this.name_ || this.context_ == '[object Object]';
***REMOVED***


***REMOVED***
***REMOVED*** Brings one frame of the stack trace into a common format across browsers.
***REMOVED*** @return {string} Pretty printed stack frame.
***REMOVED***
goog.testing.stacktrace.Frame.prototype.toCanonicalString = function() {
  var htmlEscape = goog.testing.stacktrace.htmlEscape_;
  var deobfuscate = goog.testing.stacktrace.maybeDeobfuscateFunctionName_;

  var canonical = [
    this.context_ ? htmlEscape(this.context_) + '.' : '',
    this.name_ ? htmlEscape(deobfuscate(this.name_)) : 'anonymous',
    htmlEscape(this.args_),
    this.alias_ ? ' [as ' + htmlEscape(deobfuscate(this.alias_)) + ']' : ''
  ];

  if (this.path_) {
    canonical.push(' at ');
    // If Closure Inspector is installed and running, then convert the line
    // into a source link for displaying the code in Firebug.
    if (goog.testing.stacktrace.isClosureInspectorActive_()) {
      var lineNumber = this.path_.match(/\d+$/)[0];
      canonical.push('<a href="" onclick="CLOSURE_INSPECTOR___.showLine(\'',
          htmlEscape(this.path_), '\', \'', lineNumber, '\'); return false">',
          htmlEscape(this.path_), '</a>');
    } else {
      canonical.push(htmlEscape(this.path_));
    }
  }
  return canonical.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Maximum number of steps while the call chain is followed.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.MAX_DEPTH_ = 20;


***REMOVED***
***REMOVED*** Maximum length of a string that can be matched with a RegExp on
***REMOVED*** Firefox 3x. Exceeding this approximate length will cause string.match
***REMOVED*** to exceed Firefox's stack quota. This situation can be encountered
***REMOVED*** when goog.globalEval is invoked with a long argument; such as
***REMOVED*** when loading a module.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_ = 500000;


***REMOVED***
***REMOVED*** RegExp pattern for JavaScript identifiers. We don't support Unicode
***REMOVED*** identifiers defined in ECMAScript v3.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.IDENTIFIER_PATTERN_ = '[a-zA-Z_$][\\w$]*';


***REMOVED***
***REMOVED*** RegExp pattern for function name alias in the Chrome stack trace.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.CHROME_ALIAS_PATTERN_ =
    '(?: \\[as (' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ')\\])?';


***REMOVED***
***REMOVED*** RegExp pattern for function names and constructor calls in the Chrome stack
***REMOVED*** trace.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.CHROME_FUNCTION_NAME_PATTERN_ =
    '(?:new )?(?:' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ +
    '|<anonymous>)';


***REMOVED***
***REMOVED*** RegExp pattern for function call in the Chrome stack trace.
***REMOVED*** Creates 3 submatches with context object (optional), function name and
***REMOVED*** function alias (optional).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.CHROME_FUNCTION_CALL_PATTERN_ =
    ' (?:(.*?)\\.)?(' + goog.testing.stacktrace.CHROME_FUNCTION_NAME_PATTERN_ +
    ')' + goog.testing.stacktrace.CHROME_ALIAS_PATTERN_;


***REMOVED***
***REMOVED*** RegExp pattern for an URL + position inside the file.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.URL_PATTERN_ =
    '((?:http|https|file)://[^\\s)]+|javascript:.*)';


***REMOVED***
***REMOVED*** RegExp pattern for an URL + line number + column number in Chrome.
***REMOVED*** The URL is either in submatch 1 or submatch 2.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.CHROME_URL_PATTERN_ = ' (?:' +
    '\\(unknown source\\)' + '|' +
    '\\(native\\)' + '|' +
    '\\((?:eval at )?' + goog.testing.stacktrace.URL_PATTERN_ + '\\)' + '|' +
    goog.testing.stacktrace.URL_PATTERN_ + ')';


***REMOVED***
***REMOVED*** Regular expression for parsing one stack frame in Chrome.
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.CHROME_STACK_FRAME_REGEXP_ = new RegExp('^    at' +
    '(?:' + goog.testing.stacktrace.CHROME_FUNCTION_CALL_PATTERN_ + ')?' +
    goog.testing.stacktrace.CHROME_URL_PATTERN_ + '$');


***REMOVED***
***REMOVED*** RegExp pattern for function call in the Firefox stack trace.
***REMOVED*** Creates 2 submatches with function name (optional) and arguments.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ =
    '(' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ')?' +
    '(\\(.*\\))?@';


***REMOVED***
***REMOVED*** Regular expression for parsing one stack frame in Firefox.
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.FIREFOX_STACK_FRAME_REGEXP_ = new RegExp('^' +
    goog.testing.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ +
    '(?::0|' + goog.testing.stacktrace.URL_PATTERN_ + ')$');


***REMOVED***
***REMOVED*** RegExp pattern for an anonymous function call in an Opera stack frame.
***REMOVED*** Creates 2 (optional) submatches: the context object and function name.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ =
    '<anonymous function(?:\\: ' +
    '(?:(' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ +
    '(?:\\.' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ')*)\\.)?' +
    '(' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + '))?>';


***REMOVED***
***REMOVED*** RegExp pattern for a function call in an Opera stack frame.
***REMOVED*** Creates 4 (optional) submatches: the function name (if not anonymous),
***REMOVED*** the aliased context object and function name (if anonymous), and the
***REMOVED*** function call arguments.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ =
    '(?:(?:(' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ')|' +
    goog.testing.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ +
    ')(\\(.*\\)))?@';


***REMOVED***
***REMOVED*** Regular expression for parsing on stack frame in Opera 11.68+
***REMOVED*** @type {!RegExp}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.OPERA_STACK_FRAME_REGEXP_ = new RegExp('^' +
    goog.testing.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ +
    goog.testing.stacktrace.URL_PATTERN_ + '?$');


***REMOVED***
***REMOVED*** Regular expression for finding the function name in its source.
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.FUNCTION_SOURCE_REGEXP_ = new RegExp(
    '^function (' + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ')');


***REMOVED***
***REMOVED*** RegExp pattern for function call in a IE stack trace. This expression allows
***REMOVED*** for identifiers like 'Anonymous function', 'eval code', and 'Global code'.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.IE_FUNCTION_CALL_PATTERN_ = '(' +
    goog.testing.stacktrace.IDENTIFIER_PATTERN_ + '(?:\\s+\\w+)*)';


***REMOVED***
***REMOVED*** Regular expression for parsing a stack frame in IE.
***REMOVED*** @type {!RegExp}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.IE_STACK_FRAME_REGEXP_ = new RegExp('^   at ' +
    goog.testing.stacktrace.IE_FUNCTION_CALL_PATTERN_ +
    '\\s*\\((eval code:[^)]*|' + goog.testing.stacktrace.URL_PATTERN_ +
    ')\\)?$');


***REMOVED***
***REMOVED*** Creates a stack trace by following the call chain. Based on
***REMOVED*** {@link goog.debug.getStacktrace}.
***REMOVED*** @return {!Array.<!goog.testing.stacktrace.Frame>} Stack frames.
***REMOVED*** @private
***REMOVED*** @suppress {es5Strict}
***REMOVED***
goog.testing.stacktrace.followCallChain_ = function() {
  var frames = [];
  var fn = arguments.callee.caller;
  var depth = 0;

  while (fn && depth < goog.testing.stacktrace.MAX_DEPTH_) {
    var fnString = Function.prototype.toString.call(fn);
    var match = fnString.match(goog.testing.stacktrace.FUNCTION_SOURCE_REGEXP_);
    var functionName = match ? match[1] : '';

    var argsBuilder = ['('];
    if (fn.arguments) {
      for (var i = 0; i < fn.arguments.length; i++) {
        var arg = fn.arguments[i];
        if (i > 0) {
          argsBuilder.push(', ');
        }
        if (goog.isString(arg)) {
          argsBuilder.push('"', arg, '"');
        } else {
          // Some args are mocks, and we don't want to fail from them not having
          // expected a call to toString, so instead insert a static string.
          if (arg && arg['$replay']) {
            argsBuilder.push('goog.testing.Mock');
          } else {
            argsBuilder.push(String(arg));
          }
        }
      }
    } else {
      // Opera 10 doesn't know the arguments of native functions.
      argsBuilder.push('unknown');
    }
    argsBuilder.push(')');
    var args = argsBuilder.join('');

    frames.push(new goog.testing.stacktrace.Frame('', functionName, '', args,
        ''));

   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      fn = fn.caller;
    } catch (e) {
      break;
    }
    depth++;
  }

  return frames;
***REMOVED***


***REMOVED***
***REMOVED*** Parses one stack frame.
***REMOVED*** @param {string} frameStr The stack frame as string.
***REMOVED*** @return {goog.testing.stacktrace.Frame} Stack frame object or null if the
***REMOVED***     parsing failed.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.parseStackFrame_ = function(frameStr) {
  var m = frameStr.match(goog.testing.stacktrace.CHROME_STACK_FRAME_REGEXP_);
  if (m) {
    return new goog.testing.stacktrace.Frame(m[1] || '', m[2] || '', m[3] || '',
        '', m[4] || m[5] || '');
  }

  if (frameStr.length >
      goog.testing.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_) {
    return goog.testing.stacktrace.parseLongFirefoxFrame_(frameStr);
  }

  m = frameStr.match(goog.testing.stacktrace.FIREFOX_STACK_FRAME_REGEXP_);
  if (m) {
    return new goog.testing.stacktrace.Frame('', m[1] || '', '', m[2] || '',
        m[3] || '');
  }

  m = frameStr.match(goog.testing.stacktrace.OPERA_STACK_FRAME_REGEXP_);
  if (m) {
    return new goog.testing.stacktrace.Frame(m[2] || '', m[1] || m[3] || '',
        '', m[4] || '', m[5] || '');
  }

  m = frameStr.match(goog.testing.stacktrace.IE_STACK_FRAME_REGEXP_);
  if (m) {
    return new goog.testing.stacktrace.Frame('', m[1] || '', '', '',
        m[2] || '');
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a long firefox stack frame.
***REMOVED*** @param {string} frameStr The stack frame as string.
***REMOVED*** @return {!goog.testing.stacktrace.Frame} Stack frame object.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.parseLongFirefoxFrame_ = function(frameStr) {
  var firstParen = frameStr.indexOf('(');
  var lastAmpersand = frameStr.lastIndexOf('@');
  var lastColon = frameStr.lastIndexOf(':');
  var functionName = '';
  if ((firstParen >= 0) && (firstParen < lastAmpersand)) {
    functionName = frameStr.substring(0, firstParen);
  }
  var loc = '';
  if ((lastAmpersand >= 0) && (lastAmpersand + 1 < lastColon)) {
    loc = frameStr.substring(lastAmpersand + 1);
  }
  var args = '';
  if ((firstParen >= 0 && lastAmpersand > 0) &&
      (firstParen < lastAmpersand)) {
    args = frameStr.substring(firstParen, lastAmpersand);
  }
  return new goog.testing.stacktrace.Frame('', functionName, '', args, loc);
***REMOVED***


***REMOVED***
***REMOVED*** Function to deobfuscate function names.
***REMOVED*** @type {function(string): string}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.deobfuscateFunctionName_;


***REMOVED***
***REMOVED*** Sets function to deobfuscate function names.
***REMOVED*** @param {function(string): string} fn function to deobfuscate function names.
***REMOVED***
goog.testing.stacktrace.setDeobfuscateFunctionName = function(fn) {
  goog.testing.stacktrace.deobfuscateFunctionName_ = fn;
***REMOVED***


***REMOVED***
***REMOVED*** Deobfuscates a compiled function name with the function passed to
***REMOVED*** {@link #setDeobfuscateFunctionName}. Returns the original function name if
***REMOVED*** the deobfuscator hasn't been set.
***REMOVED*** @param {string} name The function name to deobfuscate.
***REMOVED*** @return {string} The deobfuscated function name.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.maybeDeobfuscateFunctionName_ = function(name) {
  return goog.testing.stacktrace.deobfuscateFunctionName_ ?
      goog.testing.stacktrace.deobfuscateFunctionName_(name) : name;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the Closure Inspector is active.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.isClosureInspectorActive_ = function() {
  return Boolean(goog.global['CLOSURE_INSPECTOR___'] &&
      goog.global['CLOSURE_INSPECTOR___']['supportsJSUnit']);
***REMOVED***


***REMOVED***
***REMOVED*** Escapes the special character in HTML.
***REMOVED*** @param {string} text Plain text.
***REMOVED*** @return {string} Escaped text.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.htmlEscape_ = function(text) {
  return text.replace(/&/g, '&amp;').
             replace(/</g, '&lt;').
             replace(/>/g, '&gt;').
             replace(/"/g, '&quot;');
***REMOVED***


***REMOVED***
***REMOVED*** Converts the stack frames into canonical format. Chops the beginning and the
***REMOVED*** end of it which come from the testing environment, not from the test itself.
***REMOVED*** @param {!Array.<goog.testing.stacktrace.Frame>} frames The frames.
***REMOVED*** @return {string} Canonical, pretty printed stack trace.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.framesToString_ = function(frames) {
  // Removes the anonymous calls from the end of the stack trace (they come
  // from testrunner.js, testcase.js and asserts.js), so the stack trace will
  // end with the test... method.
  var lastIndex = frames.length - 1;
  while (frames[lastIndex] && frames[lastIndex].isAnonymous()) {
    lastIndex--;
  }

  // Removes the beginning of the stack trace until the call of the private
  // _assert function (inclusive), so the stack trace will begin with a public
  // asserter. Does nothing if _assert is not present in the stack trace.
  var privateAssertIndex = -1;
  for (var i = 0; i < frames.length; i++) {
    if (frames[i] && frames[i].getName() == '_assert') {
      privateAssertIndex = i;
      break;
    }
  }

  var canonical = [];
  for (var i = privateAssertIndex + 1; i <= lastIndex; i++) {
    canonical.push('> ');
    if (frames[i]) {
      canonical.push(frames[i].toCanonicalString());
    } else {
      canonical.push('(unknown)');
    }
    canonical.push('\n');
  }
  return canonical.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Parses the browser's native stack trace.
***REMOVED*** @param {string} stack Stack trace.
***REMOVED*** @return {!Array.<goog.testing.stacktrace.Frame>} Stack frames. The
***REMOVED***     unrecognized frames will be nulled out.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.parse_ = function(stack) {
  var lines = stack.replace(/\s*$/, '').split('\n');
  var frames = [];
  for (var i = 0; i < lines.length; i++) {
    frames.push(goog.testing.stacktrace.parseStackFrame_(lines[i]));
  }
  return frames;
***REMOVED***


***REMOVED***
***REMOVED*** Brings the stack trace into a common format across browsers.
***REMOVED*** @param {string} stack Browser-specific stack trace.
***REMOVED*** @return {string} Same stack trace in common format.
***REMOVED***
goog.testing.stacktrace.canonicalize = function(stack) {
  var frames = goog.testing.stacktrace.parse_(stack);
  return goog.testing.stacktrace.framesToString_(frames);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the native stack trace.
***REMOVED*** @return {string|!Array.<!CallSite>}
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.getNativeStack_ = function() {
  var tmpError = new Error();
  if (tmpError.stack) {
    return tmpError.stack;
  }

  // IE10 will only create a stack trace when the Error is thrown.
  // We use null.x() to throw an exception because the closure compiler may
  // replace "throw" with a function call in an attempt to minimize the binary
  // size, which in turn has the side effect of adding an unwanted stack frame.
  try {
    null.x();
  } catch (e) {
    return e.stack;
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the native stack trace if available otherwise follows the call chain.
***REMOVED*** @return {string} The stack trace in canonical format.
***REMOVED***
goog.testing.stacktrace.get = function() {
  var stack = goog.testing.stacktrace.getNativeStack_();
  var frames;
  if (!stack) {
    frames = goog.testing.stacktrace.followCallChain_();
  } else if (goog.isArray(stack)) {
    frames = goog.testing.stacktrace.callSitesToFrames_(stack);
  } else {
    frames = goog.testing.stacktrace.parse_(stack);
  }
  return goog.testing.stacktrace.framesToString_(frames);
***REMOVED***


***REMOVED***
***REMOVED*** Converts an array of CallSite (elements of a stack trace in V8) to an array
***REMOVED*** of Frames.
***REMOVED*** @param {!Array.<!CallSite>} stack The stack as an array of CallSites.
***REMOVED*** @return {!Array.<!goog.testing.stacktrace.Frame>} The stack as an array of
***REMOVED***     Frames.
***REMOVED*** @private
***REMOVED***
goog.testing.stacktrace.callSitesToFrames_ = function(stack) {
  var frames = [];
  for (var i = 0; i < stack.length; i++) {
    var callSite = stack[i];
    var functionName = callSite.getFunctionName() || 'unknown';
    var fileName = callSite.getFileName();
    var path = fileName ? fileName + ':' + callSite.getLineNumber() + ':' +
        callSite.getColumnNumber() : 'unknown';
    frames.push(
        new goog.testing.stacktrace.Frame('', functionName, '', '', path));
  }
  return frames;
***REMOVED***


goog.exportSymbol('setDeobfuscateFunctionName',
    goog.testing.stacktrace.setDeobfuscateFunctionName);
