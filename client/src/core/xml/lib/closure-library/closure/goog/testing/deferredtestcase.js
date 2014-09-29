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
***REMOVED*** @fileoverview Defines DeferredTestCase class. By calling waitForDeferred(),
***REMOVED*** tests in DeferredTestCase can wait for a Deferred object to complete its
***REMOVED*** callbacks before continuing to the next test.
***REMOVED***
***REMOVED*** Example Usage:
***REMOVED***
***REMOVED***   var deferredTestCase = goog.testing.DeferredTestCase.createAndInstall();
***REMOVED***   // Optionally, set a longer-than-usual step timeout.
***REMOVED***   deferredTestCase.stepTimeout = 15***REMOVED*** 1000; // 15 seconds
***REMOVED***
***REMOVED***   function testDeferredCallbacks() {
***REMOVED***     var callbackTime = goog.now();
***REMOVED***     var callbacks = new goog.async.Deferred();
***REMOVED***     deferredTestCase.addWaitForAsync('Waiting for 1st callback', callbacks);
***REMOVED***     callbacks.addCallback(
***REMOVED***         function() {
***REMOVED***           assertTrue(
***REMOVED***               'We\'re going back in time!', goog.now() >= callbackTime);
***REMOVED***           callbackTime = goog.now();
***REMOVED***         });
***REMOVED***     deferredTestCase.addWaitForAsync('Waiting for 2nd callback', callbacks);
***REMOVED***     callbacks.addCallback(
***REMOVED***         function() {
***REMOVED***           assertTrue(
***REMOVED***               'We\'re going back in time!', goog.now() >= callbackTime);
***REMOVED***           callbackTime = goog.now();
***REMOVED***         });
***REMOVED***     deferredTestCase.addWaitForAsync('Waiting for last callback', callbacks);
***REMOVED***     callbacks.addCallback(
***REMOVED***         function() {
***REMOVED***           assertTrue(
***REMOVED***               'We\'re going back in time!', goog.now() >= callbackTime);
***REMOVED***           callbackTime = goog.now();
***REMOVED***         });
***REMOVED***
***REMOVED***     deferredTestCase.waitForDeferred(callbacks);
***REMOVED***   }
***REMOVED***
***REMOVED*** Note that DeferredTestCase still preserves the functionality of
***REMOVED*** AsyncTestCase.
***REMOVED***
***REMOVED*** @see.goog.async.Deferred
***REMOVED*** @see goog.testing.AsyncTestCase
***REMOVED***

goog.provide('goog.testing.DeferredTestCase');

goog.require('goog.async.Deferred');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');



***REMOVED***
***REMOVED*** A test case that can asynchronously wait on a Deferred object.
***REMOVED*** @param {string=} opt_name A descriptive name for the test case.
***REMOVED***
***REMOVED*** @extends {goog.testing.AsyncTestCase}
***REMOVED***
goog.testing.DeferredTestCase = function(opt_name) {
  goog.testing.AsyncTestCase.call(this, opt_name);
***REMOVED***
goog.inherits(goog.testing.DeferredTestCase, goog.testing.AsyncTestCase);


***REMOVED***
***REMOVED*** Preferred way of creating a DeferredTestCase. Creates one and initializes it
***REMOVED*** with the G_testRunner.
***REMOVED*** @param {string=} opt_name A descriptive name for the test case.
***REMOVED*** @return {goog.testing.DeferredTestCase} The created DeferredTestCase.
***REMOVED***
goog.testing.DeferredTestCase.createAndInstall = function(opt_name) {
  var deferredTestCase = new goog.testing.DeferredTestCase(opt_name);
  goog.testing.TestCase.initializeTestRunner(deferredTestCase);
  return deferredTestCase;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for when the test produces an error.
***REMOVED*** @param {Error|string} err The error object.
***REMOVED*** @protected
***REMOVED*** @throws Always throws a ControlBreakingException.
***REMOVED***
goog.testing.DeferredTestCase.prototype.onError = function(err) {
  this.doAsyncError(err);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for when the test succeeds.
***REMOVED*** @protected
***REMOVED***
goog.testing.DeferredTestCase.prototype.onSuccess = function() {
  this.continueTesting();
***REMOVED***


***REMOVED***
***REMOVED*** Adds a callback to update the wait message of this async test case. Using
***REMOVED*** this method generously also helps to document the test flow.
***REMOVED*** @param {string} msg The update wait status message.
***REMOVED*** @param {goog.async.Deferred} d The deferred object to add the waitForAsync
***REMOVED***     callback to.
***REMOVED*** @see goog.testing.AsyncTestCase#waitForAsync
***REMOVED***
goog.testing.DeferredTestCase.prototype.addWaitForAsync = function(msg, d) {
  d.addCallback(goog.bind(this.waitForAsync, this, msg));
***REMOVED***


***REMOVED***
***REMOVED*** Wires up given Deferred object to the test case, then starts the
***REMOVED*** goog.async.Deferred object's callback.
***REMOVED*** @param {!string|goog.async.Deferred} a The wait status message or the
***REMOVED***     deferred object to wait for.
***REMOVED*** @param {goog.async.Deferred=} opt_b The deferred object to wait for.
***REMOVED***
goog.testing.DeferredTestCase.prototype.waitForDeferred = function(a, opt_b) {
  var waitMsg;
  var deferred;
  switch (arguments.length) {
    case 1:
      deferred = a;
      waitMsg = null;
      break;
    case 2:
      deferred = opt_b;
      waitMsg = a;
      break;
    default: // Shouldn't be here in compiled mode
      throw Error('Invalid number of arguments');
  }
  deferred.addCallbacks(this.onSuccess, this.onError, this);
  if (!waitMsg) {
    waitMsg = 'Waiting for deferred in ' + this.getCurrentStepName();
  }
  this.waitForAsync(***REMOVED*****REMOVED*** @type {!string}***REMOVED*** (waitMsg));
  deferred.callback(true);
***REMOVED***
