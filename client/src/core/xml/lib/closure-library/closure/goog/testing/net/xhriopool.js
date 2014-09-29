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
***REMOVED*** @fileoverview An XhrIo pool that uses a single mock XHR object for testing.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.net.XhrIoPool');

goog.require('goog.net.XhrIoPool');
goog.require('goog.testing.net.XhrIo');



***REMOVED***
***REMOVED*** A pool containing a single mock XhrIo object.
***REMOVED***
***REMOVED*** @param {goog.testing.net.XhrIo=} opt_xhr The mock XhrIo object.
***REMOVED***
***REMOVED*** @extends {goog.net.XhrIoPool}
***REMOVED***
goog.testing.net.XhrIoPool = function(opt_xhr) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The mock XhrIo object.
  ***REMOVED*** @type {!goog.testing.net.XhrIo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xhr_ = opt_xhr || new goog.testing.net.XhrIo();

  // Run this after setting xhr_ because xhr_ is used to initialize the pool.
  goog.base(this, undefined, 1, 1);
***REMOVED***
goog.inherits(goog.testing.net.XhrIoPool, goog.net.XhrIoPool);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @suppress {invalidCasts}
***REMOVED***
goog.testing.net.XhrIoPool.prototype.createObject = function() {
  return (***REMOVED*** @type {!goog.net.XhrIo}***REMOVED*** (this.xhr_));
***REMOVED***


***REMOVED***
***REMOVED*** Get the mock XhrIo used by this pool.
***REMOVED***
***REMOVED*** @return {!goog.testing.net.XhrIo} The mock XhrIo.
***REMOVED***
goog.testing.net.XhrIoPool.prototype.getXhr = function() {
  return this.xhr_;
***REMOVED***
