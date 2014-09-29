// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a notice object that is used to encapsulates
***REMOVED*** information about a particular change/notification on an observable
***REMOVED*** object.
***REMOVED***

goog.provide('goog.labs.observe.Notice');



***REMOVED***
***REMOVED*** A notice object encapsulates information about a notification fired
***REMOVED*** by an observable.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable
***REMOVED***     object that fires this notice.
***REMOVED*** @param {*=} opt_data The optional data associated with this notice.
***REMOVED***
***REMOVED***
goog.labs.observe.Notice = function(observable, opt_data) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!goog.labs.observe.Observable}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.observable_ = observable;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.data_ = opt_data;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.labs.observe.Observable} The observable object that
***REMOVED***     fires this notice.
***REMOVED***
goog.labs.observe.Notice.prototype.getObservable = function() {
  return this.observable_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The optional data associated with this notice. May be
***REMOVED***     null/undefined.
***REMOVED***
goog.labs.observe.Notice.prototype.getData = function() {
  return this.data_;
***REMOVED***
