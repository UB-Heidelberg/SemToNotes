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
***REMOVED*** @fileoverview A wrapper for the HTML5 File ProgressEvent objects.
***REMOVED***
***REMOVED***
goog.provide('goog.fs.ProgressEvent');

goog.require('goog.events.Event');



***REMOVED***
***REMOVED*** A wrapper for the progress events emitted by the File APIs.
***REMOVED***
***REMOVED*** @param {!ProgressEvent} event The underlying event object.
***REMOVED*** @param {!Object} target The file access object emitting the event.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.fs.ProgressEvent = function(event, target) {
  goog.fs.ProgressEvent.base(this, 'constructor', event.type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying event object.
  ***REMOVED*** @type {!ProgressEvent}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.event_ = event;
***REMOVED***
goog.inherits(goog.fs.ProgressEvent, goog.events.Event);


***REMOVED***
***REMOVED*** @return {boolean} Whether or not the total size of the of the file being
***REMOVED***     saved is known.
***REMOVED***
goog.fs.ProgressEvent.prototype.isLengthComputable = function() {
  return this.event_.lengthComputable;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of bytes saved so far.
***REMOVED***
goog.fs.ProgressEvent.prototype.getLoaded = function() {
  return this.event_.loaded;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The total number of bytes in the file being saved.
***REMOVED***
goog.fs.ProgressEvent.prototype.getTotal = function() {
  return this.event_.total;
***REMOVED***
