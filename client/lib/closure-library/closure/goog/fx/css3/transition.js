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
***REMOVED*** @fileoverview CSS3 transition base library.
***REMOVED***
***REMOVED***

goog.provide('goog.fx.css3.Transition');

goog.require('goog.Timer');
goog.require('goog.fx.TransitionBase');
goog.require('goog.style');
goog.require('goog.style.transition');



***REMOVED***
***REMOVED*** A class to handle targeted CSS3 transition. This class
***REMOVED*** handles common features required for targeted CSS3 transition.
***REMOVED***
***REMOVED*** Browser that does not support CSS3 transition will still receive all
***REMOVED*** the events fired by the transition object, but will not have any transition
***REMOVED*** played. If the browser supports the final state as set in setFinalState
***REMOVED*** method, the element will ends in the final state.
***REMOVED***
***REMOVED*** Transitioning multiple properties with the same setting is possible
***REMOVED*** by setting Css3Property's property to 'all'. Performing multiple
***REMOVED*** transitions can be done via setting multiple initialStyle,
***REMOVED*** finalStyle and transitions. Css3Property's delay can be used to
***REMOVED*** delay one of the transition. Here is an example for a transition
***REMOVED*** that expands on the width and then followed by the height:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   initialStyle: {width: 10px, height: 10px}
***REMOVED***   finalStyle: {width: 100px, height: 100px}
***REMOVED***   transitions: [
***REMOVED***     {property: width, duration: 1, timing: 'ease-in', delay: 0},
***REMOVED***     {property: height, duration: 1, timing: 'ease-in', delay: 1}
***REMOVED***   ]
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {Element} element The element to be transitioned.
***REMOVED*** @param {number} duration The duration of the transition in seconds.
***REMOVED***     This should be the longest of all transitions.
***REMOVED*** @param {Object} initialStyle Initial style properties of the element before
***REMOVED***     animating. Set using {@code goog.style.setStyle}.
***REMOVED*** @param {Object} finalStyle Final style properties of the element after
***REMOVED***     animating. Set using {@code goog.style.setStyle}.
***REMOVED*** @param {goog.style.transition.Css3Property|
***REMOVED***     Array.<goog.style.transition.Css3Property>} transitions A single CSS3
***REMOVED***     transition property or an array of it.
***REMOVED*** @extends {goog.fx.TransitionBase}
***REMOVED***
***REMOVED***
goog.fx.css3.Transition = function(
    element, duration, initialStyle, finalStyle, transitions) {
  goog.fx.css3.Transition.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.duration_ = duration;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initialStyle_ = initialStyle;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.finalStyle_ = finalStyle;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Array.<goog.style.transition.Css3Property>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.transitions_ = goog.isArray(transitions) ? transitions : [transitions];
***REMOVED***
goog.inherits(goog.fx.css3.Transition, goog.fx.TransitionBase);


***REMOVED***
***REMOVED*** Timer id to be used to cancel animation part-way.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.css3.Transition.prototype.timerId_;


***REMOVED*** @override***REMOVED***
goog.fx.css3.Transition.prototype.play = function() {
  if (this.isPlaying()) {
    return false;
  }

  this.onBegin();
  this.onPlay();

  this.startTime = goog.now();
  this.setStatePlaying();

  if (goog.style.transition.isSupported()) {
    goog.style.setStyle(this.element_, this.initialStyle_);
    // Allow element to get updated to its initial state before installing
    // CSS3 transition.
    this.timerId_ = goog.Timer.callOnce(this.play_, undefined, this);
    return true;
  } else {
    this.stop_(false);
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method for play method. This needs to be executed on a timer.
***REMOVED*** @private
***REMOVED***
goog.fx.css3.Transition.prototype.play_ = function() {
  goog.style.transition.set(this.element_, this.transitions_);
  goog.style.setStyle(this.element_, this.finalStyle_);
  this.timerId_ = goog.Timer.callOnce(
      goog.bind(this.stop_, this, false), this.duration_***REMOVED*** 1000);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.css3.Transition.prototype.stop = function() {
  if (!this.isPlaying()) return;

  this.stop_(true);
***REMOVED***


***REMOVED***
***REMOVED*** Helper method for stop method.
***REMOVED*** @param {boolean} stopped If the transition was stopped.
***REMOVED*** @private
***REMOVED***
goog.fx.css3.Transition.prototype.stop_ = function(stopped) {
  goog.style.transition.removeAll(this.element_);

  // Clear the timer.
  goog.Timer.clear(this.timerId_);

  // Make sure that we have reached the final style.
  goog.style.setStyle(this.element_, this.finalStyle_);

  this.endTime = goog.now();
  this.setStateStopped();

  if (stopped) {
    this.onStop();
  } else {
    this.onFinish();
  }
  this.onEnd();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.css3.Transition.prototype.disposeInternal = function() {
  this.stop();
  goog.fx.css3.Transition.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Pausing CSS3 Transitions in not supported.
***REMOVED*** @override
***REMOVED***
goog.fx.css3.Transition.prototype.pause = function() {
  goog.asserts.assert(false, 'Css3 transitions does not support pause action.');
***REMOVED***
