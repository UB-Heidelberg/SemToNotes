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
***REMOVED*** @fileoverview Event observer.
***REMOVED***
***REMOVED*** Provides an event observer that holds onto events that it handles.  This
***REMOVED*** can be used in unit testing to verify an event target's events --
***REMOVED*** that the order count, types, etc. are correct.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED*** <pre>
***REMOVED*** var observer = new goog.testing.events.EventObserver();
***REMOVED*** var widget = new foo.Widget();
***REMOVED*** goog.events.listen(widget, ['select', 'submit'], observer);
***REMOVED*** // Simulate user action of 3 select events and 2 submit events.
***REMOVED*** assertEquals(3, observer.getEvents('select').length);
***REMOVED*** assertEquals(2, observer.getEvents('submit').length);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.testing.events.EventObserver');

goog.require('goog.array');



***REMOVED***
***REMOVED*** Event observer.  Implements a handleEvent interface so it may be used as
***REMOVED*** a listener in listening functions and methods.
***REMOVED*** @see goog.events.listen
***REMOVED*** @see goog.events.EventHandler
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.events.EventObserver = function() {

 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of events handled by the observer in order of handling, oldest to
  ***REMOVED*** newest.
  ***REMOVED*** @type {!Array.<!goog.events.Event>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.events_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Handles an event and remembers it.  Event listening functions and methods
***REMOVED*** will call this method when this observer is used as a listener.
***REMOVED*** @see goog.events.listen
***REMOVED*** @see goog.events.EventHandler
***REMOVED*** @param {!goog.events.Event} e Event to handle.
***REMOVED***
goog.testing.events.EventObserver.prototype.handleEvent = function(e) {
  this.events_.push(e);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string=} opt_type If given, only return events of this type.
***REMOVED*** @return {!Array.<!goog.events.Event>} The events handled, oldest to newest.
***REMOVED***
goog.testing.events.EventObserver.prototype.getEvents = function(opt_type) {
  var events = goog.array.clone(this.events_);

  if (opt_type) {
    events = goog.array.filter(events, function(event) {
      return event.type == opt_type;
    });
  }

  return events;
***REMOVED***
