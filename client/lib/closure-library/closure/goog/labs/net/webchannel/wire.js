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

***REMOVED***
***REMOVED*** @fileoverview Interface and shared data structures for implementing
***REMOVED*** different wire protocol versions.
***REMOVED*** @visibility {//closure/goog/bin/sizetests:__pkg__}
***REMOVED***


goog.provide('goog.labs.net.webChannel.Wire');



***REMOVED***
***REMOVED*** The interface class.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.labs.net.webChannel.Wire = function() {***REMOVED***


goog.scope(function() {
var Wire = goog.labs.net.webChannel.Wire;


***REMOVED***
***REMOVED*** The latest protocol version that this class supports. We request this version
***REMOVED*** from the server when opening the connection. Should match
***REMOVED*** LATEST_CHANNEL_VERSION on the server code.
***REMOVED*** @type {number}
***REMOVED***
Wire.LATEST_CHANNEL_VERSION = 8;



***REMOVED***
***REMOVED*** Simple container class for a (mapId, map) pair.
***REMOVED*** @param {number} mapId The id for this map.
***REMOVED*** @param {!Object|!goog.structs.Map} map The map itself.
***REMOVED*** @param {!Object=} opt_context The context associated with the map.
***REMOVED***
***REMOVED*** @struct
***REMOVED***
Wire.QueuedMap = function(mapId, map, opt_context) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The id for this map.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.mapId = mapId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map itself.
  ***REMOVED*** @type {!Object|!goog.structs.Map}
 ***REMOVED*****REMOVED***
  this.map = map;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The context for the map.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.context = opt_context || null;
***REMOVED***
});  // goog.scope
