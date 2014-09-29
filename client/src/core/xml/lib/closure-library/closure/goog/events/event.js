// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A base class for event objects.
***REMOVED***
***REMOVED***


goog.provide('goog.events.Event');
goog.provide('goog.events.EventLike');

// goog.events.Event no longer depends on goog.Disposable. Keep requiring
// goog.Disposable here to not break projects which assume this dependency.
goog.require('goog.Disposable');


***REMOVED***
***REMOVED*** A typedef for event like objects that are dispatchable via the
***REMOVED*** goog.events.dispatchEvent function. strings are treated as the type for a
***REMOVED*** goog.events.Event. Objects are treated as an extension of a new
***REMOVED*** goog.events.Event with the type property of the object being used as the type
***REMOVED*** of the Event.
***REMOVED*** @typedef {string|Object|goog.events.Event}
***REMOVED***
goog.events.EventLike;



***REMOVED***
***REMOVED*** A base class for event objects, so that they can support preventDefault and
***REMOVED*** stopPropagation.
***REMOVED***
***REMOVED*** @param {string} type Event Type.
***REMOVED*** @param {Object=} opt_target Reference to the object that is the target of
***REMOVED***     this event. It has to implement the {@code EventTarget} interface
***REMOVED***     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
***REMOVED***
***REMOVED***
goog.events.Event = function(type, opt_target) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Event type.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.type = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Target of the event.
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.target = opt_target;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object that had the listener attached.
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.currentTarget = this.target;
***REMOVED***


***REMOVED***
***REMOVED*** For backwards compatibility (goog.events.Event used to inherit
***REMOVED*** goog.Disposable).
***REMOVED*** @deprecated Events don't need to be disposed.
***REMOVED***
goog.events.Event.prototype.disposeInternal = function() {
***REMOVED***


***REMOVED***
***REMOVED*** For backwards compatibility (goog.events.Event used to inherit
***REMOVED*** goog.Disposable).
***REMOVED*** @deprecated Events don't need to be disposed.
***REMOVED***
goog.events.Event.prototype.dispose = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Whether to cancel the event in internal capture/bubble processing for IE.
***REMOVED*** @type {boolean}
***REMOVED*** @suppress {underscore} Technically public, but referencing this outside
***REMOVED***     this package is strongly discouraged.
***REMOVED***
goog.events.Event.prototype.propagationStopped_ = false;


***REMOVED***
***REMOVED*** Whether the default action has been prevented.
***REMOVED*** This is a property to match the W3C specification at {@link
***REMOVED*** http://www.w3.org/TR/DOM-Level-3-Events/#events-event-type-defaultPrevented}.
***REMOVED*** Must be treated as read-only outside the class.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.Event.prototype.defaultPrevented = false;


***REMOVED***
***REMOVED*** Return value for in internal capture/bubble processing for IE.
***REMOVED*** @type {boolean}
***REMOVED*** @suppress {underscore} Technically public, but referencing this outside
***REMOVED***     this package is strongly discouraged.
***REMOVED***
goog.events.Event.prototype.returnValue_ = true;


***REMOVED***
***REMOVED*** Stops event propagation.
***REMOVED***
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Prevents the default action, for example a link redirecting to a url.
***REMOVED***
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Stops the propagation of the event. It is equivalent to
***REMOVED*** {@code e.stopPropagation()}, but can be used as the callback argument of
***REMOVED*** {@link goog.events.listen} without declaring another function.
***REMOVED*** @param {!goog.events.Event} e An event.
***REMOVED***
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
***REMOVED***


***REMOVED***
***REMOVED*** Prevents the default action. It is equivalent to
***REMOVED*** {@code e.preventDefault()}, but can be used as the callback argument of
***REMOVED*** {@link goog.events.listen} without declaring another function.
***REMOVED*** @param {!goog.events.Event} e An event.
***REMOVED***
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
***REMOVED***
