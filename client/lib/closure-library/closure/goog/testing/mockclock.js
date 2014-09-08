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
***REMOVED*** @fileoverview Mock Clock implementation for working with setTimeout,
***REMOVED*** setInterval, clearTimeout and clearInterval within unit tests.
***REMOVED***
***REMOVED*** Derived from jsUnitMockTimeout.js, contributed to JsUnit by
***REMOVED*** Pivotal Computer Systems, www.pivotalsf.com
***REMOVED***
***REMOVED***

goog.provide('goog.testing.MockClock');

goog.require('goog.Disposable');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.events');
goog.require('goog.testing.events.Event');
goog.require('goog.testing.watchers');



***REMOVED***
***REMOVED*** Class for unit testing code that uses setTimeout and clearTimeout.
***REMOVED***
***REMOVED*** NOTE: If you are using MockClock to test code that makes use of
***REMOVED***       goog.fx.Animation, then you must either:
***REMOVED***
***REMOVED*** 1. Install and dispose of the MockClock in setUpPage() and tearDownPage()
***REMOVED***    respectively (rather than setUp()/tearDown()).
***REMOVED***
***REMOVED*** or
***REMOVED***
***REMOVED*** 2. Ensure that every test clears the animation queue by calling
***REMOVED***    mockClock.tick(x) at the end of each test function (where `x` is large
***REMOVED***    enough to complete all animations).
***REMOVED***
***REMOVED*** Otherwise, if any animation is left pending at the time that
***REMOVED*** MockClock.dispose() is called, that will permanently prevent any future
***REMOVED*** animations from playing on the page.
***REMOVED***
***REMOVED*** @param {boolean=} opt_autoInstall Install the MockClock at construction time.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED***
goog.testing.MockClock = function(opt_autoInstall) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reverse-order queue of timers to fire.
  ***REMOVED***
  ***REMOVED*** The last item of the queue is popped off.  Insertion happens from the
  ***REMOVED*** right.  For example, the expiration times for each element of the queue
  ***REMOVED*** might be in the order 300, 200, 200.
  ***REMOVED***
  ***REMOVED*** @type {Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.queue_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Set of timeouts that should be treated as cancelled.
  ***REMOVED***
  ***REMOVED*** Rather than removing cancelled timers directly from the queue, this set
  ***REMOVED*** simply marks them as deleted so that they can be ignored when their
  ***REMOVED*** turn comes up.  The keys are the timeout keys that are cancelled, each
  ***REMOVED*** mapping to true.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deletedKeys_ = {***REMOVED***

  if (opt_autoInstall) {
    this.install();
  }
***REMOVED***
goog.inherits(goog.testing.MockClock, goog.Disposable);


***REMOVED***
***REMOVED*** Default wait timeout for mocking requestAnimationFrame (in milliseconds).
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.testing.MockClock.REQUEST_ANIMATION_FRAME_TIMEOUT = 20;


***REMOVED***
***REMOVED*** Count of the number of timeouts made.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.timeoutsMade_ = 0;


***REMOVED***
***REMOVED*** PropertyReplacer instance which overwrites and resets setTimeout,
***REMOVED*** setInterval, etc. or null if the MockClock is not installed.
***REMOVED*** @type {goog.testing.PropertyReplacer}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.replacer_ = null;


***REMOVED***
***REMOVED*** Map of deleted keys.  These keys represents keys that were deleted in a
***REMOVED*** clearInterval, timeoutid -> object.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.deletedKeys_ = null;


***REMOVED***
***REMOVED*** The current simulated time in milliseconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.nowMillis_ = 0;


***REMOVED***
***REMOVED*** Additional delay between the time a timeout was set to fire, and the time
***REMOVED*** it actually fires.  Useful for testing workarounds for this Firefox 2 bug:
***REMOVED*** https://bugzilla.mozilla.org/show_bug.cgi?id=291386
***REMOVED*** May be negative.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.timeoutDelay_ = 0;


***REMOVED***
***REMOVED*** Installs the MockClock by overriding the global object's implementation of
***REMOVED*** setTimeout, setInterval, clearTimeout and clearInterval.
***REMOVED***
goog.testing.MockClock.prototype.install = function() {
  if (!this.replacer_) {
    var r = this.replacer_ = new goog.testing.PropertyReplacer();
    r.set(goog.global, 'setTimeout', goog.bind(this.setTimeout_, this));
    r.set(goog.global, 'setInterval', goog.bind(this.setInterval_, this));
    r.set(goog.global, 'setImmediate', goog.bind(this.setImmediate_, this));
    r.set(goog.global, 'clearTimeout', goog.bind(this.clearTimeout_, this));
    r.set(goog.global, 'clearInterval', goog.bind(this.clearInterval_, this));

    // Replace the requestAnimationFrame functions.
    this.replaceRequestAnimationFrame_();

    // PropertyReplacer#set can't be called with renameable functions.
    this.oldGoogNow_ = goog.now;
    goog.now = goog.bind(this.getCurrentTime, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Installs the mocks for requestAnimationFrame and cancelRequestAnimationFrame.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.replaceRequestAnimationFrame_ = function() {
  var r = this.replacer_;
  var requestFuncs = ['requestAnimationFrame',
                      'webkitRequestAnimationFrame',
                      'mozRequestAnimationFrame',
                      'oRequestAnimationFrame',
                      'msRequestAnimationFrame'];

  var cancelFuncs = ['cancelRequestAnimationFrame',
                     'webkitCancelRequestAnimationFrame',
                     'mozCancelRequestAnimationFrame',
                     'oCancelRequestAnimationFrame',
                     'msCancelRequestAnimationFrame'];

  for (var i = 0; i < requestFuncs.length; ++i) {
    if (goog.global && goog.global[requestFuncs[i]]) {
      r.set(goog.global, requestFuncs[i],
          goog.bind(this.requestAnimationFrame_, this));
    }
  }

  for (var i = 0; i < cancelFuncs.length; ++i) {
    if (goog.global && goog.global[cancelFuncs[i]]) {
      r.set(goog.global, cancelFuncs[i],
          goog.bind(this.cancelRequestAnimationFrame_, this));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the MockClock's hooks into the global object's functions and revert
***REMOVED*** to their original values.
***REMOVED***
goog.testing.MockClock.prototype.uninstall = function() {
  if (this.replacer_) {
    this.replacer_.reset();
    this.replacer_ = null;
    goog.now = this.oldGoogNow_;
  }

  this.fireResetEvent();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.MockClock.prototype.disposeInternal = function() {
  this.uninstall();
  this.queue_ = null;
  this.deletedKeys_ = null;
  goog.testing.MockClock.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Resets the MockClock, removing all timeouts that are scheduled and resets
***REMOVED*** the fake timer count.
***REMOVED***
goog.testing.MockClock.prototype.reset = function() {
  this.queue_ = [];
  this.deletedKeys_ = {***REMOVED***
  this.nowMillis_ = 0;
  this.timeoutsMade_ = 0;
  this.timeoutDelay_ = 0;

  this.fireResetEvent();
***REMOVED***


***REMOVED***
***REMOVED*** Signals that the mock clock has been reset, allowing objects that
***REMOVED*** maintain their own internal state to reset.
***REMOVED***
goog.testing.MockClock.prototype.fireResetEvent = function() {
  goog.testing.watchers.signalClockReset();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the amount of time between when a timeout is scheduled to fire and when
***REMOVED*** it actually fires.
***REMOVED*** @param {number} delay The delay in milliseconds.  May be negative.
***REMOVED***
goog.testing.MockClock.prototype.setTimeoutDelay = function(delay) {
  this.timeoutDelay_ = delay;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} delay The amount of time between when a timeout is
***REMOVED***     scheduled to fire and when it actually fires, in milliseconds.  May
***REMOVED***     be negative.
***REMOVED***
goog.testing.MockClock.prototype.getTimeoutDelay = function() {
  return this.timeoutDelay_;
***REMOVED***


***REMOVED***
***REMOVED*** Increments the MockClock's time by a given number of milliseconds, running
***REMOVED*** any functions that are now overdue.
***REMOVED*** @param {number=} opt_millis Number of milliseconds to increment the counter.
***REMOVED***     If not specified, clock ticks 1 millisecond.
***REMOVED*** @return {number} Current mock time in milliseconds.
***REMOVED***
goog.testing.MockClock.prototype.tick = function(opt_millis) {
  if (typeof opt_millis != 'number') {
    opt_millis = 1;
  }
  var endTime = this.nowMillis_ + opt_millis;
  this.runFunctionsWithinRange_(endTime);
  this.nowMillis_ = endTime;
  return endTime;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of timeouts that have been scheduled.
***REMOVED***
goog.testing.MockClock.prototype.getTimeoutsMade = function() {
  return this.timeoutsMade_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The MockClock's current time in milliseconds.
***REMOVED***
goog.testing.MockClock.prototype.getCurrentTime = function() {
  return this.nowMillis_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} timeoutKey The timeout key.
***REMOVED*** @return {boolean} Whether the timer has been set and not cleared,
***REMOVED***     independent of the timeout's expiration.  In other words, the timeout
***REMOVED***     could have passed or could be scheduled for the future.  Either way,
***REMOVED***     this function returns true or false depending only on whether the
***REMOVED***     provided timeoutKey represents a timeout that has been set and not
***REMOVED***     cleared.
***REMOVED***
goog.testing.MockClock.prototype.isTimeoutSet = function(timeoutKey) {
  return timeoutKey <= this.timeoutsMade_ && !this.deletedKeys_[timeoutKey];
***REMOVED***


***REMOVED***
***REMOVED*** Runs any function that is scheduled before a certain time.  Timeouts can
***REMOVED*** be made to fire early or late if timeoutDelay_ is non-0.
***REMOVED*** @param {number} endTime The latest time in the range, in milliseconds.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.runFunctionsWithinRange_ = function(
    endTime) {
  var adjustedEndTime = endTime - this.timeoutDelay_;

  // Repeatedly pop off the last item since the queue is always sorted.
  while (this.queue_ && this.queue_.length &&
      this.queue_[this.queue_.length - 1].runAtMillis <= adjustedEndTime) {
    var timeout = this.queue_.pop();

    if (!(timeout.timeoutKey in this.deletedKeys_)) {
      // Only move time forwards.
      this.nowMillis_ = Math.max(this.nowMillis_,
          timeout.runAtMillis + this.timeoutDelay_);
      // Call timeout in global scope and pass the timeout key as the argument.
      timeout.funcToCall.call(goog.global, timeout.timeoutKey);
      // In case the interval was cleared in the funcToCall
      if (timeout.recurring) {
        this.scheduleFunction_(
            timeout.timeoutKey, timeout.funcToCall, timeout.millis, true);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a function to be run at a certain time.
***REMOVED*** @param {number} timeoutKey The timeout key.
***REMOVED*** @param {Function} funcToCall The function to call.
***REMOVED*** @param {number} millis The number of milliseconds to call it in.
***REMOVED*** @param {boolean} recurring Whether to function call should recur.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.scheduleFunction_ = function(
    timeoutKey, funcToCall, millis, recurring) {
  if (!goog.isFunction(funcToCall)) {
    // Early error for debuggability rather than dying in the next .tick()
    throw new TypeError('The provided callback must be a function, not a ' +
        typeof funcToCall);
  }

  var timeout = {
    runAtMillis: this.nowMillis_ + millis,
    funcToCall: funcToCall,
    recurring: recurring,
    timeoutKey: timeoutKey,
    millis: millis
 ***REMOVED*****REMOVED***

  goog.testing.MockClock.insert_(timeout, this.queue_);
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a timer descriptor into a descending-order queue.
***REMOVED***
***REMOVED*** Later-inserted duplicates appear at lower indices.  For example, the
***REMOVED*** asterisk in (5,4,*,3,2,1) would be the insertion point for 3.
***REMOVED***
***REMOVED*** @param {Object} timeout The timeout to insert, with numerical runAtMillis
***REMOVED***     property.
***REMOVED*** @param {Array.<Object>} queue The queue to insert into, with each element
***REMOVED***     having a numerical runAtMillis property.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.insert_ = function(timeout, queue) {
  // Although insertion of N items is quadratic, requiring goog.structs.Heap
  // from a unit test will make tests more prone to breakage.  Since unit
  // tests are normally small, scalability is not a primary issue.

  // Find an insertion point.  Since the queue is in reverse order (so we
  // can pop rather than unshift), and later timers with the same time stamp
  // should be executed later, we look for the element strictly greater than
  // the one we are inserting.

  for (var i = queue.length; i != 0; i--) {
    if (queue[i - 1].runAtMillis > timeout.runAtMillis) {
      break;
    }
    queue[i] = queue[i - 1];
  }

  queue[i] = timeout;
***REMOVED***


***REMOVED***
***REMOVED*** Maximum 32-bit signed integer.
***REMOVED***
***REMOVED*** Timeouts over this time return immediately in many browsers, due to integer
***REMOVED*** overflow.  Such known browsers include Firefox, Chrome, and Safari, but not
***REMOVED*** IE.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.MAX_INT_ = 2147483647;


***REMOVED***
***REMOVED*** Schedules a function to be called after {@code millis} milliseconds.
***REMOVED*** Mock implementation for setTimeout.
***REMOVED*** @param {Function} funcToCall The function to call.
***REMOVED*** @param {number} millis The number of milliseconds to call it after.
***REMOVED*** @return {number} The number of timeouts created.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.setTimeout_ = function(funcToCall, millis) {
  if (millis > goog.testing.MockClock.MAX_INT_) {
    throw Error(
        'Bad timeout value: ' + millis + '.  Timeouts over MAX_INT ' +
        '(24.8 days) cause timeouts to be fired ' +
        'immediately in most browsers, except for IE.');
  }
  this.timeoutsMade_ = this.timeoutsMade_ + 1;
  this.scheduleFunction_(this.timeoutsMade_, funcToCall, millis, false);
  return this.timeoutsMade_;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a function to be called every {@code millis} milliseconds.
***REMOVED*** Mock implementation for setInterval.
***REMOVED*** @param {Function} funcToCall The function to call.
***REMOVED*** @param {number} millis The number of milliseconds between calls.
***REMOVED*** @return {number} The number of timeouts created.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.setInterval_ = function(funcToCall, millis) {
  this.timeoutsMade_ = this.timeoutsMade_ + 1;
  this.scheduleFunction_(this.timeoutsMade_, funcToCall, millis, true);
  return this.timeoutsMade_;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a function to be called when an animation frame is triggered.
***REMOVED*** Mock implementation for requestAnimationFrame.
***REMOVED*** @param {Function} funcToCall The function to call.
***REMOVED*** @return {number} The number of timeouts created.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.requestAnimationFrame_ = function(funcToCall) {
  return this.setTimeout_(goog.bind(function() {
    if (funcToCall) {
      funcToCall(this.getCurrentTime());
    } else if (goog.global.mozRequestAnimationFrame) {
      var event = new goog.testing.events.Event('MozBeforePaint', goog.global);
      event['timeStamp'] = this.getCurrentTime();
      goog.testing.events.fireBrowserEvent(event);
    }
  }, this), goog.testing.MockClock.REQUEST_ANIMATION_FRAME_TIMEOUT);
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a function to be called immediately after the current JS
***REMOVED*** execution.
***REMOVED*** Mock implementation for setImmediate.
***REMOVED*** @param {Function} funcToCall The function to call.
***REMOVED*** @return {number} The number of timeouts created.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.setImmediate_ = function(funcToCall) {
  return this.setTimeout_(funcToCall, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Clears a timeout.
***REMOVED*** Mock implementation for clearTimeout.
***REMOVED*** @param {number} timeoutKey The timeout key to clear.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.clearTimeout_ = function(timeoutKey) {
  // Some common libraries register static state with timers.
  // This is bad. It leads to all sorts of crazy test problems where
  // 1) Test A sets up a new mock clock and a static timer.
  // 2) Test B sets up a new mock clock, but re-uses the static timer
  //    from Test A.
  // 3) A timeout key from test A gets cleared, breaking a timeout in
  //    Test B.
  //
  // For now, we just hackily fail silently if someone tries to clear a timeout
  // key before we've allocated it.
  // Ideally, we should throw an exception if we see this happening.
  //
  // TODO(user): We might also try allocating timeout ids from a global
  // pool rather than a local pool.
  if (this.isTimeoutSet(timeoutKey)) {
    this.deletedKeys_[timeoutKey] = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears an interval.
***REMOVED*** Mock implementation for clearInterval.
***REMOVED*** @param {number} timeoutKey The interval key to clear.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.clearInterval_ = function(timeoutKey) {
  this.clearTimeout_(timeoutKey);
***REMOVED***


***REMOVED***
***REMOVED*** Clears a requestAnimationFrame.
***REMOVED*** Mock implementation for cancelRequestAnimationFrame.
***REMOVED*** @param {number} timeoutKey The requestAnimationFrame key to clear.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClock.prototype.cancelRequestAnimationFrame_ =
    function(timeoutKey) {
  this.clearTimeout_(timeoutKey);
***REMOVED***
