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
***REMOVED*** @fileoverview An interface for transition animation. This is a simple
***REMOVED*** interface that allows for playing and stopping a transition. It adds
***REMOVED*** a simple event model with BEGIN and END event.
***REMOVED***
***REMOVED***

goog.provide('goog.fx.Transition');
goog.provide('goog.fx.Transition.EventType');



***REMOVED***
***REMOVED*** An interface for programmatic transition. Must extend
***REMOVED*** {@code goog.events.EventTarget}.
***REMOVED*** @interface
***REMOVED***
goog.fx.Transition = function() {***REMOVED***


***REMOVED***
***REMOVED*** Transition event types.
***REMOVED*** @enum {string}
***REMOVED***
goog.fx.Transition.EventType = {
 ***REMOVED*****REMOVED*** Dispatched when played for the first time OR when it is resumed.***REMOVED***
  PLAY: 'play',

 ***REMOVED*****REMOVED*** Dispatched only when the animation starts from the beginning.***REMOVED***
  BEGIN: 'begin',

 ***REMOVED*****REMOVED*** Dispatched only when animation is restarted after a pause.***REMOVED***
  RESUME: 'resume',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when animation comes to the end of its duration OR stop
  ***REMOVED*** is called.
 ***REMOVED*****REMOVED***
  END: 'end',

 ***REMOVED*****REMOVED*** Dispatched only when stop is called.***REMOVED***
  STOP: 'stop',

 ***REMOVED*****REMOVED*** Dispatched only when animation comes to its end naturally.***REMOVED***
  FINISH: 'finish',

 ***REMOVED*****REMOVED*** Dispatched when an animation is paused.***REMOVED***
  PAUSE: 'pause'
***REMOVED***


***REMOVED***
***REMOVED*** Plays the transition.
***REMOVED***
goog.fx.Transition.prototype.play;


***REMOVED***
***REMOVED*** Stops the transition.
***REMOVED***
goog.fx.Transition.prototype.stop;
