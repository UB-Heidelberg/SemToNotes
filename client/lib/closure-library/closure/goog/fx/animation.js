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
***REMOVED*** @fileoverview Classes for doing animations and visual effects.
***REMOVED***
***REMOVED*** (Based loosly on my animation code for 13thparallel.org, with extra
***REMOVED*** inspiration from the DojoToolkit's modifications to my code)
***REMOVED***

goog.provide('goog.fx.Animation');
goog.provide('goog.fx.Animation.EventType');
goog.provide('goog.fx.Animation.State');
goog.provide('goog.fx.AnimationEvent');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.fx.Transition');  // Unreferenced: interface
goog.require('goog.fx.Transition.EventType');
goog.require('goog.fx.TransitionBase.State');
goog.require('goog.fx.anim');
goog.require('goog.fx.anim.Animated');  // Unreferenced: interface



***REMOVED***
***REMOVED*** Constructor for an animation object.
***REMOVED*** @param {Array.<number>} start Array for start coordinates.
***REMOVED*** @param {Array.<number>} end Array for end coordinates.
***REMOVED*** @param {number} duration Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED***
***REMOVED*** @implements {goog.fx.anim.Animated}
***REMOVED*** @implements {goog.fx.Transition}
***REMOVED*** @extends {goog.fx.TransitionBase}
***REMOVED***
goog.fx.Animation = function(start, end, duration, opt_acc) {
  goog.fx.Animation.base(this, 'constructor');

  if (!goog.isArray(start) || !goog.isArray(end)) {
    throw Error('Start and end parameters must be arrays');
  }

  if (start.length != end.length) {
    throw Error('Start and end points must be the same length');
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Start point.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.startPoint = start;

 ***REMOVED*****REMOVED***
  ***REMOVED*** End point.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.endPoint = end;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Duration of animation in milliseconds.
  ***REMOVED*** @type {number}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.duration = duration;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Acceleration function, which must return a number between 0 and 1 for
  ***REMOVED*** inputs between 0 and 1.
  ***REMOVED*** @type {Function|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.accel_ = opt_acc;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Current coordinate for animation.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.coords = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the animation should use "right" rather than "left" to position
  ***REMOVED*** elements in RTL.  This is a temporary flag to allow clients to transition
  ***REMOVED*** to the new behavior at their convenience.  At some point it will be the
  ***REMOVED*** default.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.useRightPositioningForRtl_ = false;
***REMOVED***
goog.inherits(goog.fx.Animation, goog.fx.TransitionBase);


***REMOVED***
***REMOVED*** Sets whether the animation should use "right" rather than "left" to position
***REMOVED*** elements.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new component at their convenience.  At some point "right" will be
***REMOVED*** used for RTL elements by default.
***REMOVED*** @param {boolean} useRightPositioningForRtl True if "right" should be used for
***REMOVED***     positioning, false if "left" should be used for positioning.
***REMOVED***
goog.fx.Animation.prototype.enableRightPositioningForRtl =
    function(useRightPositioningForRtl) {
  this.useRightPositioningForRtl_ = useRightPositioningForRtl;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the animation should use "right" rather than "left" to position
***REMOVED*** elements.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new component at their convenience.  At some point "right" will be
***REMOVED*** used for RTL elements by default.
***REMOVED*** @return {boolean} True if "right" should be used for positioning, false if
***REMOVED***     "left" should be used for positioning.
***REMOVED***
goog.fx.Animation.prototype.isRightPositioningForRtlEnabled = function() {
  return this.useRightPositioningForRtl_;
***REMOVED***


***REMOVED***
***REMOVED*** Events fired by the animation.
***REMOVED*** @enum {string}
***REMOVED***
goog.fx.Animation.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when played for the first time OR when it is resumed.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.PLAY.
 ***REMOVED*****REMOVED***
  PLAY: goog.fx.Transition.EventType.PLAY,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched only when the animation starts from the beginning.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.BEGIN.
 ***REMOVED*****REMOVED***
  BEGIN: goog.fx.Transition.EventType.BEGIN,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched only when animation is restarted after a pause.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.RESUME.
 ***REMOVED*****REMOVED***
  RESUME: goog.fx.Transition.EventType.RESUME,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when animation comes to the end of its duration OR stop
  ***REMOVED*** is called.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.END.
 ***REMOVED*****REMOVED***
  END: goog.fx.Transition.EventType.END,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched only when stop is called.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.STOP.
 ***REMOVED*****REMOVED***
  STOP: goog.fx.Transition.EventType.STOP,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched only when animation comes to its end naturally.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.FINISH.
 ***REMOVED*****REMOVED***
  FINISH: goog.fx.Transition.EventType.FINISH,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when an animation is paused.
  ***REMOVED*** @deprecated Use goog.fx.Transition.EventType.PAUSE.
 ***REMOVED*****REMOVED***
  PAUSE: goog.fx.Transition.EventType.PAUSE,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched each frame of the animation.  This is where the actual animator
  ***REMOVED*** will listen.
 ***REMOVED*****REMOVED***
  ANIMATE: 'animate',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when the animation is destroyed.
 ***REMOVED*****REMOVED***
  DESTROY: 'destroy'
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Use goog.fx.anim.TIMEOUT.
***REMOVED***
goog.fx.Animation.TIMEOUT = goog.fx.anim.TIMEOUT;


***REMOVED***
***REMOVED*** Enum for the possible states of an animation.
***REMOVED*** @deprecated Use goog.fx.Transition.State instead.
***REMOVED*** @enum {number}
***REMOVED***
goog.fx.Animation.State = goog.fx.TransitionBase.State;


***REMOVED***
***REMOVED*** @deprecated Use goog.fx.anim.setAnimationWindow.
***REMOVED*** @param {Window} animationWindow The window in which to animate elements.
***REMOVED***
goog.fx.Animation.setAnimationWindow = function(animationWindow) {
  goog.fx.anim.setAnimationWindow(animationWindow);
***REMOVED***


***REMOVED***
***REMOVED*** Current frame rate.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.Animation.prototype.fps_ = 0;


***REMOVED***
***REMOVED*** Percent of the way through the animation.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED***
goog.fx.Animation.prototype.progress = 0;


***REMOVED***
***REMOVED*** Timestamp for when last frame was run.
***REMOVED*** @type {?number}
***REMOVED*** @protected
***REMOVED***
goog.fx.Animation.prototype.lastFrame = null;


***REMOVED***
***REMOVED*** Starts or resumes an animation.
***REMOVED*** @param {boolean=} opt_restart Whether to restart the
***REMOVED***     animation from the beginning if it has been paused.
***REMOVED*** @return {boolean} Whether animation was started.
***REMOVED*** @override
***REMOVED***
goog.fx.Animation.prototype.play = function(opt_restart) {
  if (opt_restart || this.isStopped()) {
    this.progress = 0;
    this.coords = this.startPoint;
  } else if (this.isPlaying()) {
    return false;
  }

  goog.fx.anim.unregisterAnimation(this);

  var now =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (goog.now());

  this.startTime = now;
  if (this.isPaused()) {
    this.startTime -= this.duration***REMOVED*** this.progress;
  }

  this.endTime = this.startTime + this.duration;
  this.lastFrame = this.startTime;

  if (!this.progress) {
    this.onBegin();
  }

  this.onPlay();

  if (this.isPaused()) {
    this.onResume();
  }

  this.setStatePlaying();

  goog.fx.anim.registerAnimation(this);
  this.cycle(now);

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Stops the animation.
***REMOVED*** @param {boolean=} opt_gotoEnd If true the animation will move to the
***REMOVED***     end coords.
***REMOVED*** @override
***REMOVED***
goog.fx.Animation.prototype.stop = function(opt_gotoEnd) {
  goog.fx.anim.unregisterAnimation(this);
  this.setStateStopped();

  if (!!opt_gotoEnd) {
    this.progress = 1;
  }

  this.updateCoords_(this.progress);

  this.onStop();
  this.onEnd();
***REMOVED***


***REMOVED***
***REMOVED*** Pauses the animation (iff it's playing).
***REMOVED*** @override
***REMOVED***
goog.fx.Animation.prototype.pause = function() {
  if (this.isPlaying()) {
    goog.fx.anim.unregisterAnimation(this);
    this.setStatePaused();
    this.onPause();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The current progress of the animation, the number
***REMOVED***     is between 0 and 1 inclusive.
***REMOVED***
goog.fx.Animation.prototype.getProgress = function() {
  return this.progress;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the progress of the animation.
***REMOVED*** @param {number} progress The new progress of the animation.
***REMOVED***
goog.fx.Animation.prototype.setProgress = function(progress) {
  this.progress = progress;
  if (this.isPlaying()) {
    var now = goog.now();
    // If the animation is already playing, we recompute startTime and endTime
    // such that the animation plays consistently, that is:
    // now = startTime + progress***REMOVED*** duration.
    this.startTime = now - this.duration***REMOVED*** this.progress;
    this.endTime = this.startTime + this.duration;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the animation.  Stops an animation, fires a 'destroy' event and
***REMOVED*** then removes all the event handlers to clean up memory.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.fx.Animation.prototype.disposeInternal = function() {
  if (!this.isStopped()) {
    this.stop(false);
  }
  this.onDestroy();
  goog.fx.Animation.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Stops an animation, fires a 'destroy' event and then removes all the event
***REMOVED*** handlers to clean up memory.
***REMOVED*** @deprecated Use dispose() instead.
***REMOVED***
goog.fx.Animation.prototype.destroy = function() {
  this.dispose();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.Animation.prototype.onAnimationFrame = function(now) {
  this.cycle(now);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the actual iteration of the animation in a timeout
***REMOVED*** @param {number} now The current time.
***REMOVED***
goog.fx.Animation.prototype.cycle = function(now) {
  this.progress = (now - this.startTime) / (this.endTime - this.startTime);

  if (this.progress >= 1) {
    this.progress = 1;
  }

  this.fps_ = 1000 / (now - this.lastFrame);
  this.lastFrame = now;

  this.updateCoords_(this.progress);

  // Animation has finished.
  if (this.progress == 1) {
    this.setStateStopped();
    goog.fx.anim.unregisterAnimation(this);

    this.onFinish();
    this.onEnd();

  // Animation is still under way.
  } else if (this.isPlaying()) {
    this.onAnimate();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calculates current coordinates, based on the current state.  Applies
***REMOVED*** the accelleration function if it exists.
***REMOVED*** @param {number} t Percentage of the way through the animation as a decimal.
***REMOVED*** @private
***REMOVED***
goog.fx.Animation.prototype.updateCoords_ = function(t) {
  if (goog.isFunction(this.accel_)) {
    t = this.accel_(t);
  }
  this.coords = new Array(this.startPoint.length);
  for (var i = 0; i < this.startPoint.length; i++) {
    this.coords[i] = (this.endPoint[i] - this.startPoint[i])***REMOVED*** t +
        this.startPoint[i];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the ANIMATE event. Sub classes should override this instead
***REMOVED*** of listening to the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.Animation.prototype.onAnimate = function() {
  this.dispatchAnimationEvent(goog.fx.Animation.EventType.ANIMATE);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the DESTROY event. Sub classes should override this instead
***REMOVED*** of listening to the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.Animation.prototype.onDestroy = function() {
  this.dispatchAnimationEvent(goog.fx.Animation.EventType.DESTROY);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.Animation.prototype.dispatchAnimationEvent = function(type) {
  this.dispatchEvent(new goog.fx.AnimationEvent(type, this));
***REMOVED***



***REMOVED***
***REMOVED*** Class for an animation event object.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.fx.Animation} anim An animation object.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.fx.AnimationEvent = function(type, anim) {
  goog.fx.AnimationEvent.base(this, 'constructor', type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current coordinates.
  ***REMOVED*** @type {Array.<number>}
 ***REMOVED*****REMOVED***
  this.coords = anim.coords;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The x coordinate.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.x = anim.coords[0];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The y coordinate.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.y = anim.coords[1];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The z coordinate.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.z = anim.coords[2];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current duration.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.duration = anim.duration;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current progress.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.progress = anim.getProgress();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Frames per second so far.
 ***REMOVED*****REMOVED***
  this.fps = anim.fps_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The state of the animation.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.state = anim.getStateInternal();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The animation object.
  ***REMOVED*** @type {goog.fx.Animation}
 ***REMOVED*****REMOVED***
  // TODO(arv): This can be removed as this is the same as the target
  this.anim = anim;
***REMOVED***
goog.inherits(goog.fx.AnimationEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Returns the coordinates as integers (rounded to nearest integer).
***REMOVED*** @return {!Array.<number>} An array of the coordinates rounded to
***REMOVED***     the nearest integer.
***REMOVED***
goog.fx.AnimationEvent.prototype.coordsAsInts = function() {
  return goog.array.map(this.coords, Math.round);
***REMOVED***
