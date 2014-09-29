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
***REMOVED*** @fileoverview Mock ProgressEvent object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.ProgressEvent');

goog.require('goog.events.Event');



***REMOVED***
***REMOVED*** A mock progress event.
***REMOVED***
***REMOVED*** @param {!goog.fs.FileSaver.EventType|!goog.fs.FileReader.EventType} type
***REMOVED***     Event type.
***REMOVED*** @param {number} loaded The number of bytes processed.
***REMOVED*** @param {number} total The total data that was to be processed, in bytes.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.testing.fs.ProgressEvent = function(type, loaded, total) {
  goog.base(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of bytes processed.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.loaded_ = loaded;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The total data that was to be procesed, in bytes.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.total_ = total;
***REMOVED***
goog.inherits(goog.testing.fs.ProgressEvent, goog.events.Event);


***REMOVED***
***REMOVED*** @see {goog.fs.ProgressEvent#isLengthComputable}
***REMOVED*** @return {boolean} True if the length is known.
***REMOVED***
goog.testing.fs.ProgressEvent.prototype.isLengthComputable = function() {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.ProgressEvent#getLoaded}
***REMOVED*** @return {number} The number of bytes loaded or written.
***REMOVED***
goog.testing.fs.ProgressEvent.prototype.getLoaded = function() {
  return this.loaded_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.ProgressEvent#getTotal}
***REMOVED*** @return {number} The total bytes to load or write.
***REMOVED***
goog.testing.fs.ProgressEvent.prototype.getTotal = function() {
  return this.total_;
***REMOVED***
