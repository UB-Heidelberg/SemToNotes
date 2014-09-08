// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.events.EventId');



***REMOVED***
***REMOVED*** A templated class that is used when registering for events. Typical usage:
***REMOVED*** <code>
***REMOVED***  ***REMOVED*****REMOVED*** @type {goog.events.EventId.<MyEventObj>}
***REMOVED***   var myEventId = new goog.events.EventId(
***REMOVED***       goog.events.getUniqueId(('someEvent'));
***REMOVED***
***REMOVED***   // No need to cast or declare here since the compiler knows the correct
***REMOVED***   // type of 'evt' (MyEventObj).
***REMOVED***   something.listen(myEventId, function(evt) {});
***REMOVED*** </code>
***REMOVED***
***REMOVED*** @param {string} eventId
***REMOVED*** @template T
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED***
goog.events.EventId = function(eventId) {
 ***REMOVED*****REMOVED*** @const***REMOVED*** this.id = eventId;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.events.EventId.prototype.toString = function() {
  return this.id;
***REMOVED***
