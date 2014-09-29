// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A timer class to which other classes and objects can
***REMOVED*** listen on.  This is only an abstraction above setInterval.
***REMOVED***
***REMOVED*** @see ../demos/timers.html
***REMOVED***

goog.provide('goog.Timer');

goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Class for handling timing events.
***REMOVED***
***REMOVED*** @param {number=} opt_interval Number of ms between ticks (Default: 1ms).
***REMOVED*** @param {Object=} opt_timerObject  An object that has setTimeout, setInterval,
***REMOVED***     clearTimeout and clearInterval (eg Window).
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of ms between ticks
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.interval_ = opt_interval || 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An object that implements setTimout, setInterval, clearTimeout and
  ***REMOVED*** clearInterval. We default to the window object. Changing this on
  ***REMOVED*** goog.Timer.prototype changes the object for all timer instances which can
  ***REMOVED*** be useful if your environment has some other implementation of timers than
  ***REMOVED*** the window object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cached tick_ bound to the object for later use in the timer.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.boundTick_ = goog.bind(this.tick_, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Firefox browser often fires the timer event sooner
  ***REMOVED*** (sometimes MUCH sooner) than the requested timeout. So we
  ***REMOVED*** compare the time to when the event was last fired, and
  ***REMOVED*** reschedule if appropriate. See also goog.Timer.intervalScale
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.last_ = goog.now();
***REMOVED***
goog.inherits(goog.Timer, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Maximum timeout value.
***REMOVED***
***REMOVED*** Timeout values too big to fit into a signed 32-bit integer may cause
***REMOVED*** overflow in FF, Safari, and Chrome, resulting in the timeout being
***REMOVED*** scheduled immediately.  It makes more sense simply not to schedule these
***REMOVED*** timeouts, since 24.8 days is beyond a reasonable expectation for the
***REMOVED*** browser to stay open.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.Timer.MAX_TIMEOUT_ = 2147483647;


***REMOVED***
***REMOVED*** Whether this timer is enabled
***REMOVED*** @type {boolean}
***REMOVED***
goog.Timer.prototype.enabled = false;


***REMOVED***
***REMOVED*** An object that implements setTimout, setInterval, clearTimeout and
***REMOVED*** clearInterval. We default to the global object. Changing
***REMOVED*** goog.Timer.defaultTimerObject changes the object for all timer instances
***REMOVED*** which can be useful if your environment has some other implementation of
***REMOVED*** timers you'd like to use.
***REMOVED*** @type {Object}
***REMOVED***
goog.Timer.defaultTimerObject = goog.global;


***REMOVED***
***REMOVED*** A variable that controls the timer error correction. If the
***REMOVED*** timer is called before the requested interval times
***REMOVED*** intervalScale, which often happens on mozilla, the timer is
***REMOVED*** rescheduled. See also this.last_
***REMOVED*** @type {number}
***REMOVED***
goog.Timer.intervalScale = 0.8;


***REMOVED***
***REMOVED*** Variable for storing the result of setInterval
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.Timer.prototype.timer_ = null;


***REMOVED***
***REMOVED*** Gets the interval of the timer.
***REMOVED*** @return {number} interval Number of ms between ticks.
***REMOVED***
goog.Timer.prototype.getInterval = function() {
  return this.interval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the interval of the timer.
***REMOVED*** @param {number} interval Number of ms between ticks.
***REMOVED***
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if (this.timer_ && this.enabled) {
    // Stop and then start the timer to reset the interval.
    this.stop();
    this.start();
  } else if (this.timer_) {
    this.stop();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the setTimeout used by the timer
***REMOVED*** @private
***REMOVED***
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    if (elapsed > 0 &&
        elapsed < this.interval_***REMOVED*** goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_,
          this.interval_ - elapsed);
      return;
    }

    this.dispatchTick();
    // The timer could be stopped in the timer event handler.
    if (this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_,
          this.interval_);
      this.last_ = goog.now();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the TICK event. This is its own method so subclasses can override.
***REMOVED***
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the timer.
***REMOVED***
goog.Timer.prototype.start = function() {
  this.enabled = true;

  // If there is no interval already registered, start it now
  if (!this.timer_) {
    // IMPORTANT!
    // window.setInterval in FireFox has a bug - it fires based on
    // absolute time, rather than on relative time. What this means
    // is that if a computer is sleeping/hibernating for 24 hours
    // and the timer interval was configured to fire every 1000ms,
    // then after the PC wakes up the timer will fire, in rapid
    // succession, 3600*24 times.
    // This bug is described here and is already fixed, but it will
    // take time to propagate, so for now I am switching this over
    // to setTimeout logic.
    //     https://bugzilla.mozilla.org/show_bug.cgi?id=376643
    //
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_,
        this.interval_);
    this.last_ = goog.now();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stops the timer.
***REMOVED***
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if (this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
***REMOVED***


***REMOVED***
***REMOVED*** Constant for the timer's event type
***REMOVED*** @type {string}
***REMOVED***
goog.Timer.TICK = 'tick';


***REMOVED***
***REMOVED*** Calls the given function once, after the optional pause.
***REMOVED***
***REMOVED*** The function is always called asynchronously, even if the delay is 0. This
***REMOVED*** is a common trick to schedule a function to run after a batch of browser
***REMOVED*** event processing.
***REMOVED***
***REMOVED*** @param {Function} listener Function or object that has a handleEvent method.
***REMOVED*** @param {number=} opt_delay Milliseconds to wait; default is 0.
***REMOVED*** @param {Object=} opt_handler Object in whose scope to call the listener.
***REMOVED*** @return {number} A handle to the timer ID.
***REMOVED***
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    if (opt_handler) {
      listener = goog.bind(listener, opt_handler);
    }
  } else if (listener && typeof listener.handleEvent == 'function') {
    // using typeof to prevent strict js warning
    listener = goog.bind(listener.handleEvent, listener);
  } else {
    throw Error('Invalid listener argument');
  }

  if (opt_delay > goog.Timer.MAX_TIMEOUT_) {
    // Timeouts greater than MAX_INT return immediately due to integer
    // overflow in many browsers.  Since MAX_INT is 24.8 days, just don't
    // schedule anything at all.
    return -1;
  } else {
    return goog.Timer.defaultTimerObject.setTimeout(
        listener, opt_delay || 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears a timeout initiated by callOnce
***REMOVED*** @param {?number} timerId a timer ID.
***REMOVED***
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
***REMOVED***
