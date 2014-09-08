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
***REMOVED*** @fileoverview Defines a class useful for handling functions that must be
***REMOVED*** invoked after a delay, especially when that delay is frequently restarted.
***REMOVED*** Examples include delaying before displaying a tooltip, menu hysteresis,
***REMOVED*** idle timers, etc.
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED*** @see ../demos/timers.html
***REMOVED***


goog.provide('goog.Delay');
goog.provide('goog.async.Delay');

goog.require('goog.Disposable');
goog.require('goog.Timer');



***REMOVED***
***REMOVED*** A Delay object invokes the associated function after a specified delay. The
***REMOVED*** interval duration can be specified once in the constructor, or can be defined
***REMOVED*** each time the delay is started. Calling start on an active delay will reset
***REMOVED*** the timer.
***REMOVED***
***REMOVED*** @param {Function} listener Function to call when the delay completes.
***REMOVED*** @param {number=} opt_interval The default length of the invocation delay (in
***REMOVED***     milliseconds).
***REMOVED*** @param {Object=} opt_handler The object scope to invoke the function in.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED***
goog.async.Delay = function(listener, opt_interval, opt_handler) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The function that will be invoked after a delay.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listener_ = listener;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The default amount of time to delay before invoking the callback.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.interval_ = opt_interval || 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The object context to invoke the callback in.
  ***REMOVED*** @type {Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = opt_handler;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Cached callback function invoked when the delay finishes.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callback_ = goog.bind(this.doAction_, this);
***REMOVED***
goog.inherits(goog.async.Delay, goog.Disposable);



***REMOVED***
***REMOVED*** A deprecated alias.
***REMOVED*** @deprecated Use goog.async.Delay instead.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.Delay = goog.async.Delay;


***REMOVED***
***REMOVED*** Identifier of the active delay timeout, or 0 when inactive.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.Delay.prototype.id_ = 0;


***REMOVED***
***REMOVED*** Disposes of the object, cancelling the timeout if it is still outstanding and
***REMOVED*** removing all object references.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.async.Delay.prototype.disposeInternal = function() {
  goog.async.Delay.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.listener_;
  delete this.handler_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the delay timer. The provided listener function will be called after
***REMOVED*** the specified interval. Calling start on an active timer will reset the
***REMOVED*** delay interval.
***REMOVED*** @param {number=} opt_interval If specified, overrides the object's default
***REMOVED***     interval with this one (in milliseconds).
***REMOVED***
goog.async.Delay.prototype.start = function(opt_interval) {
  this.stop();
  this.id_ = goog.Timer.callOnce(
      this.callback_,
      goog.isDef(opt_interval) ? opt_interval : this.interval_);
***REMOVED***


***REMOVED***
***REMOVED*** Stops the delay timer if it is active. No action is taken if the timer is not
***REMOVED*** in use.
***REMOVED***
goog.async.Delay.prototype.stop = function() {
  if (this.isActive()) {
    goog.Timer.clear(this.id_);
  }
  this.id_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Fires delay's action even if timer has already gone off or has not been
***REMOVED*** started yet; guarantees action firing. Stops the delay timer.
***REMOVED***
goog.async.Delay.prototype.fire = function() {
  this.stop();
  this.doAction_();
***REMOVED***


***REMOVED***
***REMOVED*** Fires delay's action only if timer is currently active. Stops the delay
***REMOVED*** timer.
***REMOVED***
goog.async.Delay.prototype.fireIfActive = function() {
  if (this.isActive()) {
    this.fire();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the delay is currently active, false otherwise.
***REMOVED***
goog.async.Delay.prototype.isActive = function() {
  return this.id_ != 0;
***REMOVED***


***REMOVED***
***REMOVED*** Invokes the callback function after the delay successfully completes.
***REMOVED*** @private
***REMOVED***
goog.async.Delay.prototype.doAction_ = function() {
  this.id_ = 0;
  if (this.listener_) {
    this.listener_.call(this.handler_);
  }
***REMOVED***
