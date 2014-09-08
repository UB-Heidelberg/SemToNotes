// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A delayed callback that pegs to the next animation frame
***REMOVED*** instead of a user-configurable timeout.
***REMOVED***
***REMOVED***

goog.provide('goog.async.AnimationDelay');

goog.require('goog.Disposable');
***REMOVED***
goog.require('goog.functions');



// TODO(nicksantos): Should we factor out the common code between this and
// goog.async.Delay? I'm not sure if there's enough code for this to really
// make sense. Subclassing seems like the wrong approach for a variety of
// reasons. Maybe there should be a common interface?



***REMOVED***
***REMOVED*** A delayed callback that pegs to the next animation frame
***REMOVED*** instead of a user configurable timeout. By design, this should have
***REMOVED*** the same interface as goog.async.Delay.
***REMOVED***
***REMOVED*** Uses requestAnimationFrame and friends when available, but falls
***REMOVED*** back to a timeout of goog.async.AnimationDelay.TIMEOUT.
***REMOVED***
***REMOVED*** For more on requestAnimationFrame and how you can use it to create smoother
***REMOVED*** animations, see:
***REMOVED*** @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
***REMOVED***
***REMOVED*** @param {function(number)} listener Function to call when the delay completes.
***REMOVED***     Will be passed the timestamp when it's called, in unix ms.
***REMOVED*** @param {Window=} opt_window The window object to execute the delay in.
***REMOVED***     Defaults to the global object.
***REMOVED*** @param {Object=} opt_handler The object scope to invoke the function in.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED***
goog.async.AnimationDelay = function(listener, opt_window, opt_handler) {
  goog.async.AnimationDelay.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The function that will be invoked after a delay.
  ***REMOVED*** @type {function(number)}
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
  ***REMOVED*** @type {Window}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.win_ = opt_window || window;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cached callback function invoked when the delay finishes.
  ***REMOVED*** @type {function()}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callback_ = goog.bind(this.doAction_, this);
***REMOVED***
goog.inherits(goog.async.AnimationDelay, goog.Disposable);


***REMOVED***
***REMOVED*** Identifier of the active delay timeout, or event listener,
***REMOVED*** or null when inactive.
***REMOVED*** @type {goog.events.Key|number|null}
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.prototype.id_ = null;


***REMOVED***
***REMOVED*** If we're using dom listeners.
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.prototype.usingListeners_ = false;


***REMOVED***
***REMOVED*** Default wait timeout for animations (in milliseconds).  Only used for timed
***REMOVED*** animation, which uses a timer (setTimeout) to schedule animation.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.async.AnimationDelay.TIMEOUT = 20;


***REMOVED***
***REMOVED*** Name of event received from the requestAnimationFrame in Firefox.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = 'MozBeforePaint';


***REMOVED***
***REMOVED*** Starts the delay timer. The provided listener function will be called
***REMOVED*** before the next animation frame.
***REMOVED***
goog.async.AnimationDelay.prototype.start = function() {
  this.stop();
  this.usingListeners_ = false;

  var raf = this.getRaf_();
  var cancelRaf = this.getCancelRaf_();
  if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {
    // Because Firefox (Gecko) runs animation in separate threads, it also saves
    // time by running the requestAnimationFrame callbacks in that same thread.
    // Sadly this breaks the assumption of implicit thread-safety in JS, and can
    // thus create thread-based inconsistencies on counters etc.
    //
    // Calling cycleAnimations_ using the MozBeforePaint event instead of as
    // callback fixes this.
    //
    // Trigger this condition only if the mozRequestAnimationFrame is available,
    // but not the W3C requestAnimationFrame function (as in draft) or the
    // equivalent cancel functions.
    this.id_ = goog.events.listen(
        this.win_,
        goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_,
        this.callback_);
    this.win_.mozRequestAnimationFrame(null);
    this.usingListeners_ = true;
  } else if (raf && cancelRaf) {
    this.id_ = raf.call(this.win_, this.callback_);
  } else {
    this.id_ = this.win_.setTimeout(
        // Prior to Firefox 13, Gecko passed a non-standard parameter
        // to the callback that we want to ignore.
        goog.functions.lock(this.callback_),
        goog.async.AnimationDelay.TIMEOUT);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stops the delay timer if it is active. No action is taken if the timer is not
***REMOVED*** in use.
***REMOVED***
goog.async.AnimationDelay.prototype.stop = function() {
  if (this.isActive()) {
    var raf = this.getRaf_();
    var cancelRaf = this.getCancelRaf_();
    if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {
      goog.events.unlistenByKey(this.id_);
    } else if (raf && cancelRaf) {
      cancelRaf.call(this.win_,***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.id_));
    } else {
      this.win_.clearTimeout(***REMOVED*** @type {number}***REMOVED*** (this.id_));
    }
  }
  this.id_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Fires delay's action even if timer has already gone off or has not been
***REMOVED*** started yet; guarantees action firing. Stops the delay timer.
***REMOVED***
goog.async.AnimationDelay.prototype.fire = function() {
  this.stop();
  this.doAction_();
***REMOVED***


***REMOVED***
***REMOVED*** Fires delay's action only if timer is currently active. Stops the delay
***REMOVED*** timer.
***REMOVED***
goog.async.AnimationDelay.prototype.fireIfActive = function() {
  if (this.isActive()) {
    this.fire();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the delay is currently active, false otherwise.
***REMOVED***
goog.async.AnimationDelay.prototype.isActive = function() {
  return this.id_ != null;
***REMOVED***


***REMOVED***
***REMOVED*** Invokes the callback function after the delay successfully completes.
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.prototype.doAction_ = function() {
  if (this.usingListeners_ && this.id_) {
    goog.events.unlistenByKey(this.id_);
  }
  this.id_ = null;

  // We are not using the timestamp returned by requestAnimationFrame
  // because it may be either a Date.now-style time or a
  // high-resolution time (depending on browser implementation). Using
  // goog.now() will ensure that the timestamp used is consistent and
  // compatible with goog.fx.Animation.
  this.listener_.call(this.handler_, goog.now());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.async.AnimationDelay.prototype.disposeInternal = function() {
  this.stop();
  goog.async.AnimationDelay.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** @return {?function(function(number)): number} The requestAnimationFrame
***REMOVED***     function, or null if not available on this browser.
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.prototype.getRaf_ = function() {
  var win = this.win_;
  return win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?function(number): number} The cancelAnimationFrame function,
***REMOVED***     or null if not available on this browser.
***REMOVED*** @private
***REMOVED***
goog.async.AnimationDelay.prototype.getCancelRaf_ = function() {
  var win = this.win_;
  return win.cancelRequestAnimationFrame ||
      win.webkitCancelRequestAnimationFrame ||
      win.mozCancelRequestAnimationFrame ||
      win.oCancelRequestAnimationFrame ||
      win.msCancelRequestAnimationFrame ||
      null;
***REMOVED***
