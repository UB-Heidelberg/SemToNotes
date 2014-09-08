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
***REMOVED*** @fileoverview Helper class for recording the calls of a function.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED*** var stubs = new goog.testing.PropertyReplacer();
***REMOVED***
***REMOVED*** function tearDown() {
***REMOVED***   stubs.reset();
***REMOVED*** }
***REMOVED***
***REMOVED*** function testShuffle() {
***REMOVED***   stubs.set(Math, 'random', goog.testing.recordFunction(Math.random));
***REMOVED***   var arr = shuffle([1, 2, 3, 4, 5]);
***REMOVED***   assertSameElements([1, 2, 3, 4, 5], arr);
***REMOVED***   assertEquals(4, Math.random.getCallCount());
***REMOVED*** }
***REMOVED***
***REMOVED*** function testOpenDialog() {
***REMOVED***   stubs.set(goog.ui, 'Dialog',
***REMOVED***       goog.testing.recordConstructor(goog.ui.Dialog));
***REMOVED***   openConfirmDialog();
***REMOVED***   var lastDialogInstance = goog.ui.Dialog.getLastCall().getThis();
***REMOVED***   assertEquals('confirm', lastDialogInstance.getTitle());
***REMOVED*** }
***REMOVED*** </pre>
***REMOVED***
***REMOVED***

goog.provide('goog.testing.FunctionCall');
goog.provide('goog.testing.recordConstructor');
goog.provide('goog.testing.recordFunction');

goog.require('goog.testing.asserts');


***REMOVED***
***REMOVED*** Wraps the function into another one which calls the inner function and
***REMOVED*** records its calls. The recorded function will have 3 static methods:
***REMOVED*** {@code getCallCount}, {@code getCalls} and {@code getLastCall} but won't
***REMOVED*** inherit the original function's prototype and static fields.
***REMOVED***
***REMOVED*** @param {!Function=} opt_f The function to wrap and record. Defaults to
***REMOVED***     {@link goog.nullFunction}.
***REMOVED*** @return {!Function} The wrapped function.
***REMOVED***
goog.testing.recordFunction = function(opt_f) {
  var f = opt_f || goog.nullFunction;
  var calls = [];

  function recordedFunction() {
    try {
      var ret = f.apply(this, arguments);
      calls.push(new goog.testing.FunctionCall(f, this, arguments, ret, null));
      return ret;
    } catch (err) {
      calls.push(new goog.testing.FunctionCall(f, this, arguments, undefined,
          err));
      throw err;
    }
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {number} Total number of calls.
 ***REMOVED*****REMOVED***
  recordedFunction.getCallCount = function() {
    return calls.length;
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Asserts that the function was called {@code expected} times.
  ***REMOVED*** @param {number} expected The expected number of calls.
 ***REMOVED*****REMOVED***
  recordedFunction.assertCallCount = function(expected) {
    var actual = calls.length;
    assertEquals(
        'Expected ' + expected + ' call(s), but was ' + actual + '.',
        expected, actual);
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {!Array.<!goog.testing.FunctionCall>} All calls of the recorded
  ***REMOVED***     function.
 ***REMOVED*****REMOVED***
  recordedFunction.getCalls = function() {
    return calls;
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {goog.testing.FunctionCall} Last call of the recorded function or
  ***REMOVED***     null if it hasn't been called.
 ***REMOVED*****REMOVED***
  recordedFunction.getLastCall = function() {
    return calls[calls.length - 1] || null;
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns and removes the last call of the recorded function.
  ***REMOVED*** @return {goog.testing.FunctionCall} Last call of the recorded function or
  ***REMOVED***     null if it hasn't been called.
 ***REMOVED*****REMOVED***
  recordedFunction.popLastCall = function() {
    return calls.pop() || null;
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Resets the recorded function and removes all calls.
 ***REMOVED*****REMOVED***
  recordedFunction.reset = function() {
    calls.length = 0;
 ***REMOVED*****REMOVED***

  return recordedFunction;
***REMOVED***


***REMOVED***
***REMOVED*** Same as {@link goog.testing.recordFunction} but the recorded function will
***REMOVED*** have the same prototype and static fields as the original one. It can be
***REMOVED*** used with constructors.
***REMOVED***
***REMOVED*** @param {!Function} ctor The function to wrap and record.
***REMOVED*** @return {!Function} The wrapped function.
***REMOVED***
goog.testing.recordConstructor = function(ctor) {
  var recordedConstructor = goog.testing.recordFunction(ctor);
  recordedConstructor.prototype = ctor.prototype;
  goog.mixin(recordedConstructor, ctor);
  return recordedConstructor;
***REMOVED***



***REMOVED***
***REMOVED*** Struct for a single function call.
***REMOVED*** @param {!Function} func The called function.
***REMOVED*** @param {!Object} thisContext {@code this} context of called function.
***REMOVED*** @param {!Arguments} args Arguments of the called function.
***REMOVED*** @param {*} ret Return value of the function or undefined in case of error.
***REMOVED*** @param {*} error The error thrown by the function or null if none.
***REMOVED***
***REMOVED***
goog.testing.FunctionCall = function(func, thisContext, args, ret, error) {
  this.function_ = func;
  this.thisContext_ = thisContext;
  this.arguments_ = Array.prototype.slice.call(args);
  this.returnValue_ = ret;
  this.error_ = error;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Function} The called function.
***REMOVED***
goog.testing.FunctionCall.prototype.getFunction = function() {
  return this.function_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} {@code this} context of called function. It is the same as
***REMOVED***     the created object if the function is a constructor.
***REMOVED***
goog.testing.FunctionCall.prototype.getThis = function() {
  return this.thisContext_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array} Arguments of the called function.
***REMOVED***
goog.testing.FunctionCall.prototype.getArguments = function() {
  return this.arguments_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the nth argument of the called function.
***REMOVED*** @param {number} index 0-based index of the argument.
***REMOVED*** @return {*} The argument value or undefined if there is no such argument.
***REMOVED***
goog.testing.FunctionCall.prototype.getArgument = function(index) {
  return this.arguments_[index];
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} Return value of the function or undefined in case of error.
***REMOVED***
goog.testing.FunctionCall.prototype.getReturnValue = function() {
  return this.returnValue_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The error thrown by the function or null if none.
***REMOVED***
goog.testing.FunctionCall.prototype.getError = function() {
  return this.error_;
***REMOVED***
