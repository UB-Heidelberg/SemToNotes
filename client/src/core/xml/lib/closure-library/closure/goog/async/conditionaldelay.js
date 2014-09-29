// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Defines a class useful for handling functions that must be
***REMOVED*** invoked later when some condition holds. Examples include deferred function
***REMOVED*** calls that return a boolean flag whether it succedeed or not.
***REMOVED***
***REMOVED*** Example:
***REMOVED***
***REMOVED***  function deferred() {
***REMOVED***     var succeeded = false;
***REMOVED***     // ... custom code
***REMOVED***     return succeeded;
***REMOVED***  }
***REMOVED***
***REMOVED***  var deferredCall = new goog.async.ConditionalDelay(deferred);
***REMOVED***  deferredCall.onSuccess = function() {
***REMOVED***    alert('Success: The deferred function has been successfully executed.');
***REMOVED***  }
***REMOVED***  deferredCall.onFailure = function() {
***REMOVED***    alert('Failure: Time limit exceeded.');
***REMOVED***  }
***REMOVED***
***REMOVED***  // Call the deferred() every 100 msec until it returns true,
***REMOVED***  // or 5 seconds pass.
***REMOVED***  deferredCall.start(100, 5000);
***REMOVED***
***REMOVED***  // Stop the deferred function call (does nothing if it's not active).
***REMOVED***  deferredCall.stop();
***REMOVED***
***REMOVED***


goog.provide('goog.async.ConditionalDelay');

goog.require('goog.Disposable');
goog.require('goog.async.Delay');



***REMOVED***
***REMOVED*** A ConditionalDelay object invokes the associated function after a specified
***REMOVED*** interval delay and checks its return value. If the function returns
***REMOVED*** {@code true} the conditional delay is cancelled and {@see #onSuccess}
***REMOVED*** is called. Otherwise this object keeps to invoke the deferred function until
***REMOVED*** either it returns {@code true} or the timeout is exceeded. In the latter case
***REMOVED*** the {@see #onFailure} method will be called.
***REMOVED***
***REMOVED*** The interval duration and timeout can be specified each time the delay is
***REMOVED*** started. Calling start on an active delay will reset the timer.
***REMOVED***
***REMOVED*** @param {function():boolean} listener Function to call when the delay
***REMOVED***     completes. Should return a value that type-converts to {@code true} if
***REMOVED***     the call succeeded and this delay should be stopped.
***REMOVED*** @param {Object=} opt_handler The object scope to invoke the function in.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.async.ConditionalDelay = function(listener, opt_handler) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The function that will be invoked after a delay.
  ***REMOVED*** @type {function():boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listener_ = listener;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The object context to invoke the callback in.
  ***REMOVED*** @type {Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = opt_handler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying goog.async.Delay delegate object.
  ***REMOVED*** @type {goog.async.Delay}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.delay_ = new goog.async.Delay(
      goog.bind(this.onTick_, this), 0 /*interval*/, this /*scope*/);
***REMOVED***
goog.inherits(goog.async.ConditionalDelay, goog.Disposable);


***REMOVED***
***REMOVED*** The delay interval in milliseconds to between the calls to the callback.
***REMOVED*** Note, that the callback may be invoked earlier than this interval if the
***REMOVED*** timeout is exceeded.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.ConditionalDelay.prototype.interval_ = 0;


***REMOVED***
***REMOVED*** The timeout timestamp until which the delay is to be executed.
***REMOVED*** A negative value means no timeout.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.ConditionalDelay.prototype.runUntil_ = 0;


***REMOVED***
***REMOVED*** True if the listener has been executed, and it returned {@code true}.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.ConditionalDelay.prototype.isDone_ = false;


***REMOVED*** @override***REMOVED***
goog.async.ConditionalDelay.prototype.disposeInternal = function() {
  this.delay_.dispose();
  delete this.listener_;
  delete this.handler_;
  goog.async.ConditionalDelay.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the delay timer. The provided listener function will be called
***REMOVED*** repeatedly after the specified interval until the function returns
***REMOVED*** {@code true} or the timeout is exceeded. Calling start on an active timer
***REMOVED*** will stop the timer first.
***REMOVED*** @param {number=} opt_interval The time interval between the function
***REMOVED***     invocations (in milliseconds). Default is 0.
***REMOVED*** @param {number=} opt_timeout The timeout interval (in milliseconds). Takes
***REMOVED***     precedence over the {@code opt_interval}, i.e. if the timeout is less
***REMOVED***     than the invocation interval, the function will be called when the
***REMOVED***     timeout is exceeded. A negative value means no timeout. Default is 0.
***REMOVED***
goog.async.ConditionalDelay.prototype.start = function(opt_interval,
                                                       opt_timeout) {
  this.stop();
  this.isDone_ = false;

  var timeout = opt_timeout || 0;
  this.interval_ = Math.max(opt_interval || 0, 0);
  this.runUntil_ = timeout < 0 ? -1 : (goog.now() + timeout);
  this.delay_.start(
      timeout < 0 ? this.interval_ : Math.min(this.interval_, timeout));
***REMOVED***


***REMOVED***
***REMOVED*** Stops the delay timer if it is active. No action is taken if the timer is not
***REMOVED*** in use.
***REMOVED***
goog.async.ConditionalDelay.prototype.stop = function() {
  this.delay_.stop();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the delay is currently active, false otherwise.
***REMOVED***
goog.async.ConditionalDelay.prototype.isActive = function() {
  return this.delay_.isActive();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the listener has been executed and returned
***REMOVED***     {@code true} since the last call to {@see #start}.
***REMOVED***
goog.async.ConditionalDelay.prototype.isDone = function() {
  return this.isDone_;
***REMOVED***


***REMOVED***
***REMOVED*** Called when the listener has been successfully executed and returned
***REMOVED*** {@code true}. The {@see #isDone} method should return {@code true} by now.
***REMOVED*** Designed for inheritance, should be overridden by subclasses or on the
***REMOVED*** instances if they care.
***REMOVED***
goog.async.ConditionalDelay.prototype.onSuccess = function() {
  // Do nothing by default.
***REMOVED***


***REMOVED***
***REMOVED*** Called when this delayed call is cancelled because the timeout has been
***REMOVED*** exceeded, and the listener has never returned {@code true}.
***REMOVED*** Designed for inheritance, should be overridden by subclasses or on the
***REMOVED*** instances if they care.
***REMOVED***
goog.async.ConditionalDelay.prototype.onFailure = function() {
  // Do nothing by default.
***REMOVED***


***REMOVED***
***REMOVED*** A callback function for the underlying {@code goog.async.Delay} object. When
***REMOVED*** executed the listener function is called, and if it returns {@code true}
***REMOVED*** the delay is stopped and the {@see #onSuccess} method is invoked.
***REMOVED*** If the timeout is exceeded the delay is stopped and the
***REMOVED*** {@see #onFailure} method is called.
***REMOVED*** @private
***REMOVED***
goog.async.ConditionalDelay.prototype.onTick_ = function() {
  var successful = this.listener_.call(this.handler_);
  if (successful) {
    this.isDone_ = true;
    this.onSuccess();
  } else {
    // Try to reschedule the task.
    if (this.runUntil_ < 0) {
      // No timeout.
      this.delay_.start(this.interval_);
    } else {
      var timeLeft = this.runUntil_ - goog.now();
      if (timeLeft <= 0) {
        this.onFailure();
      } else {
        this.delay_.start(Math.min(this.interval_, timeLeft));
      }
    }
  }
***REMOVED***
