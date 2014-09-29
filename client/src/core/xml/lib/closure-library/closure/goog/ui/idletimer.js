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
***REMOVED*** @fileoverview Idle Timer.
***REMOVED***
***REMOVED*** Keeps track of transitions between active and idle. This class is built on
***REMOVED*** top of ActivityMonitor. Whenever an active user becomes idle, this class
***REMOVED*** dispatches a BECOME_IDLE event. Whenever an idle user becomes active, this
***REMOVED*** class dispatches a BECOME_ACTIVE event. The amount of inactive time it
***REMOVED*** takes for a user to be considered idle is specified by the client, and
***REMOVED*** different instances of this class can all use different thresholds.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.IdleTimer');
goog.require('goog.Timer');
***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.structs.Set');
goog.require('goog.ui.ActivityMonitor');



***REMOVED***
***REMOVED*** Event target that will give notification of state changes between active and
***REMOVED*** idle. This class is designed to require few resources while the user is
***REMOVED*** active.
***REMOVED*** @param {number} idleThreshold Amount of time in ms at which we consider the
***REMOVED***     user has gone idle.
***REMOVED*** @param {goog.ui.ActivityMonitor=} opt_activityMonitor The activity monitor
***REMOVED***     keeping track of user interaction. Defaults to a default-constructed
***REMOVED***     activity monitor. If a default activity monitor is used then this class
***REMOVED***     will dispose of it. If an activity monitor is passed in then the caller
***REMOVED***     remains responsible for disposing of it.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.IdleTimer = function(idleThreshold, opt_activityMonitor) {
  goog.events.EventTarget.call(this);

  var activityMonitor = opt_activityMonitor ||
      this.getDefaultActivityMonitor_();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The amount of time in ms at which we consider the user has gone idle
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.idleThreshold_ = idleThreshold;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The activity monitor keeping track of user interaction
  ***REMOVED*** @type {goog.ui.ActivityMonitor}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activityMonitor_ = activityMonitor;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cached onActivityTick_ bound to the object for later use
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.boundOnActivityTick_ = goog.bind(this.onActivityTick_, this);

  // Decide whether the user is currently active or idle. This method will
  // check whether it is correct to start with the user in the active state.
  this.maybeStillActive_();
***REMOVED***
goog.inherits(goog.ui.IdleTimer, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Whether a listener is currently registered for an idle timer event. On
***REMOVED*** initialization, the user is assumed to be active.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.hasActivityListener_ = false;


***REMOVED***
***REMOVED*** Handle to the timer ID used for checking ongoing activity, or null
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.onActivityTimerId_ = null;


***REMOVED***
***REMOVED*** Whether the user is currently idle
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.isIdle_ = false;


***REMOVED***
***REMOVED*** The default activity monitor created by this class, if any
***REMOVED*** @type {goog.ui.ActivityMonitor?}
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.defaultActivityMonitor_ = null;


***REMOVED***
***REMOVED*** The idle timers that currently reference the default activity monitor
***REMOVED*** @type {goog.structs.Set}
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.defaultActivityMonitorReferences_ = new goog.structs.Set();


***REMOVED***
***REMOVED*** Event constants for the idle timer event target
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.IdleTimer.Event = {
 ***REMOVED*****REMOVED*** Event fired when an idle user transitions into the active state***REMOVED***
  BECOME_ACTIVE: 'active',
 ***REMOVED*****REMOVED*** Event fired when an active user transitions into the idle state***REMOVED***
  BECOME_IDLE: 'idle'
***REMOVED***


***REMOVED***
***REMOVED*** Gets the default activity monitor used by this class. If a default has not
***REMOVED*** been created yet, then a new one will be created.
***REMOVED*** @return {goog.ui.ActivityMonitor} The default activity monitor.
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.getDefaultActivityMonitor_ = function() {
  goog.ui.IdleTimer.defaultActivityMonitorReferences_.add(this);
  if (goog.ui.IdleTimer.defaultActivityMonitor_ == null) {
    goog.ui.IdleTimer.defaultActivityMonitor_ = new goog.ui.ActivityMonitor();
  }
  return goog.ui.IdleTimer.defaultActivityMonitor_;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the reference to the default activity monitor. If there are no more
***REMOVED*** references then the default activity monitor gets disposed.
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.maybeDisposeDefaultActivityMonitor_ = function() {
  goog.ui.IdleTimer.defaultActivityMonitorReferences_.remove(this);
  if (goog.ui.IdleTimer.defaultActivityMonitor_ != null &&
      goog.ui.IdleTimer.defaultActivityMonitorReferences_.isEmpty()) {
    goog.ui.IdleTimer.defaultActivityMonitor_.dispose();
    goog.ui.IdleTimer.defaultActivityMonitor_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the user is active. If the user is still active, then a timer
***REMOVED*** is started to check again later.
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.maybeStillActive_ = function() {
  // See how long before the user would go idle. The user is considered idle
  // after the idle time has passed, not exactly when the idle time arrives.
  var remainingIdleThreshold = this.idleThreshold_ + 1 -
      (goog.now() - this.activityMonitor_.getLastEventTime());
  if (remainingIdleThreshold > 0) {
    // The user is still active. Check again later.
    this.onActivityTimerId_ = goog.Timer.callOnce(
        this.boundOnActivityTick_, remainingIdleThreshold);
  } else {
    // The user has not been active recently.
    this.becomeIdle_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the timeout used for checking ongoing activity
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.onActivityTick_ = function() {
  // The timer has fired.
  this.onActivityTimerId_ = null;

  // The maybeStillActive method will restart the timer, if appropriate.
  this.maybeStillActive_();
***REMOVED***


***REMOVED***
***REMOVED*** Transitions from the active state to the idle state
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.becomeIdle_ = function() {
  this.isIdle_ = true;

  // The idle timer will send notification when the user does something
  // interactive.
***REMOVED***this.activityMonitor_,
      goog.ui.ActivityMonitor.Event.ACTIVITY,
      this.onActivity_, false, this);
  this.hasActivityListener_ = true;

  // Notify clients of the state change.
  this.dispatchEvent(goog.ui.IdleTimer.Event.BECOME_IDLE);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for idle timer events when the user does something interactive
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.onActivity_ = function(e) {
  this.becomeActive_();
***REMOVED***


***REMOVED***
***REMOVED*** Transitions from the idle state to the active state
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.becomeActive_ = function() {
  this.isIdle_ = false;

  // Stop listening to every interactive event.
  this.removeActivityListener_();

  // Notify clients of the state change.
  this.dispatchEvent(goog.ui.IdleTimer.Event.BECOME_ACTIVE);

  // Periodically check whether the user has gone inactive.
  this.maybeStillActive_();
***REMOVED***


***REMOVED***
***REMOVED*** Removes the activity listener, if necessary
***REMOVED*** @private
***REMOVED***
goog.ui.IdleTimer.prototype.removeActivityListener_ = function() {
  if (this.hasActivityListener_) {
    goog.events.unlisten(this.activityMonitor_,
        goog.ui.ActivityMonitor.Event.ACTIVITY,
        this.onActivity_, false, this);
    this.hasActivityListener_ = false;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.IdleTimer.prototype.disposeInternal = function() {
  this.removeActivityListener_();
  if (this.onActivityTimerId_ != null) {
    goog.global.clearTimeout(this.onActivityTimerId_);
    this.onActivityTimerId_ = null;
  }
  this.maybeDisposeDefaultActivityMonitor_();
  goog.ui.IdleTimer.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} the amount of time at which we consider the user has gone
***REMOVED***     idle in ms.
***REMOVED***
goog.ui.IdleTimer.prototype.getIdleThreshold = function() {
  return this.idleThreshold_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.ActivityMonitor} the activity monitor keeping track of user
***REMOVED***     interaction.
***REMOVED***
goog.ui.IdleTimer.prototype.getActivityMonitor = function() {
  return this.activityMonitor_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if there has been no user action for at least the specified
***REMOVED*** interval, and false otherwise
***REMOVED*** @return {boolean} true if the user is idle, false otherwise.
***REMOVED***
goog.ui.IdleTimer.prototype.isIdle = function() {
  return this.isIdle_;
***REMOVED***
