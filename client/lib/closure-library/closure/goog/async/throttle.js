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
***REMOVED*** @fileoverview Definition of the goog.async.Throttle class.
***REMOVED***
***REMOVED*** @see ../demos/timers.html
***REMOVED***

goog.provide('goog.Throttle');
goog.provide('goog.async.Throttle');

goog.require('goog.Disposable');
goog.require('goog.Timer');



***REMOVED***
***REMOVED*** Throttle will perform an action that is passed in no more than once
***REMOVED*** per interval (specified in milliseconds). If it gets multiple signals
***REMOVED*** to perform the action while it is waiting, it will only perform the action
***REMOVED*** once at the end of the interval.
***REMOVED*** @param {function(this: T)} listener Function to callback when the action is
***REMOVED***     triggered.
***REMOVED*** @param {number} interval Interval over which to throttle. The listener can
***REMOVED***     only be called once per interval.
***REMOVED*** @param {T=} opt_handler Object in whose scope to call the listener.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED*** @template T
***REMOVED***
goog.async.Throttle = function(listener, interval, opt_handler) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Function to callback
  ***REMOVED*** @type {function(this: T)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listener_ = listener;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Interval for the throttle time
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.interval_ = interval;

 ***REMOVED*****REMOVED***
  ***REMOVED*** "this" context for the listener
  ***REMOVED*** @type {Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = opt_handler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cached callback function invoked after the throttle timeout completes
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callback_ = goog.bind(this.onTimer_, this);
***REMOVED***
goog.inherits(goog.async.Throttle, goog.Disposable);



***REMOVED***
***REMOVED*** A deprecated alias.
***REMOVED*** @deprecated Use goog.async.Throttle instead.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.Throttle = goog.async.Throttle;


***REMOVED***
***REMOVED*** Indicates that the action is pending and needs to be fired.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Throttle.prototype.shouldFire_ = false;


***REMOVED***
***REMOVED*** Indicates the count of nested pauses currently in effect on the throttle.
***REMOVED*** When this count is not zero, fired actions will be postponed until the
***REMOVED*** throttle is resumed enough times to drop the pause count to zero.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.Throttle.prototype.pauseCount_ = 0;


***REMOVED***
***REMOVED*** Timer for scheduling the next callback
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.async.Throttle.prototype.timer_ = null;


***REMOVED***
***REMOVED*** Notifies the throttle that the action has happened. It will throttle the call
***REMOVED*** so that the callback is not called too often according to the interval
***REMOVED*** parameter passed to the constructor.
***REMOVED***
goog.async.Throttle.prototype.fire = function() {
  if (!this.timer_ && !this.pauseCount_) {
    this.doAction_();
  } else {
    this.shouldFire_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels any pending action callback. The throttle can be restarted by
***REMOVED*** calling {@link #fire}.
***REMOVED***
goog.async.Throttle.prototype.stop = function() {
  if (this.timer_) {
    goog.Timer.clear(this.timer_);
    this.timer_ = null;
    this.shouldFire_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Pauses the throttle.  All pending and future action callbacks will be
***REMOVED*** delayed until the throttle is resumed.  Pauses can be nested.
***REMOVED***
goog.async.Throttle.prototype.pause = function() {
  this.pauseCount_++;
***REMOVED***


***REMOVED***
***REMOVED*** Resumes the throttle.  If doing so drops the pausing count to zero, pending
***REMOVED*** action callbacks will be executed as soon as possible, but still no sooner
***REMOVED*** than an interval's delay after the previous call.  Future action callbacks
***REMOVED*** will be executed as normal.
***REMOVED***
goog.async.Throttle.prototype.resume = function() {
  this.pauseCount_--;
  if (!this.pauseCount_ && this.shouldFire_ && !this.timer_) {
    this.shouldFire_ = false;
    this.doAction_();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.async.Throttle.prototype.disposeInternal = function() {
  goog.async.Throttle.superClass_.disposeInternal.call(this);
  this.stop();
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the timer to fire the throttle
***REMOVED*** @private
***REMOVED***
goog.async.Throttle.prototype.onTimer_ = function() {
  this.timer_ = null;

  if (this.shouldFire_ && !this.pauseCount_) {
    this.shouldFire_ = false;
    this.doAction_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls the callback
***REMOVED*** @private
***REMOVED***
goog.async.Throttle.prototype.doAction_ = function() {
  this.timer_ = goog.Timer.callOnce(this.callback_, this.interval_);
  this.listener_.call(this.handler_);
***REMOVED***
