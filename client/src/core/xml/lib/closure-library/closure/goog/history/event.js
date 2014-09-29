// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview The event object dispatched when the history changes.
***REMOVED***
***REMOVED***


goog.provide('goog.history.Event');

goog.require('goog.events.Event');
goog.require('goog.history.EventType');



***REMOVED***
***REMOVED*** Event object dispatched after the history state has changed.
***REMOVED*** @param {string} token The string identifying the new history state.
***REMOVED*** @param {boolean} isNavigation True if the event was triggered by a browser
***REMOVED***     action, such as forward or back, clicking on a link, editing the URL, or
***REMOVED***     calling {@code window.history.(go|back|forward)}.
***REMOVED***     False if the token has been changed by a {@code setToken} or
***REMOVED***     {@code replaceToken} call.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.history.Event = function(token, isNavigation) {
  goog.events.Event.call(this, goog.history.EventType.NAVIGATE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current history state.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.token = token;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the event was triggered by browser navigation.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.isNavigation = isNavigation;
***REMOVED***
goog.inherits(goog.history.Event, goog.events.Event);
