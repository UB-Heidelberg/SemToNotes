// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.pubsub.TopicId');



***REMOVED***
***REMOVED*** A templated class that is used to register {@code goog.pubsub.PubSub}
***REMOVED*** subscribers.
***REMOVED***
***REMOVED*** Typical usage for a publisher:
***REMOVED*** <code>
***REMOVED***  ***REMOVED*****REMOVED*** @type {!goog.pubsub.TopicId.<!zorg.State>}
***REMOVED***   zorg.TopicId.STATE_CHANGE = new goog.pubsub.TopicId(
***REMOVED***       goog.events.getUniqueId('state-change'));
***REMOVED***
***REMOVED***   // Compiler enforces that these types are correct.
***REMOVED***   pubSub.publish(zorg.TopicId.STATE_CHANGE, zorg.State.STARTED);
***REMOVED*** </code>
***REMOVED***
***REMOVED*** Typical usage for a subscriber:
***REMOVED*** <code>
***REMOVED***   // Compiler enforces the callback parameter type.
***REMOVED***   pubSub.subscribe(zorg.TopicId.STATE_CHANGE, function(state) {
***REMOVED***     if (state == zorg.State.STARTED) {
***REMOVED***       // Handle STARTED state.
***REMOVED***     }
***REMOVED***   });
***REMOVED*** </code>
***REMOVED***
***REMOVED*** @param {string} topicId
***REMOVED*** @template PAYLOAD
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED***
goog.pubsub.TopicId = function(topicId) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.topicId_ = topicId;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.pubsub.TopicId.prototype.toString = function() {
  return this.topicId_;
***REMOVED***
