// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An abstract base class for transitions. This is a simple
***REMOVED*** interface that allows for playing, pausing and stopping an animation. It adds
***REMOVED*** a simple event model, and animation status.
***REMOVED***
goog.provide('goog.fx.TransitionBase');
goog.provide('goog.fx.TransitionBase.State');

goog.require('goog.events.EventTarget');
goog.require('goog.fx.Transition');  // Unreferenced: interface
goog.require('goog.fx.Transition.EventType');



***REMOVED***
***REMOVED*** Constructor for a transition object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.fx.Transition}
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.fx.TransitionBase = function() {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The internal state of the animation.
  ***REMOVED*** @type {goog.fx.TransitionBase.State}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.state_ = goog.fx.TransitionBase.State.STOPPED;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timestamp for when the animation was started.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.startTime = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timestamp for when the animation finished or was stopped.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.endTime = null;
***REMOVED***
goog.inherits(goog.fx.TransitionBase, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum for the possible states of an animation.
***REMOVED*** @enum {number}
***REMOVED***
goog.fx.TransitionBase.State = {
  STOPPED: 0,
  PAUSED: -1,
  PLAYING: 1
***REMOVED***


***REMOVED***
***REMOVED*** Plays the animation.
***REMOVED***
***REMOVED*** @param {boolean=} opt_restart Optional parameter to restart the animation.
***REMOVED*** @return {boolean} True iff the animation was started.
***REMOVED*** @override
***REMOVED***
goog.fx.TransitionBase.prototype.play = goog.abstractMethod;


***REMOVED***
***REMOVED*** Stops the animation.
***REMOVED***
***REMOVED*** @param {boolean=} opt_gotoEnd Optional boolean parameter to go the the end of
***REMOVED***     the animation.
***REMOVED*** @override
***REMOVED***
goog.fx.TransitionBase.prototype.stop = goog.abstractMethod;


***REMOVED***
***REMOVED*** Pauses the animation.
***REMOVED***
goog.fx.TransitionBase.prototype.pause = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the current state of the animation.
***REMOVED*** @return {goog.fx.TransitionBase.State} State of the animation.
***REMOVED***
goog.fx.TransitionBase.prototype.getStateInternal = function() {
  return this.state_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current state of the animation to playing.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.setStatePlaying = function() {
  this.state_ = goog.fx.TransitionBase.State.PLAYING;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current state of the animation to paused.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.setStatePaused = function() {
  this.state_ = goog.fx.TransitionBase.State.PAUSED;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current state of the animation to stopped.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.setStateStopped = function() {
  this.state_ = goog.fx.TransitionBase.State.STOPPED;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True iff the current state of the animation is playing.
***REMOVED***
goog.fx.TransitionBase.prototype.isPlaying = function() {
  return this.state_ == goog.fx.TransitionBase.State.PLAYING;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True iff the current state of the animation is paused.
***REMOVED***
goog.fx.TransitionBase.prototype.isPaused = function() {
  return this.state_ == goog.fx.TransitionBase.State.PAUSED;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True iff the current state of the animation is stopped.
***REMOVED***
goog.fx.TransitionBase.prototype.isStopped = function() {
  return this.state_ == goog.fx.TransitionBase.State.STOPPED;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the BEGIN event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onBegin = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.BEGIN);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the END event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onEnd = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.END);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the FINISH event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onFinish = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.FINISH);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the PAUSE event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onPause = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PAUSE);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the PLAY event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onPlay = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.PLAY);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the RESUME event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onResume = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.RESUME);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the STOP event. Sub classes should override this instead
***REMOVED*** of listening to the event, and call this instead of dispatching the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.onStop = function() {
  this.dispatchAnimationEvent(goog.fx.Transition.EventType.STOP);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches an event object for the current animation.
***REMOVED*** @param {string} type Event type that will be dispatched.
***REMOVED*** @protected
***REMOVED***
goog.fx.TransitionBase.prototype.dispatchAnimationEvent = function(type) {
  this.dispatchEvent(type);
***REMOVED***
