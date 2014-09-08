// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition the goog.debug.RelativeTimeProvider class.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.RelativeTimeProvider');



***REMOVED***
***REMOVED*** A simple object to keep track of a timestamp considered the start of
***REMOVED*** something. The main use is for the logger system to maintain a start time
***REMOVED*** that is occasionally reset. For example, in Gmail, we reset this relative
***REMOVED*** time at the start of a user action so that timings are offset from the
***REMOVED*** beginning of the action. This class also provides a singleton as the default
***REMOVED*** behavior for most use cases is to share the same start time.
***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.debug.RelativeTimeProvider = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The start time.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.relativeTimeStart_ = goog.now();
***REMOVED***


***REMOVED***
***REMOVED*** Default instance.
***REMOVED*** @type {goog.debug.RelativeTimeProvider}
***REMOVED*** @private
***REMOVED***
goog.debug.RelativeTimeProvider.defaultInstance_ =
    new goog.debug.RelativeTimeProvider();


***REMOVED***
***REMOVED*** Sets the start time to the specified time.
***REMOVED*** @param {number} timeStamp The start time.
***REMOVED***
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the start time to now.
***REMOVED***
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The start time.
***REMOVED***
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.debug.RelativeTimeProvider} The default instance.
***REMOVED***
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
***REMOVED***
