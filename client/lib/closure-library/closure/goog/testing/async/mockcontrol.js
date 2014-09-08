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
***REMOVED*** @fileoverview A wrapper for MockControl that provides mocks and assertions
***REMOVED*** for testing asynchronous code. All assertions will only be verified when
***REMOVED*** $verifyAll is called on the wrapped MockControl.
***REMOVED***
***REMOVED*** This class is meant primarily for testing code that exposes asynchronous APIs
***REMOVED*** without being truly asynchronous (using asynchronous primitives like browser
***REMOVED*** events or timeouts). This is often the case when true asynchronous
***REMOVED*** depedencies have been mocked out. This means that it doesn't rely on
***REMOVED*** AsyncTestCase or DeferredTestCase, although it can be used with those as
***REMOVED*** well.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var mockControl = new goog.testing.MockControl();
***REMOVED*** var asyncMockControl = new goog.testing.async.MockControl(mockControl);
***REMOVED***
***REMOVED*** myAsyncObject.onSuccess(asyncMockControl.asyncAssertEquals(
***REMOVED***     'callback should run and pass the correct value',
***REMOVED***     'http://someurl.com');
***REMOVED*** asyncMockControl.assertDeferredEquals(
***REMOVED***     'deferred object should be resolved with the correct value',
***REMOVED***     'http://someurl.com',
***REMOVED***     myAsyncObject.getDeferredUrl());
***REMOVED*** asyncMockControl.run();
***REMOVED*** mockControl.$verifyAll();
***REMOVED*** </pre>
***REMOVED***
***REMOVED***


goog.provide('goog.testing.async.MockControl');

goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.debug');
goog.require('goog.testing.asserts');
goog.require('goog.testing.mockmatchers.IgnoreArgument');



***REMOVED***
***REMOVED*** Provides asynchronous mocks and assertions controlled by a parent
***REMOVED*** MockControl.
***REMOVED***
***REMOVED*** @param {goog.testing.MockControl} mockControl The parent MockControl.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.async.MockControl = function(mockControl) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent MockControl.
  ***REMOVED*** @type {goog.testing.MockControl}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mockControl_ = mockControl;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a function that will assert that it will be called, and run the given
***REMOVED*** callback when it is.
***REMOVED***
***REMOVED*** @param {string} name The name of the callback mock.
***REMOVED*** @param {function(...[*]) :***REMOVED***} callback The wrapped callback. This will be
***REMOVED***     called when the returned function is called.
***REMOVED*** @param {Object=} opt_selfObj The object which this should point to when the
***REMOVED***     callback is run.
***REMOVED*** @return {!Function} The mock callback.
***REMOVED*** @suppress {missingProperties} Mocks do not fit in the type system well.
***REMOVED***
goog.testing.async.MockControl.prototype.createCallbackMock = function(
    name, callback, opt_selfObj) {
  goog.asserts.assert(
      goog.isString(name),
      'name parameter ' + goog.debug.deepExpose(name) + ' should be a string');

  var ignored = new goog.testing.mockmatchers.IgnoreArgument();

  // Use everyone's favorite "double-cast" trick to subvert the type system.
  var obj =***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (this.mockControl_.createFunctionMock(name));
  var fn =***REMOVED*****REMOVED*** @type {Function}***REMOVED*** (obj);

  fn(ignored).$does(function(args) {
    if (opt_selfObj) {
      callback = goog.bind(callback, opt_selfObj);
    }
    return callback.apply(this, args);
  });
  fn.$replay();
  return function() { return fn(arguments);***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Returns a function that will assert that its arguments are equal to the
***REMOVED*** arguments given to asyncAssertEquals. In addition, the function also asserts
***REMOVED*** that it will be called.
***REMOVED***
***REMOVED*** @param {string} message A message to print if the arguments are wrong.
***REMOVED*** @param {...*} var_args The arguments to assert.
***REMOVED*** @return {function(...[*]) : void} The mock callback.
***REMOVED***
goog.testing.async.MockControl.prototype.asyncAssertEquals = function(
    message, var_args) {
  var expectedArgs = Array.prototype.slice.call(arguments, 1);
  return this.createCallbackMock('asyncAssertEquals', function() {
    assertObjectEquals(
        message, expectedArgs, Array.prototype.slice.call(arguments));
  });
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that a deferred object will have an error and call its errback
***REMOVED*** function.
***REMOVED*** @param {goog.async.Deferred} deferred The deferred object.
***REMOVED*** @param {function() : void} fn A function wrapping the code in which the error
***REMOVED***     will occur.
***REMOVED***
goog.testing.async.MockControl.prototype.assertDeferredError = function(
    deferred, fn) {
  deferred.addErrback(this.createCallbackMock(
      'assertDeferredError', function() {}));
  goog.testing.asserts.callWithoutLogging(fn);
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that a deferred object will call its callback with the given value.
***REMOVED***
***REMOVED*** @param {string} message A message to print if the arguments are wrong.
***REMOVED*** @param {goog.async.Deferred|*} expected The expected value. If this is a
***REMOVED***     deferred object, then the expected value is the deferred value.
***REMOVED*** @param {goog.async.Deferred|*} actual The actual value. If this is a deferred
***REMOVED***     object, then the actual value is the deferred value. Either this or
***REMOVED***     'expected' must be deferred.
***REMOVED***
goog.testing.async.MockControl.prototype.assertDeferredEquals = function(
    message, expected, actual) {
  if (expected instanceof goog.async.Deferred &&
      actual instanceof goog.async.Deferred) {
    // Assert that the first deferred is resolved.
    expected.addCallback(this.createCallbackMock(
        'assertDeferredEquals', function(exp) {
          // Assert that the second deferred is resolved, and that the value is
          // as expected.
          actual.addCallback(this.asyncAssertEquals(message, exp));
        }, this));
  } else if (expected instanceof goog.async.Deferred) {
    expected.addCallback(this.createCallbackMock(
        'assertDeferredEquals', function(exp) {
          assertObjectEquals(message, exp, actual);
        }));
  } else if (actual instanceof goog.async.Deferred) {
    actual.addCallback(this.asyncAssertEquals(message, expected));
  } else {
    throw Error('Either expected or actual must be deferred');
  }
***REMOVED***
