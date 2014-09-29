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
***REMOVED*** @fileoverview Basic animation controls.
***REMOVED***
***REMOVED***
goog.provide('goog.fx.anim');
goog.provide('goog.fx.anim.Animated');

goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.object');


***REMOVED***
***REMOVED*** An interface for programatically animated objects. I.e. rendered in
***REMOVED*** javascript frame by frame.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.fx.anim.Animated = function() {***REMOVED***


***REMOVED***
***REMOVED*** Function called when a frame is requested for the animation.
***REMOVED***
***REMOVED*** @param {number} now Current time in milliseconds.
***REMOVED***
goog.fx.anim.Animated.prototype.onAnimationFrame;


***REMOVED***
***REMOVED*** Default wait timeout for animations (in milliseconds).  Only used for timed
***REMOVED*** animation, which uses a timer (setTimeout) to schedule animation.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.fx.anim.TIMEOUT = goog.async.AnimationDelay.TIMEOUT;


***REMOVED***
***REMOVED*** A map of animations which should be cycled on the global timer.
***REMOVED***
***REMOVED*** @type {Object.<number, goog.fx.anim.Animated>}
***REMOVED*** @private
***REMOVED***
goog.fx.anim.activeAnimations_ = {***REMOVED***


***REMOVED***
***REMOVED*** An optional animation window.
***REMOVED*** @type {Window}
***REMOVED*** @private
***REMOVED***
goog.fx.anim.animationWindow_ = null;


***REMOVED***
***REMOVED*** An interval ID for the global timer or event handler uid.
***REMOVED*** @type {goog.async.Delay|goog.async.AnimationDelay}
***REMOVED*** @private
***REMOVED***
goog.fx.anim.animationDelay_ = null;


***REMOVED***
***REMOVED*** Registers an animation to be cycled on the global timer.
***REMOVED*** @param {goog.fx.anim.Animated} animation The animation to register.
***REMOVED***
goog.fx.anim.registerAnimation = function(animation) {
  var uid = goog.getUid(animation);
  if (!(uid in goog.fx.anim.activeAnimations_)) {
    goog.fx.anim.activeAnimations_[uid] = animation;
  }

  // If the timer is not already started, start it now.
  goog.fx.anim.requestAnimationFrame_();
***REMOVED***


***REMOVED***
***REMOVED*** Removes an animation from the list of animations which are cycled on the
***REMOVED*** global timer.
***REMOVED*** @param {goog.fx.anim.Animated} animation The animation to unregister.
***REMOVED***
goog.fx.anim.unregisterAnimation = function(animation) {
  var uid = goog.getUid(animation);
  delete goog.fx.anim.activeAnimations_[uid];

  // If a timer is running and we no longer have any active timers we stop the
  // timers.
  if (goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {
    goog.fx.anim.cancelAnimationFrame_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tears down this module. Useful for testing.
***REMOVED***
// TODO(nicksantos): Wow, this api is pretty broken. This should be fixed.
goog.fx.anim.tearDown = function() {
  goog.fx.anim.animationWindow_ = null;
  goog.dispose(goog.fx.anim.animationDelay_);
  goog.fx.anim.animationDelay_ = null;
  goog.fx.anim.activeAnimations_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Registers an animation window. This allows usage of the timing control API
***REMOVED*** for animations. Note that this window must be visible, as non-visible
***REMOVED*** windows can potentially stop animating. This window does not necessarily
***REMOVED*** need to be the window inside which animation occurs, but must remain visible.
***REMOVED*** See: https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame.
***REMOVED***
***REMOVED*** @param {Window} animationWindow The window in which to animate elements.
***REMOVED***
goog.fx.anim.setAnimationWindow = function(animationWindow) {
  // If a timer is currently running, reset it and restart with new functions
  // after a timeout. This is to avoid mismatching timer UIDs if we change the
  // animation window during a running animation.
  //
  // In practice this cannot happen before some animation window and timer
  // control functions has already been set.
  var hasTimer =
      goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.isActive();

  goog.dispose(goog.fx.anim.animationDelay_);
  goog.fx.anim.animationDelay_ = null;
  goog.fx.anim.animationWindow_ = animationWindow;

  // If the timer was running, start it again.
  if (hasTimer) {
    goog.fx.anim.requestAnimationFrame_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Requests an animation frame based on the requestAnimationFrame and
***REMOVED*** cancelRequestAnimationFrame function pair.
***REMOVED*** @private
***REMOVED***
goog.fx.anim.requestAnimationFrame_ = function() {
  if (!goog.fx.anim.animationDelay_) {
    // We cannot guarantee that the global window will be one that fires
    // requestAnimationFrame events (consider off-screen chrome extension
    // windows). Default to use goog.async.Delay, unless
    // the client has explicitly set an animation window.
    if (goog.fx.anim.animationWindow_) {
      // requestAnimationFrame will call cycleAnimations_ with the current
      // time in ms, as returned from goog.now().
      goog.fx.anim.animationDelay_ = new goog.async.AnimationDelay(
          function(now) {
        goog.fx.anim.cycleAnimations_(now);
      }, goog.fx.anim.animationWindow_);
    } else {
      goog.fx.anim.animationDelay_ = new goog.async.Delay(function() {
        goog.fx.anim.cycleAnimations_(goog.now());
      }, goog.fx.anim.TIMEOUT);
    }
  }

  var delay = goog.fx.anim.animationDelay_;
  if (!delay.isActive()) {
    delay.start();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels an animation frame created by requestAnimationFrame_().
***REMOVED*** @private
***REMOVED***
goog.fx.anim.cancelAnimationFrame_ = function() {
  if (goog.fx.anim.animationDelay_) {
    goog.fx.anim.animationDelay_.stop();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cycles through all registered animations.
***REMOVED*** @param {number} now Current time in milliseconds.
***REMOVED*** @private
***REMOVED***
goog.fx.anim.cycleAnimations_ = function(now) {
  goog.object.forEach(goog.fx.anim.activeAnimations_, function(anim) {
    anim.onAnimationFrame(now);
  });

  if (!goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {
    goog.fx.anim.requestAnimationFrame_();
  }
***REMOVED***
